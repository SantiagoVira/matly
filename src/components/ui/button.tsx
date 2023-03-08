import { cn } from "~/utils/cn";

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={cn(
        `text-100 h-fit rounded-lg bg-bg-300 px-3 py-[0.4rem] shadow hover:bg-slate-300/40 active:bg-slate-300/90 disabled:opacity-50`,
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
