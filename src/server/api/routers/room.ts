import { randomBytes } from "crypto";
import { z } from "zod";

import {
  createTRPCRouter,
  // publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const roomRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),

  findUnique: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.room.findUnique({
        where: { id: input.id },
        include: { members: true },
      });
    }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.roomId) {
      const oldRoom = await ctx.prisma.room.findUnique({
        where: { id: ctx.session.user.roomId },
        include: { members: true },
      });
      if (oldRoom?.members.length && oldRoom?.members.length <= 1) {
        await ctx.prisma.room.delete({
          where: { id: ctx.session.user.roomId },
        });
      }
    }

    let code;
    do {
      code = randomBytes(2).toString("hex").toLowerCase();
    } while (await ctx.prisma.room.findUnique({ where: { id: code } }));

    return await ctx.prisma.room.create({
      data: {
        id: code,
        members: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),
  join: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.room.update({
        where: {
          id: input.id,
        },
        data: {
          members: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
