import { cn } from "~/utils/cn";

const HomeScreenButton: React.FC<{
  className?: string;
  Icon: React.FC<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  title: string;
}> = ({ Icon, href, title, onClick, className = "" }) => {
  if (href) {
    return (
      <a
        className={cn(
          "bg-bg-300 shadow hover:opacity-80 hover:shadow-md active:opacity-70",
          "group rounded-2xl py-8 transition-all duration-300 active:scale-[0.99]",
          "flex flex-col items-center justify-center gap-8",
          className
        )}
        href={href}
      >
        <Icon className="size-24 fill-black group-hover:fill-highlight" />
        <h4>{title}</h4>
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-bg-300 shadow hover:opacity-80 hover:shadow-md active:opacity-70",
        "group rounded-2xl py-8 transition-all duration-300 active:scale-[0.99]",
        "flex flex-col items-center justify-center gap-8",
        className
      )}
    >
      <Icon className="size-24 fill-black group-hover:fill-highlight" />
      <h4>{title}</h4>
    </button>
  );
};

export default HomeScreenButton;
