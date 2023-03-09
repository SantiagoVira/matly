/* eslint-disable @typescript-eslint/no-misused-promises */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

const Room: React.FC = () => {
  const router = useRouter();
  const ctx = api.useContext();
  const { data: sessionData, status } = useSession();

  const [idx, setIdx] = useState(0);
  const id = router.query.id?.toString();

  const startGame = api.game.start.useMutation({
    onSuccess: async () => {
      await ctx.invalidate();
    },
  });
  const endGame = api.game.end.useMutation({
    onSuccess: async () => {
      await ctx.invalidate();
      await router.push("/");
    },
  });
  const scoreBoard = api.board.score.useMutation({
    onSuccess: async () => {
      await ctx.invalidate();
    },
  });

  const roomQuery = api.room.findUnique.useQuery({ id: id ?? "" });
  const room = roomQuery.data;
  const boardQuery = api.board.findUnique.useQuery();
  const board = boardQuery.data;

  useEffect(() => {
    // Connect to pusher
    console.log("Gah", id);
    if (id) {
      const channel = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
      });
      console.log(channel.connection.state);
      if (channel.connection.state !== "connected") {
        console.log("Joining");
        channel.unsubscribe(id);
        channel.unbind_all();
        channel.subscribe(id);
        channel.bind("invalidate", () => ctx.invalidate());
      }
    }
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
        Math.floor(sr.default((id ?? "helloworld") + i.toString())() * 10) + 1
    );

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
      <div className="flex w-full items-center justify-between px-8">
        <h1 className="text-left">
          Room <span className="text-highlight">{id?.toUpperCase()}</span>
        </h1>
        {room?.members[0]?.id === sessionData?.user.id && (
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
            {room.playing ? "End " : "Start "}Game
          </Button>
        )}
      </div>

      <div className="my-4 w-full px-8">
        <hr className="w-full border-[#9e9e9e] " />
      </div>
      {room.playing ? (
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex w-full">
            <h3 className="flex-[2] text-center">
              Number: <span className="text-highlight">{nums[idx]}</span>
            </h3>
            {idx >= 25 && <h4 className="flex-1 text-left">Leaderboard</h4>}
          </div>
          <div className="flex w-full">
            <div className="flex flex-[2] flex-col items-center justify-center">
              <Board
                nums={nums}
                idx={idx}
                board={board}
                stepNext={() => {
                  console.log(idx);
                  setIdx((i) => i + 1);
                }}
              />
            </div>
            {idx >= 25 && <Leaderboard room={room} />}
          </div>
        </div>
      ) : (
        <MemberList room={room} />
      )}
    </Layout>
  );
};

export default Room;
