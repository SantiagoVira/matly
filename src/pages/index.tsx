/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "~/components/shared/layout";
import Button from "~/components/ui/button";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const createMutation = api.room.create.useMutation();

  return (
    <Layout>
      {sessionData?.user ? (
        <>
          <Button onClick={() => createMutation.mutateAsync()}>
            Create Room
          </Button>
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
