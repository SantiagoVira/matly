/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "~/components/shared/layout";
import Button from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const createMutation = api.room.create.useMutation({
    onSuccess: (e) => router.push(`/room/${e.id}`),
  });
  const joinMutation = api.room.join.useMutation({
    onSuccess: (e) => router.push(`/room/${e.id}`),
  });

  const [joinCode, setJoinCode] = useState("");

  return (
    <Layout>
      {sessionData?.user ? (
        <>
          <Button onClick={() => createMutation.mutateAsync()}>
            Create Room
          </Button>
          <div className="flex gap-4">
            <Input
              className="h-10 w-32"
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <Button onClick={() => joinMutation.mutateAsync({ id: joinCode })}>
              Join Room
            </Button>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1>To begin, sign in!</h1>
        </div>
      )}
    </Layout>
  );
};

export default Home;
