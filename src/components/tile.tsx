import { useState } from "react";
import { cn } from "~/utils/cn";

const Tile: React.FC<{
  idx: number;
  canClick: number;
  setCanClick: React.Dispatch<React.SetStateAction<number>>;
}> = ({ idx, canClick, setCanClick }) => {
  const [value, setValue] = useState(-1);
  return (
    <div
      className={cn(
        `-px-1 flex h-full w-full items-center justify-center border border-black hover:bg-slate-50/80`,
        idx < 5 && "border-t-2",
        idx > 19 && "border-b-2",
        (idx + 1) % 5 === 0 && "border-r-2",
        idx % 5 === 0 && "border-l-2"
      )}
      onClick={() => {
        if (canClick >= 0) {
          setValue(canClick);
          console.log(canClick);
          setCanClick(-1);
          setTimeout(
            () => setCanClick(Math.floor(Math.random() * 10) + 1),
            1000
          );
        }
      }}
    >
      <p className="text-4xl">{value >= 0 ? value : ""}</p>
    </div>
  );
};

export default Tile;
