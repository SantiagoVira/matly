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

      await invalidateRoom(input.id);

      return await ctx.prisma.$transaction([
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
    }),

  leave: protectedProcedure.mutation(async ({ ctx }) => {
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

  getBoard: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) return null;
    return await ctx.prisma.board.findUnique({
      where: { userId: ctx.session.user.id },
      include: { tiles: true },
    });
  }),

  scoreBoard: protectedProcedure.mutation(async ({ ctx }) => {
    let score = 0;
    const board = await ctx.prisma.board.findUnique({
      where: { userId: ctx.session.user.id },
      include: { tiles: true },
    });

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
      await invalidateRoom(board?.roomId);
    }

    return updateScore;
  }),

  startGame: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const membersQuery = await ctx.prisma.room.findUnique({
        where: { id: input.id },
        select: { members: { orderBy: { joinedRoomOn: "asc" } } },
      });
      const makeBoards =
        membersQuery?.members.map((user) =>
          ctx.prisma.user.update({
            where: { id: user?.id ?? "" },
            data: {
              board: {
                disconnect: true,
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
          })
        ) ?? [];

      await ctx.prisma.$transaction([
        ctx.prisma.room.update({
          where: { id: input.id },
          data: { playing: true },
        }),
        ...makeBoards,
      ]);

      await invalidateRoom(input.id);
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
