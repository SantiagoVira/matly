import Link from "next/link";
import { cn } from "~/utils/cn";

const LinkButton: React.FC<
  React.PropsWithChildren<{ href: string; className?: string }>
> = ({ href, className, children }) => {
  return (
    <Link
      className={cn(
        "text-100 mt-4 h-fit rounded-lg bg-bg-300 px-3 py-[0.4rem] text-center shadow hover:bg-slate-300/40 active:bg-slate-300/90 disabled:opacity-50",
        className
      )}
      href={href}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
