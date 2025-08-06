/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import clsx from "clsx";
import { Input } from "./ui/input";
import { useState } from "react";
import useWindowSize from "~/utils/useWindowSize";
import HomeScreenButton from "./home-screen-button";
import CreateRoomIcon from "./icons/create-room";
import JoinRoomIcon from "./icons/join-room";
import SingleplayerIcon from "./icons/singleplayer";
import DailyIcon from "./icons/daily";
import HowToIcon from "./icons/how-to";

const NoRoomHome: React.FC = () => {
  const router = useRouter();
  const ctx = api.useContext();

  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const roomExists = api.room.findUnique.useQuery({
    id: joinCode,
  });
  const { isMobile } = useWindowSize();

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
      <div className="flex flex-col items-center">
        <Input
          className={clsx(
            "h-10 w-[7.5rem] md:w-32",
            error && "border border-rose-600"
          )}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await onJoin();
            }
          }}
          onChange={(e) => setJoinCode(e.target.value.toLowerCase())}
        />

        {error && <p className="text-sm text-rose-600">{error}</p>}
      </div>
      <div className="grid w-full max-w-5xl grid-cols-6 grid-rows-4 gap-2">
        <HomeScreenButton
          className="col-span-3 row-span-2"
          Icon={CreateRoomIcon}
          onClick={() => createMutation.mutateAsync()}
          title="Create room"
        />
        <HomeScreenButton
          className="col-span-3 col-start-4 row-span-2"
          Icon={JoinRoomIcon}
          onClick={onJoin}
          title="Join room"
        />
        <HomeScreenButton
          className="col-span-2 row-span-2 row-start-3"
          Icon={SingleplayerIcon}
          href="/local"
          title="Singleplayer"
        />
        <HomeScreenButton
          className="col-span-2 col-start-3 row-span-2 row-start-3"
          Icon={DailyIcon}
          href="/daily"
          title="Daily"
        />
        <HomeScreenButton
          className="col-span-2 col-start-5 row-span-2 row-start-3"
          Icon={HowToIcon}
          href="/how-to"
          title="How to play"
        />
      </div>
    </>
  );
};

export default NoRoomHome;
