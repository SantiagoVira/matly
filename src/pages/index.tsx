/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import CurrentRoomHome from "~/components/home/current-room-home";
import NoRoomHome from "~/components/home/no-room-home";
import Layout from "~/components/shared/layout";
import SignedOutHome from "~/components/home/signed-out-home";
const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();

  return (
    <Layout requireAuth={false} className="h-full px-6 py-10 sm:px-12 md:px-24">
      {status !== "authenticated" ? (
        <SignedOutHome />
      ) : sessionData?.user.roomId ? (
        <CurrentRoomHome />
      ) : (
        <NoRoomHome />
      )}
    </Layout>
  );
};

export default Home;
