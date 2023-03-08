/* eslint-disable @typescript-eslint/no-misused-promises */
import clsx from "clsx";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "~/components/shared/layout";
import Button from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const createMutation = api.room.create.useMutation({
    onSuccess: async (e) => {
      document.dispatchEvent(new Event("visibilitychange"));
      await router.push(`/room/${e.id}`);
    },
  });
  const joinMutation = api.room.join.useMutation({
    onSuccess: async (e) => {
      document.dispatchEvent(new Event("visibilitychange"));
      await router.push(`/room/${e.id}`);
    },
  });
  const leaveMutation = api.room.leave.useMutation();

  const [joinCode, setJoinCode] = useState("");
  const [isError, setIsError] = useState(false);
  const roomExists = api.room.findUnique.useQuery({
    id: joinCode,
  });

  return (
    <Layout>
      <h1 className="my-10 text-7xl">
        Let&apos;s <span className="text-highlight">PLAY</span>!
      </h1>
      {sessionData?.user.roomId ? (
        <Button
          className="text-rose-600"
          onClick={async () => {
            await leaveMutation.mutateAsync();
            document.dispatchEvent(new Event("visibilitychange"));
          }}
        >
          Leave Current Room
        </Button>
      ) : (
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
        </>
      )}
    </Layout>
  );
};

export default Home;
