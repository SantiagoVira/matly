import type { Board, Tile as PrismaTile } from "@prisma/client";
import Tile from "./tile";

const Board: React.FC<{
  nums: number[];
  idx: number;
  board:
    | (Board & {
        tiles: PrismaTile[];
      })
    | null
    | undefined;
  stepNext: () => void;
}> = ({ nums, idx, board, stepNext }) => {
  return (
    <div className="grid h-[30rem] w-[30rem] grid-cols-5 grid-rows-5">
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
