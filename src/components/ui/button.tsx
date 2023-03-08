const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`text-100 rounded-lg bg-bg-300 px-3 py-[0.4rem] shadow disabled:opacity-50 ${
        className ?? ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
