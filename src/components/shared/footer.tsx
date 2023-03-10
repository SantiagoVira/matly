import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <div className="mt-6 flex h-[10rem] w-screen items-center justify-between bg-bg-200 px-20 shadow">
      <div className="flex items-center gap-4">
        <Image src="/logo.svg" alt="" width={35} height={10} />
        <h1 className="text-[2rem] tracking-tight text-text-100">Matly</h1>
      </div>
      <div className="flex flex-1 flex-col items-end gap-1">
        <p>
          Made with love by{" "}
          <a
            className="text-highlight underline"
            target="_blank"
            href="https://santiagovira.tech"
          >
            Santiago Vira
          </a>
        </p>
        <p className="text-text-100/75">
          Inspired by{" "}
          <a
            className="underline"
            target="_blank"
            href="https://www.saravanderwerf.com/5x5-most-amazing-just-for-fun-game/"
          >
            5x5 by Sara VanDerWerf
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
