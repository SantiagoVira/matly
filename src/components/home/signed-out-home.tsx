/* eslint-disable @typescript-eslint/no-misused-promises */
import HomeScreenButton from "./home-screen-button";
import SingleplayerIcon from "../icons/singleplayer";
import HowToIcon from "../icons/how-to";
import { signIn } from "next-auth/react";
import SignInIcon from "../icons/sign-in";

const SignedOutHome: React.FC = () => {
  return (
    <div className="flex min-h-[50vh] w-full max-w-5xl flex-col items-center justify-center gap-2 sm:grid sm:grid-cols-6 sm:grid-rows-4">
      <HomeScreenButton
        className="col-span-2 row-span-2"
        Icon={SingleplayerIcon}
        href="/local"
        title="Singleplayer"
      />
      <HomeScreenButton
        className="col-span-2 col-start-3 row-span-2"
        Icon={SignInIcon}
        onClick={() => signIn("google")}
        title="Sign in"
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

export default SignedOutHome;
