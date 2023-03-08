import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <div className="bg-bg-200 mt-6 flex h-[10rem] w-screen items-center justify-between px-20 shadow">
      <div className="flex gap-4">
        <Image src="/White Logo.png" alt="" width={75} height={10} />
        <div className="flex h-full flex-col justify-between">
          <h1 className="text-text-100 text-[2rem] tracking-tight">
            Neighbors
          </h1>
          <p className="text-text-200">Because digital is better than paper</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
