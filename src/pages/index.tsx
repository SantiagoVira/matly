/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import CurrentRoomHome from "~/components/current-room-home";
import NoRoomHome from "~/components/no-room-home";
import Layout from "~/components/shared/layout";
import LinkButton from "~/components/ui/link-button";
const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();

  return (
    <Layout requireAuth={false}>
      <h1 className="mt-10 text-7xl">
        Let&apos;s <span className="font-extrabold text-highlight">PLAY</span>!
      </h1>
      <div className="w-full px-10 md:px-32">
        <hr className="my-6 w-full border-black/20" />
      </div>
      {status !== "authenticated" ? (
        <>
          <LinkButton href="/local">Play Locally</LinkButton>
          <h2 className="my-3 w-3/4 text-center md:w-[28rem]">
            <Link
              className="underline hover:cursor-pointer"
              href="/"
              onClick={() => signIn("google")}
            >
              Sign in
            </Link>{" "}
            to start playing with friends!
          </h2>

          <p>
            And check out how to play{" "}
            <Link className="text-hightlight underline" href="/how-to">
              here
            </Link>
            !
          </p>
        </>
      ) : sessionData?.user.roomId ? (
        <CurrentRoomHome />
      ) : (
        <NoRoomHome />
      )}
    </Layout>
  );
};

export default Home;
