import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <div className="mt-6 flex h-[10rem] w-screen items-center justify-between bg-bg-200 px-20 shadow">
      <div className="flex gap-4">
        <Image src="/logo.svg" alt="" width={65} height={10} />
        <div className="flex h-full flex-col justify-between">
          <h1 className="text-[2rem] tracking-tight text-text-100">
            Neighbors
          </h1>
          <p className="text-text-200">Because digital is better than paper</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
