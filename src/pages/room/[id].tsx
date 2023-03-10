/* eslint-disable @typescript-eslint/no-misused-promises */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Board from "~/components/board";
import Layout from "~/components/shared/layout";
import Button from "~/components/ui/button";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";
import * as sr from "seedrandom";
import Pusher from "pusher-js";
import { env } from "~/env.mjs";
import Leaderboard from "~/components/room/leaderboard";
import MemberList from "~/components/room/member-list";
import RoomNotFound from "~/components/room/room-not-found";
import Loading from "~/components/loading";
import useWindowSize from "~/utils/useWindowSize";

const Room: React.FC = () => {
  const router = useRouter();
  const pusher = useRef<Pusher>();
  const ctx = api.useContext();
  const { data: sessionData, status } = useSession();
  const { isMobile } = useWindowSize();

  const [idx, setIdx] = useState(0);
  const id = router.query.id?.toString();

  const startGame = api.game.start.useMutation({
    onSuccess: async () => {
      await ctx.invalidate();
    },
  });
  const endGame = api.game.end.useMutation({
    onSuccess: async () => {
      await router.push("/");
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
  const boardQuery = api.board.findUnique.useQuery();
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
      pusher.current.bind("invalidate", async () => {
        await ctx.invalidate();

        document.dispatchEvent(new Event("visibilitychange"));
      });
    }

    return () => {
      if (pusher.current) {
        pusher.current.disconnect();
      }
    };
  }, [id, ctx]);

  useEffect(() => {
    // Finalize board scoring
    if (idx === 25 && board?.score === -1) {
      scoreBoard.mutate();
      setIdx(26);
    }
  }, [idx, scoreBoard, setIdx, board]);

  useEffect(() => {
    // Pick up previous progress
    setIdx(board?.tiles?.filter((t) => t.value > 0).length ?? 0);
  }, [board]);

  const nums = new Array(25)
    .fill(0)
    .map(
      (_, i) =>
        Math.floor(
          sr.default((room?.seed ?? "helloworld") + i.toString())() * 10
        ) + 1
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
              >
                Reset{isMobile ? "" : " Game"}
              </Button>
            )}
            <Button
              onClick={async () => {
                if (room.playing) await endGame.mutateAsync({ id: id ?? "" });
                else await startGame.mutateAsync({ id: id ?? "" });
              }}
              className={cn(
                "font-medium",
                room.playing ? "text-rose-600" : "text-highlight"
              )}
            >
              {room.playing ? "End" : "Start"}
              {isMobile ? "" : " Game"}
            </Button>
          </div>
        )}
      </div>

      <div className="my-4 w-full px-8">
        <hr className="w-full border-[#9e9e9e] " />
      </div>
      {room.playing ? (
        <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start md:gap-0">
          <div className="flex flex-[2] flex-col items-center justify-center">
            <h3 className=" text-center">
              Number: <span className="text-highlight">{nums[idx]}</span>
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
