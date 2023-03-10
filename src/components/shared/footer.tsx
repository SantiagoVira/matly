import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <div className="mt-6 flex h-[10rem] w-screen items-center justify-between bg-bg-200 px-20 shadow">
      <div className="flex gap-4">
        <Image src="/logo.svg" alt="" width={65} height={10} />
        <h1 className="text-2xl tracking-tight text-text-100">Matly</h1>
      </div>
    </div>
  );
};

export default Footer;
