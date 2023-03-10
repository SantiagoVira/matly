import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className="mt-4 flex h-44 w-screen flex-col items-center justify-center gap-3 bg-bg-200 px-10 shadow md:h-32 md:flex-row md:justify-between">
      <div className="flex items-center gap-4">
        <Image src="/logo.svg" alt="" width={35} height={10} />
        <h1 className="text-[2rem] tracking-tight text-text-100">Matly</h1>
      </div>
      <div className="flex flex-col items-center gap-1 md:flex-1 md:items-end">
        <p>
          Made with love by{" "}
          <Link
            className="text-highlight underline"
            target="_blank"
            href="https://santiagovira.tech"
          >
            Santiago Vira
          </Link>
        </p>
        <p className="text-text-100/75">
          Inspired by{" "}
          <Link
            className="underline"
            target="_blank"
            href="https://www.saravanderwerf.com/5x5-most-amazing-just-for-fun-game/"
          >
            5x5 by Sara VanDerWerf
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Footer;
