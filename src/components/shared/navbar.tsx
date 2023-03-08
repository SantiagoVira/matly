import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Tab from "./tab";
import Link from "next/link";
import { mainTabs } from "./tabs";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  return (
    <div className="flex h-[50px] w-screen items-center justify-between bg-bg-200 px-20 shadow">
      <Link href="/">
        <Image src="/White Logo.png" alt="" width={30} height={10} />
      </Link>
      {mainTabs.map((tab, i) => (
        <Tab key={i} {...tab} />
      ))}
      <button
        className="text-highlight no-underline transition hover:-translate-y-0.5"
        onClick={
          sessionData
            ? () => void signOut()
            : () =>
                void signIn("google", {
                  callbackUrl: `/sign-up?redirect=${encodeURIComponent(
                    router.asPath
                  )}`,
                })
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default Navbar;
