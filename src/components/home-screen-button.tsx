import { cn } from "~/utils/cn";

const HomeScreenButton: React.FC<{
  className?: string;
  Icon: React.FC<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  title: string;
}> = ({ Icon, href, title, onClick, className = "" }) => {
  const classNames = cn(
    "bg-bg-300 shadow hover:opacity-80 hover:shadow-md active:opacity-70 text-center",
    "group rounded-2xl py-3 transition-all duration-300 active:scale-[0.99] md:py-8 px-8 sm:w-full w-2/3 h-full ",
    "flex sm:flex-col items-center justify-start sm:justify-center pl-12 sm:pl-8 gap-8 md:gap-8",
    className
  );
  if (href) {
    return (
      <a className={classNames} href={href}>
        <Icon className="size-6 fill-black group-hover:fill-highlight sm:size-12 md:size-24" />
        <h4 className="text-lg md:text-3xl">{title}</h4>
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classNames}>
      <Icon className="size-6 fill-black group-hover:fill-highlight sm:size-12 md:size-24" />
      <h4 className="text-lg md:text-3xl">{title}</h4>
    </button>
  );
};

export default HomeScreenButton;
