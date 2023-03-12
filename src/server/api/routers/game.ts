import { z } from "zod";
import { invalidateRoom } from "~/pages/api/pusher";
import { createId } from "@paralleldrive/cuid2";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({
  start: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const membersQuery = await ctx.prisma.room.findUnique({
        where: { id: input.id },
        select: {
          members: {
            orderBy: { joinedRoomOn: "asc" },
            include: { board: true },
          },
        },
      });
      const makeBoards =
        membersQuery?.members.map((user) => {
          console.log(user);
          return ctx.prisma.user.update({
            where: { id: user?.id ?? "" },
            data: {
              board: {
                create: {
                  roomId: input.id,
                  tiles: {
                    createMany: {
                      data: new Array(25)
                        .fill(0)
                        .map((_, i) => ({ value: -1, idx: i })),
                    },
                  },
                },
              },
            },
          });
        }) ?? [];

      await ctx.prisma.$transaction([
        ctx.prisma.room.update({
          where: { id: input.id },
          data: { playing: true, seed: createId() },
        }),
        ...makeBoards,
      ]);

      await invalidateRoom(input.id, ctx.session.user);
    }),

  reset: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const end = await ctx.prisma.room.update({
        where: { id: input.id },
        data: { playing: false },
      });
      await invalidateRoom(input.id, ctx.session.user);
      return end;
    }),

  end: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const end = await ctx.prisma.room.delete({
        where: { id: input.id },
      });
      await invalidateRoom(input.id, ctx.session.user, "/");
      return end;
    }),
});
