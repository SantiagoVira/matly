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

const Room: React.FC = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const id = router.query.id?.toString();
  const roomQuery = api.room.findUnique.useQuery({ id: id ?? "" });
  const room = roomQuery.data;
  const ctx = api.useContext();
  const boardQuery = api.room.getBoard.useQuery();
  const board = boardQuery.data;

  const startGame = api.room.startGame.useMutation({
    onSuccess: async () => {
      await ctx.invalidate();
    },
  });
  const scoreBoard = api.room.scoreBoard.useMutation();

  const nums = new Array(25)
    .fill(0)
    .map(
      (_, i) =>
        Math.floor(sr.default((id ?? "helloworld") + i.toString())() * 10) + 1
    );
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= 25 && sessionData?.user.score === -1) {
      console.log("called");
      scoreBoard.mutate();
    }

    console.log("hey", idx, sessionData?.user.score);
  }, [idx, scoreBoard, sessionData]);

  useEffect(() => {
    setIdx(board?.tiles?.filter((t) => t.value > 0).length ?? 0);
  }, [board]);

  if (
    (status === "authenticated" &&
      sessionData?.user.id &&
      !room?.members.map((user) => user.id).includes(sessionData?.user.id)) ||
    !room
  )
    return (
      <Layout>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1>Room not found!</h1>
          <p>
            Make sure the code is correct and that you have joined this class.
          </p>
        </div>
      </Layout>
    );

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
              if (room.playing) return;
              await startGame.mutateAsync({ id: id ?? "" });
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
              Next Number: <span className="text-highlight">{nums[idx]}</span>
            </h3>
            {idx >= 25 && <h4 className="flex-1 text-left">Leaderboard</h4>}
          </div>
          <div className="flex w-full">
            <div className="flex flex-[2] flex-col items-center justify-center">
              <Board
                nums={nums}
                idx={idx}
                board={board}
                stepNext={() => setIdx((i) => i + 1)}
              />
            </div>
            {idx >= 25 && (
              <div className="flex min-h-full w-full flex-1 flex-col items-start justify-start">
                {room.members
                  .filter((user) => user.score >= 0)
                  .map((user, i) => (
                    <ol className="ml-4 list-decimal" key={i}>
                      <li>
                        {user.name} -{" "}
                        <span className="text-highlight">{user.score}</span>
                      </li>
                    </ol>
                  ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex w-full items-center gap-2 px-10">
            <h2>Members</h2>{" "}
            <h2 className="font-extralight">- {room?.members.length}</h2>
          </div>
          {room?.members.map((user, i) => (
            <p className="w-full px-14 text-left" key={i}>
              {user.name}
            </p>
          ))}
        </>
      )}
    </Layout>
  );
};

export default Room;
