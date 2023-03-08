/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from "react";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";

const Tile: React.FC<{
  idx: number;
  nextVal: number;
  val?: number | undefined;
  stepNext: () => void;
}> = ({ idx, nextVal, val = -1, stepNext }) => {
  const [value, setValue] = useState(val);
  const placeNumber = api.room.placeNumber.useMutation();

  return (
    <div
      className={cn(
        `-px-1 group flex h-full w-full items-center justify-center border border-black hover:bg-slate-50/80`,
        idx < 5 && "border-t-2",
        idx > 19 && "border-b-2",
        (idx + 1) % 5 === 0 && "border-r-2",
        idx % 5 === 0 && "border-l-2"
      )}
      onClick={async () => {
        if (value !== -1) return;
        setValue(nextVal);
        stepNext();
        await placeNumber.mutateAsync({ value: nextVal, idx: idx });
      }}
    >
      <p
        className={cn(
          "text-4xl",
          value >= 0
            ? value === 10
              ? "text-highlight"
              : "text-black"
            : "text-transparent " +
                (nextVal === 10
                  ? "group-hover:text-highlight/50"
                  : "group-hover:text-black/50")
        )}
      >
        {value >= 0 ? value : nextVal >= 0 ? nextVal : ""}
      </p>
    </div>
  );
};

export default Tile;
