import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Navbar: React.FC = () => {
  const { data: sessionData } = useSession();
  return (
    <div className="flex h-[50px] w-screen items-center justify-between bg-bg-200 px-8 shadow md:px-20">
      <Link href="/" className="flex gap-3">
        <Image src="/logo.svg" alt="" width={30} height={10} />
        <h1 className="text-3xl tracking-tight text-text-100">Matly</h1>
      </Link>
      <button
        className="text-right text-highlight no-underline transition hover:-translate-y-0.5"
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
