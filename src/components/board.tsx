import type { Board as PrismaBoard, Tile as PrismaTile } from "@prisma/client";
import Tile from "./tile";
import { useEffect } from "react";

const Board: React.FC<{
  nums: number[];
  idx: number;
  board:
    | (PrismaBoard & {
        tiles: PrismaTile[];
      })
    | null
    | undefined;
  stepNext: () => void;
}> = ({ nums, idx, board, stepNext }) => {
  useEffect(() => {
    console.log(idx);
  }, [idx]);
  return (
    <div className="grid h-[20rem] w-[20rem] grid-cols-5 grid-rows-5 md:h-[30rem] md:w-[30rem]">
      {board?.tiles.map((t, i) => (
        <Tile
          key={i}
          idx={i}
          nextVal={nums[idx] ?? -1}
          stepNext={stepNext}
          val={t.value > 0 ? t.value : -1}
        />
      ))}
    </div>
  );
};

export default Board;
