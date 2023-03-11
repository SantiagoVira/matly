import { randomBytes } from "crypto";
import { z } from "zod";
import { invalidateRoom } from "~/pages/api/pusher";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const roomRouter = createTRPCRouter({
  findUnique: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session) return null;
      return await ctx.prisma.room.findUnique({
        where: { id: input.id },
        include: {
          members: {
            orderBy: { joinedRoomOn: "asc" },
            include: { board: true },
          },
        },
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

    return await ctx.prisma.$transaction([
      ctx.prisma.room.create({
        data: {
          id: code,
          members: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      }),
      ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { joinedRoomOn: new Date() },
      }),
    ]);
  }),

  join: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
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

      const execute = await ctx.prisma.$transaction([
        ctx.prisma.room.update({
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
        }),
        ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: { joinedRoomOn: new Date() },
        }),
      ]);

      await invalidateRoom(input.id, ctx.session.user);

      return execute;
    }),

  leave: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.roomId) {
      const oldRoom = await ctx.prisma.room.findUnique({
        where: { id: ctx.session.user.roomId },
        include: { members: true },
      });
      if (oldRoom?.members.length && oldRoom?.members.length <= 1) {
        await invalidateRoom(ctx.session.user.roomId, ctx.session.user, "/");
        await ctx.prisma.room.delete({
          where: { id: ctx.session.user.roomId },
        });
      }
    }

    return await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        room: {
          disconnect: true,
        },
      },
      select: {
        room: true,
      },
    });
  }),
});

export type RoomRouter = typeof roomRouter;
