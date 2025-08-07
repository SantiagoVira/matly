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
  const ctx = api.useUtils();
  const placeNumber = api.board.placeNumber.useMutation({
    onSuccess: () => setLoading(false),
  });

  const ON_TOP_ROW = idx < 5;
  const ON_BOTTOM_ROW = idx > 19;
  const ON_RIGHT_COL = (idx + 1) % 5 === 0;
  const ON_LEFT_COL = idx % 5 === 0;
  const IS_TEN = value === 10;
  const HAS_VALUE = value >= 0;
  const NEXT_IS_TEN = nextVal === 10;

  return (
    <div
      className={cn(
        `-px-1 group flex h-full w-full items-center justify-center border border-black`,
        !noHover && "hover:bg-slate-50/80",
        ON_TOP_ROW && "border-t-2",
        ON_BOTTOM_ROW && "border-b-2",
        ON_RIGHT_COL && "border-r-2",
        ON_LEFT_COL && "border-l-2"
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
        await ctx.invalidate();
        document.dispatchEvent(new Event("visibilitychange"));
        checkWin();
      }}
    >
      <p
        className={cn(
          "select-none text-xl md:text-4xl",
          "text-transparent",
          !loading && !HAS_VALUE && !NEXT_IS_TEN && "group-hover:text-black/50",
          !loading &&
            !HAS_VALUE &&
            NEXT_IS_TEN &&
            "group-hover:text-highlight/50",
          HAS_VALUE && !IS_TEN && "text-black",
          HAS_VALUE && IS_TEN && "text-highlight"
        )}
      >
        {value >= 0 ? value : nextVal >= 0 ? nextVal : ""}
      </p>
    </div>
  );
};

export default Tile;
