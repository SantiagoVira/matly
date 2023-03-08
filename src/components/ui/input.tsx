import React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...rest }, ref) => {
  return (
    <input
      {...rest}
      ref={ref}
      className={`w-full rounded-lg bg-bg-300 px-3 py-[10px] outline-none ${
        className ?? ""
      }`}
    />
  );
});

Input.displayName = "Input";
