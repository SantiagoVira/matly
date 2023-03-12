/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import Board from "~/components/board";
import Layout from "~/components/shared/layout";
import { api } from "~/utils/api";
import * as sr from "seedrandom";
import Pusher from "pusher-js";
import { env } from "~/env.mjs";
import Leaderboard from "~/components/room/leaderboard";
import useWindowSize from "~/utils/useWindowSize";
import SuperJSON from "superjson";
import type { User } from "@prisma/client";

const Room: React.FC = () => {
  const router = useRouter();
  const pusher = useRef<Pusher>();
  const ctx = api.useContext();
  const { isMobile } = useWindowSize();

  const [idx, setIdx] = useState(0);

  const scoreBoard = api.board.score.useMutation({
    onSuccess: async () => {
      await ctx.invalidate();
      document.dispatchEvent(new Event("visibilitychange"));
    },
  });

  const boardQuery = api.board.findDailyUnique.useQuery();
  const board = boardQuery.data;

  useEffect(() => {
    // Connect to pusher
    if (!pusher.current) {
      pusher.current = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
        userAuthentication: {
          endpoint: "/api/pusher/auth",
          transport: "ajax",
        },
      });

      pusher.current.unsubscribe("daily");
      pusher.current.unbind_all();
      pusher.current.subscribe("daily");
      pusher.current.bind("invalidate", async (d: { raw: string }) => {
        console.log("Recieved invalidate message");
        await ctx.room.invalidate();
        const data: {
          userId: string;
          redeemedAt: number;
          user: User;
          path?: string;
        } = SuperJSON.parse(d.raw);
        if (data.path) {
          await router.push(data.path);
        }

        document.dispatchEvent(new Event("visibilitychange"));
      });
    }

    return () => {
      if (pusher.current) {
        pusher.current.disconnect();
        pusher.current = undefined;
      }
    };
  }, [ctx, router]);

  useEffect(() => {
    // Finalize board scoring
    if (idx === 25 && board?.score === -1) {
      scoreBoard.mutate({ daily: true });
      setIdx(26);
    }
  }, [idx, scoreBoard, setIdx, board]);

  useEffect(() => {
    // Pick up previous progress
    setIdx(board?.tiles?.filter((t) => t.value > 0).length ?? 0);
  }, [board]);

  const nums: number[] = useMemo(
    () =>
      new Array(25)
        .fill(0)
        .map(
          (_, i) =>
            Math.floor(
              sr.default(
                `${new Date().toDateString()}-daily-matly` + i.toString()
              )() * 10
            ) + 1
        ),
    []
  );

  return (
    <Layout title="Daily Game">
      <div className="flex w-full items-center justify-between px-8 pt-4">
        <h1 className=" text-left">
          <span className="text-highlight">Daily</span>
          {isMobile ? "" : " Room"}
        </h1>
      </div>

      <div className="my-4 w-full px-8">
        <hr className="w-full border-[#9e9e9e] " />
      </div>
      <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start md:gap-0">
        <div className="flex flex-[2] flex-col items-center justify-center">
          <h3 className=" text-center">
            {idx >= 25 ? "Done!" : "Number: "}
            <span className="text-highlight">{nums[idx]}</span>
          </h3>
          <div className="flex flex-col items-center justify-center">
            <Board
              nums={nums}
              idx={idx}
              board={board}
              stepNext={() => {
                setIdx((i) => i + 1);
              }}
            />
          </div>
        </div>
        {/* {idx >= 25 && (
          <div className="flex flex-1 flex-col items-start justify-start">
            <h4 className="flex-1 text-left">Leaderboard</h4>{" "}
            <Leaderboard room={room} />
          </div>
        )} */}
      </div>
    </Layout>
  );
};

export default Room;
