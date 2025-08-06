/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import HomeScreenButton from "./home-screen-button";
import CreateRoomIcon from "./icons/create-room";
import SingleplayerIcon from "./icons/singleplayer";
import DailyIcon from "./icons/daily";
import HowToIcon from "./icons/how-to";
import { JoinRoomButton } from "./join-room-button";

const NoRoomHome: React.FC = () => {
  const router = useRouter();
  const ctx = api.useContext();

  const createMutation = api.room.create.useMutation({
    onSuccess: async (e) => {
      await ctx.invalidate();
      document.dispatchEvent(new Event("visibilitychange"));
      await router.push(`/room/${e[0].id}`);
    },
  });

  return (
    <>
      <div className="grid w-full max-w-5xl grid-cols-6 grid-rows-4 gap-2">
        <HomeScreenButton
          className="col-span-3 row-span-2"
          Icon={CreateRoomIcon}
          onClick={() => createMutation.mutateAsync()}
          title="Create room"
        />
        <JoinRoomButton />
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
