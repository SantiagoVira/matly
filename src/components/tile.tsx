/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";

const Tile: React.FC<{
  idx: number;
  nextVal: number;
  val?: number | undefined;
  stepNext: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  checkWin: () => void;
  noHover?: boolean;
}> = ({
  idx,
  nextVal,
  val = -1,
  stepNext,
  loading,
  setLoading,
  checkWin,
  noHover = false,
}) => {
  const [value, setValue] = useState(val);
  const router = useRouter();
  const placeNumber = api.board.placeNumber.useMutation({
    onSuccess: () => setLoading(false),
  });

  return (
    <div
      className={cn(
        `-px-1 group flex h-full w-full items-center justify-center border border-black`,
        !noHover && "hover:bg-slate-50/80",
        idx < 5 && "border-t-2",
        idx > 19 && "border-b-2",
        (idx + 1) % 5 === 0 && "border-r-2",
        idx % 5 === 0 && "border-l-2"
      )}
      onClick={async () => {
        if (value !== -1 || loading || placeNumber.isLoading) return;
        setLoading(true);
        stepNext();
        setValue(nextVal);
        await placeNumber.mutateAsync({
          idx: idx,
          daily: router.pathname.endsWith("daily"),
        });
        checkWin();
      }}
    >
      <p
        className={cn(
          "select-none text-xl md:text-4xl",
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
