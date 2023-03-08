import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Tab from "./tab";
import Link from "next/link";

interface ITab {
  name: string;
  href: string;
}

const Navbar: React.FC = () => {
  const { data: sessionData } = useSession();
  const roomTab: ITab = {
    name: "My Room",
    href: `/room/${sessionData?.user?.roomId ?? ""}`,
  };

  return (
    <div className="flex h-[50px] w-screen items-center justify-between bg-bg-200 px-20 shadow">
      <Link href="/" className="flex-1 ">
        <Image src="/logo.svg" alt="" width={30} height={10} />
      </Link>
      {sessionData?.user.roomId && <Tab {...roomTab} />}
      <button
        className="flex-1 text-right text-highlight no-underline transition hover:-translate-y-0.5"
        onClick={
          sessionData ? () => void signOut() : () => void signIn("google")
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default Navbar;
