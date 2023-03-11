/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import Button from "./ui/button";
import { api } from "~/utils/api";
import clsx from "clsx";
import { Input } from "./ui/input";
import { useState } from "react";
import Link from "next/link";

const NoRoomHome: React.FC = () => {
  const router = useRouter();
  const ctx = api.useContext();

  const [joinCode, setJoinCode] = useState("");
  const [isError, setIsError] = useState(false);
  const roomExists = api.room.findUnique.useQuery({
    id: joinCode,
  });

  const createMutation = api.room.create.useMutation({
    onSuccess: async (e) => {
      await ctx.invalidate();
      document.dispatchEvent(new Event("visibilitychange"));
      await router.push(`/room/${e[0].id}`);
    },
  });
  const joinMutation = api.room.join.useMutation({
    onSuccess: async (e) => {
      await ctx.invalidate();
      document.dispatchEvent(new Event("visibilitychange"));
      await router.push(`/room/${e[0].id}`);
    },
  });

  return (
    <>
      <Button onClick={() => createMutation.mutateAsync()} className="mb-4">
        Create Room
      </Button>
      <div className="flex flex-col items-start">
        <div className="flex">
          <Input
            className={clsx(
              "h-10 w-32 rounded-r-none",
              isError && "border border-rose-600"
            )}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await roomExists.refetch();
                if (!roomExists.data) {
                  setIsError(true);
                  return;
                }
                await joinMutation.mutateAsync({ id: joinCode });
              }
            }}
            onChange={(e) => setJoinCode(e.target.value.toLowerCase())}
          />
          <Button
            className="h-10 w-36 rounded-l-none shadow"
            onClick={async () => {
              await roomExists.refetch();
              if (!roomExists.data) {
                setIsError(true);
                return;
              }
              await joinMutation.mutateAsync({ id: joinCode });
            }}
          >
            Join Room
          </Button>
        </div>

        {isError && <p className="text-sm text-rose-600">Room not found</p>}
      </div>
      <Link
        className="text-100 mt-4 h-fit rounded-lg bg-bg-300 px-3 py-[0.4rem] text-center shadow hover:bg-slate-300/40 active:bg-slate-300/90 disabled:opacity-50"
        href="/local"
      >
        Play Locally
      </Link>
      <p className="mt-4">
        Check out how to play{" "}
        <Link className="text-hightlight underline" href="/how-to">
          here
        </Link>
        !
      </p>
    </>
  );
};

export default NoRoomHome;
