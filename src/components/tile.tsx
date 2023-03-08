import { useState } from "react";
import { cn } from "~/utils/cn";

const Tile: React.FC<{
  idx: number;
  nextVal: number;
  stepNext: () => void;
}> = ({ idx, nextVal, stepNext }) => {
  const [value, setValue] = useState(-1);
  return (
    <div
      className={cn(
        `-px-1 group flex h-full w-full items-center justify-center border border-black hover:bg-slate-50/80`,
        idx < 5 && "border-t-2",
        idx > 19 && "border-b-2",
        (idx + 1) % 5 === 0 && "border-r-2",
        idx % 5 === 0 && "border-l-2"
      )}
      onClick={() => {
        setValue(nextVal);
        stepNext();
      }}
    >
      <p
        className={cn(
          "text-4xl",
          value >= 0
            ? "text-black"
            : "text-transparent group-hover:text-black/50"
        )}
      >
        {value >= 0 ? value : nextVal >= 0 ? nextVal : ""}
      </p>
    </div>
  );
};

export default Tile;
