/* eslint-disable @typescript-eslint/no-misused-promises */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import Board from "~/components/board";
import Layout from "~/components/shared/layout";
import Button from "~/components/ui/button";
import { api } from "~/utils/api";
import * as sr from "seedrandom";
import Pusher from "pusher-js";
import { env } from "~/env.mjs";
import Leaderboard from "~/components/room/leaderboard";
import MemberList from "~/components/room/member-list";
import RoomNotFound from "~/components/room/room-not-found";
import Loading from "~/components/loading";
import useWindowSize from "~/utils/useWindowSize";
import SuperJSON from "superjson";
import type { User } from "@prisma/client";
import CloseRoomButton from "~/components/room/close-room-button";
import { useToast } from "~/utils/use-toast";
import HowToLink from "~/components/how-to-link";
import { cn } from "~/utils/cn";
import { calculateScore } from "~/utils/score-board";

const Room: React.FC = () => {
  const router = useRouter();
  const pusher = useRef<Pusher>();
  const ctx = api.useUtils();
  const { data: sessionData, status } = useSession();
  const { isMobile } = useWindowSize();
  const { toast } = useToast();

  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const id = router.query.id?.toString();

  const startGame = api.game.start.useMutation({
    onSuccess: async () => {
      await ctx.invalidate();
      document.dispatchEvent(new Event("visibilitychange"));
    },
  });
  const resetGame = api.game.reset.useMutation({
    onSuccess: async () => {
      await ctx.invalidate();
    },
  });
  const scoreBoard = api.board.score.useMutation({
    onSuccess: async () => {
      await ctx.invalidate();
      document.dispatchEvent(new Event("visibilitychange"));
    },
  });

  const roomQuery = api.room.findUnique.useQuery({ id: id ?? "" });
  const room = roomQuery.data;
  const boardQuery = api.board.findUnique.useQuery(void ``, {
    onSuccess: (data) => {
      const newIdx = data?.tiles?.filter((t) => t.value > 0).length ?? 0;
      if (newIdx > idx || newIdx === 0) {
        setIdx(newIdx);
      }

      if (data?.score === -1 && newIdx >= 25) {
        scoreBoard.mutate({});
      }
    },
  });
  const board = boardQuery.data;

  useEffect(() => {
    // Connect to pusher
    if (id && !pusher.current) {
      pusher.current = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
        userAuthentication: {
          endpoint: "/api/pusher/auth",
          transport: "ajax",
        },
      });

      pusher.current.unsubscribe(id);
      pusher.current.unbind_all();
      pusher.current.subscribe(id);
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
          toast({
            title: `Room ${id.toUpperCase()} closed`,
            description: "Redirecting to home",
          });
          await router.push(data.path);
        }

        document.dispatchEvent(new Event("visibilitychange"));
        await ctx.board.invalidate();
      });
    }

    return () => {
      if (pusher.current) {
        pusher.current.disconnect();
        pusher.current = undefined;
      }
    };
  }, [id, ctx, router, toast]);

  const nums: number[] = useMemo(
    () =>
      new Array(25)
        .fill(0)
        .map(
          (_, i) =>
            Math.floor(
              sr.default((room?.seed ?? "helloworld") + i.toString())() * 10
            ) + 1
        ),
    [room?.seed]
  );

  if (roomQuery.status === "loading") return <Loading />;

  if (
    (status === "authenticated" &&
      sessionData?.user.id &&
      !room?.members.map((user) => user.id).includes(sessionData?.user.id)) ||
    !room
  )
    return <RoomNotFound />;

  return (
    <Layout
      title={`Room ${(id ?? "").toUpperCase()}`}
      loading={!room?.members.map((user) => user.id)}
    >
      <div className="flex w-full items-center justify-between px-8 pt-4">
        <h1 className=" text-left">
          {isMobile ? "" : "Room "}
          <span className="text-highlight">{id?.toUpperCase()}</span>
        </h1>
        {room?.members[0]?.id === sessionData?.user.id && (
          <div className="flex items-center gap-4">
            {room.playing && (
              <Button
                onClick={async () => {
                  await resetGame.mutateAsync({ id: id ?? "" });
                }}
                className="font-medium text-highlight"
                disabled={startGame.isLoading || resetGame.isLoading}
              >
                Reset{isMobile ? "" : " Game"}
              </Button>
            )}
            {!room.playing && (
              <Button
                onClick={async () => {
                  await startGame.mutateAsync({ id: id ?? "" });
                }}
                className="font-medium text-highlight"
                disabled={startGame.isLoading || resetGame.isLoading}
              >
                Start
                {isMobile ? "" : " Game"}
              </Button>
            )}

            <CloseRoomButton id={id} />
          </div>
        )}
      </div>

      <div className="my-4 w-full px-8">
        <hr className="w-full border-[#9e9e9e] " />
      </div>
      {room.playing ? (
        <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start md:gap-0">
          <div className="flex flex-[2] flex-col items-center justify-center">
            <div className="flex w-[20rem] items-end justify-between px-4 pb-3 md:w-[30rem]">
              <p className="text-left text-2xl">
                {idx >= 25 ? "Done!" : "Number: "}
                {idx < 25 && (
                  <span
                    className={cn(
                      "inline-block w-12 font-bold text-highlight",
                      loading && "text-transparent"
                    )}
                  >
                    {nums[idx]}
                  </span>
                )}
              </p>
              <p className="text-right text-2xl">
                Score: {calculateScore(board?.tiles.map((t) => t.value) ?? [])}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Board
                nums={nums}
                idx={idx}
                board={board}
                stepNext={() => {
                  setIdx((i) => i + 1);
                }}
                loading={loading}
                setLoading={setLoading}
                checkWin={() => {
                  if (idx + 1 === 25 && board?.score === -1) {
                    scoreBoard.mutate({});
                    return 26;
                  }
                }}
              />
            </div>
            <HowToLink />
          </div>
          {idx >= 25 && (
            <div className="flex flex-1 flex-col items-start justify-start">
              <h4 className="flex-1 text-left">Leaderboard</h4>{" "}
              <Leaderboard room={room} />
            </div>
          )}
        </div>
      ) : (
        <MemberList room={room} />
      )}
    </Layout>
  );
};

export default Room;
