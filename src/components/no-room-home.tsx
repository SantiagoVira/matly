/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import Button from "./ui/button";
import { api } from "~/utils/api";
import clsx from "clsx";
import { Input } from "./ui/input";
import { useState } from "react";
import LinkButton from "./ui/link-button";
import HowToLink from "./how-to-link";

const NoRoomHome: React.FC = () => {
  const router = useRouter();
  const ctx = api.useContext();

  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
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

  const onJoin = async () => {
    await roomExists.refetch();
    if (!roomExists.data) {
      setError("Room not Found");
      return;
    }
    if (roomExists.data.playing) {
      setError("Room currently playing");
      return;
    }
    await joinMutation.mutateAsync({ id: joinCode });
  };

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
              error && "border border-rose-600"
            )}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await onJoin();
              }
            }}
            onChange={(e) => setJoinCode(e.target.value.toLowerCase())}
          />
          <Button className="h-10 w-36 rounded-l-none shadow" onClick={onJoin}>
            Join Room
          </Button>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}
      </div>
      <LinkButton href="/local">Singleplayer</LinkButton>
      <LinkButton href="/daily" className="text-highlight">
        Daily Game
      </LinkButton>
      <HowToLink />
    </>
  );
};

export default NoRoomHome;
