import { useState } from "react";
import Tile from "./tile";
import * as sr from "seedrandom";

const Board: React.FC<{ seed: string }> = ({ seed }) => {
  const nums = new Array(25)
    .fill(0)
    .map((_, i) => Math.floor(sr.default(seed + i.toString())() * 10) + 1);
  const [idx, setIdx] = useState(0);
  console.log(nums);

  return (
    <div className="grid h-[30rem] w-[30rem] grid-cols-5 grid-rows-5">
      {nums.map((_, i) => (
        <Tile
          key={i}
          idx={i}
          nextVal={nums[idx] ?? -1}
          stepNext={() => setIdx((i) => i + 1)}
        />
      ))}
    </div>
  );
};

export default Board;
