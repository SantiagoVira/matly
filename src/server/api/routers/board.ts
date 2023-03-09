import { z } from "zod";
import { invalidateRoom } from "~/pages/api/pusher";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const boardRouter = createTRPCRouter({
  findUnique: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) return null;
    return await ctx.prisma.board.findUnique({
      where: { userId: ctx.session.user.id },
      include: { tiles: true },
    });
  }),

  score: protectedProcedure.mutation(async ({ ctx }) => {
    let score = 0;
    const board = await ctx.prisma.board.findUnique({
      where: { userId: ctx.session.user.id },
      include: { tiles: true },
    });

    if (board?.tiles.filter((t) => t.value === -1).length) return;

    if (board?.tiles) {
      for (let y = 0; y < 5; y++) {
        let streak = 1;
        let lastNum: number = board.tiles[y * 5 + 0]?.value ?? 0;
        for (let x = 1; x < 5; x++) {
          if (board.tiles[y * 5 + x]?.value === lastNum) streak++;
          else {
            if (streak > 1) score += lastNum * streak;
            streak = 1;
          }
          lastNum = board.tiles[y * 5 + x]?.value ?? 0;
        }
        if (streak > 1) score += lastNum * streak;
      }

      for (let x = 0; x < 5; x++) {
        let streak = 1;
        let lastNum: number = board.tiles[x]?.value ?? 0;
        for (let y = 1; y < 5; y++) {
          if (board.tiles[y * 5 + x]?.value === lastNum) streak++;
          else {
            if (streak > 1) score += lastNum * streak;
            streak = 1;
          }
          lastNum = board.tiles[y * 5 + x]?.value ?? 0;
        }
        if (streak > 1) score += lastNum * streak;
      }
    }

    const updateScore = await ctx.prisma.board.update({
      where: { userId: ctx.session.user.id },
      data: { score: score },
    });

    if (board) {
      await invalidateRoom(board?.roomId, ctx.session.user);
    }

    return updateScore;
  }),

  placeNumber: protectedProcedure
    .input(z.object({ idx: z.number(), value: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const board = await ctx.prisma.board.findUnique({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });

      return await ctx.prisma.tile.update({
        where: { boardId_idx: { boardId: board?.id ?? "", idx: input.idx } },
        data: { value: input.value },
      });
    }),
});
