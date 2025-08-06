/* eslint-disable @typescript-eslint/no-misused-promises */
import Button from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import HomeScreenButton from "./home-screen-button";
import JoinRoomIcon from "./icons/join-room";
import { cn } from "~/utils/cn";
import { api } from "~/utils/api";
import { useState } from "react";
import { useRouter } from "next/router";

export function JoinRoomButton() {
  const router = useRouter();
  const ctx = api.useContext();
  const [error, setError] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const roomExists = api.room.findUnique.useQuery({
    id: joinCode,
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
    <Dialog>
      <DialogTrigger asChild>
        <HomeScreenButton
          className="col-span-3 col-start-4 row-span-2"
          Icon={JoinRoomIcon}
          onClick={() => console.log("Open dialog")}
          title="Join room"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter join code</DialogTitle>
          <DialogDescription>
            Ask your friends for the big code on their screens!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start">
          <Input
            className={cn("h-10 w-64 ", error && "border border-rose-600")}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await onJoin();
              }
            }}
            onChange={(e) => setJoinCode(e.target.value.toLowerCase())}
          />

          {error && <p className="text-sm text-rose-600">{error}</p>}
        </div>
        <DialogFooter className="justify-end">
          <Button
            type="button"
            onClick={onJoin}
            disabled={joinMutation.isLoading}
          >
            Join
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
