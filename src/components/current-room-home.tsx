/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import Button from "./ui/button";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";

const CurrentRoomHome: React.FC = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const ctx = api.useContext();

  const leaveMutation = api.room.leave.useMutation({
    onSuccess: async () => {
      await ctx.invalidate();
      document.dispatchEvent(new Event("visibilitychange"));
    },
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        className="text-highlight"
        onClick={() => router.push(`/room/${sessionData?.user?.roomId ?? ""}`)}
      >
        Go to Current Room
      </Button>
      <Button
        className="text-rose-600"
        onClick={async () => {
          await leaveMutation.mutateAsync();
          document.dispatchEvent(new Event("visibilitychange"));
        }}
      >
        Leave Current Room
      </Button>
      <p>
        Check out how to play{" "}
        <Link className="text-hightlight underline" href="/how-to">
          here
        </Link>
        !
      </p>
    </div>
  );
};

export default CurrentRoomHome;
