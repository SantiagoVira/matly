/* eslint-disable @typescript-eslint/no-misused-promises */
import clsx from "clsx";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "~/components/shared/layout";
import Button from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const router = useRouter();

  const createMutation = api.room.create.useMutation({
    onSuccess: (e) => router.push(`/room/${e.id}`),
  });
  const joinMutation = api.room.join.useMutation({
    onSuccess: (e) => router.push(`/room/${e.id}`),
  });

  const [joinCode, setJoinCode] = useState("");
  const [isError, setIsError] = useState(false);
  const roomExists = api.room.findUnique.useQuery({
    id: joinCode,
  });

  return (
    <Layout>
      <Button onClick={() => createMutation.mutateAsync()}>Create Room</Button>
      <div className="flex gap-4">
        <div className="flex flex-col items-start">
          <Input
            className={clsx("h-10 w-32", isError && "border border-rose-600")}
            onChange={(e) => setJoinCode(e.target.value.toLowerCase())}
          />
          {isError && <p className="text-sm text-rose-600">Room not found</p>}
        </div>

        <Button
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
    </Layout>
  );
};

export default Home;
