/* eslint-disable @typescript-eslint/no-misused-promises */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Board from "~/components/board";
import Layout from "~/components/shared/layout";
import Button from "~/components/ui/button";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";

const Room: React.FC = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const id = router.query.id?.toString();
  const roomQuery = api.room.findUnique.useQuery({ id: id ?? "" });
  const room = roomQuery.data;
  const ctx = api.useContext();
  const startGame = api.room.startGame.useMutation({
    onSuccess: async () => {
      await ctx.invalidate();
    },
  });
  if (
    (status === "authenticated" &&
      sessionData?.user.id &&
      !room?.members.map((user) => user.id).includes(sessionData?.user.id)) ||
    !room
  )
    return (
      <Layout>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1>Class not found!</h1>
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
        <div className="flex h-full w-full items-center justify-center">
          <Board seed={id ?? "helloworld"} />
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
