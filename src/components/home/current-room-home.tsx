/* eslint-disable @typescript-eslint/no-misused-promises */
import HomeScreenButton from "./home-screen-button";
import HowToIcon from "../icons/how-to";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import CreateRoomIcon from "../icons/create-room";
import LeaveRoomIcon from "../icons/leave-room";

const CurrentRoomHome: React.FC = () => {
  const { data: sessionData } = useSession();
  const ctx = api.useUtils();

  const leaveMutation = api.room.leave.useMutation({
    onSuccess: async () => {
      await ctx.invalidate();
      document.dispatchEvent(new Event("visibilitychange"));
    },
  });

  return (
    <div className="flex min-h-[50vh] w-full max-w-5xl flex-col items-center justify-center gap-2 sm:grid sm:grid-cols-6 sm:grid-rows-4">
      <HomeScreenButton
        className="col-span-2 row-span-2"
        Icon={CreateRoomIcon}
        href={`/room/${sessionData?.user?.roomId ?? ""}`}
        title="Current Room"
      />
      <HomeScreenButton
        className="col-span-2 col-start-3 row-span-2"
        Icon={LeaveRoomIcon}
        onClick={async () => {
          await leaveMutation.mutateAsync();
          document.dispatchEvent(new Event("visibilitychange"));
        }}
        title="Leave Room"
      />

      <HomeScreenButton
        className="col-span-2 col-start-5 row-span-2"
        Icon={HowToIcon}
        href="/how-to"
        title="How to play"
      />
    </div>
  );
};

export default CurrentRoomHome;
