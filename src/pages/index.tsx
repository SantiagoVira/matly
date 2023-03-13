/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import CurrentRoomHome from "~/components/current-room-home";
import NoRoomHome from "~/components/no-room-home";
import Layout from "~/components/shared/layout";
import LinkButton from "~/components/ui/link-button";
const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();

  useEffect(() => {
    // const tiles = [
    //   1, 1, 8, 2, 4, 1, 5, 8, 9, 5, 6, 10, 10, 3, 6, 7, 7, 7, 3, 6, 7, 7, 7, 6,
    //   6,
    // ];
    const tiles = [
      4, 8, 9, 8, 2, 10, 7, 6, 4, 10, 2, 9, 1, 1, 9, 2, 4, 3, 3, 6, 7, 8, 7, 10,
      3,
    ];
    let score = 0;

    for (let y = 0; y < 5; y++) {
      let streak = 1;
      let lastNum: number = tiles[y * 5 + 0] ?? 0;
      for (let x = 1; x < 5; x++) {
        if (tiles[y * 5 + x] === lastNum) streak++;
        else {
          if (streak > 1) score += lastNum * streak;
          streak = 1;
        }
        lastNum = tiles[y * 5 + x] ?? 0;
      }
      if (streak > 1) score += lastNum * streak;
    }

    for (let x = 0; x < 5; x++) {
      let streak = 1;
      let lastNum: number = tiles[x] ?? 0;
      for (let y = 1; y < 5; y++) {
        if (tiles[y * 5 + x] === lastNum) streak++;
        else {
          if (streak > 1) score += lastNum * streak;
          streak = 1;
        }
        lastNum = tiles[y * 5 + x] ?? 0;
      }
      if (streak > 1) score += lastNum * streak;
    }

    console.log(score);
  }, []);

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
          <LinkButton href="/local">Singleplayer</LinkButton>
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
