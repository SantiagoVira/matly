import { useState } from "react";
import Tile from "./tile";

const Board: React.FC = () => {
  const [canClick, setCanClick] = useState(Math.floor(Math.random() * 10) + 1);
  return (
    <div className="grid h-[30rem] w-[30rem] grid-cols-5 grid-rows-5">
      {new Array(25).fill(0).map((_, i) => (
        <Tile key={i} idx={i} canClick={canClick} setCanClick={setCanClick} />
      ))}
    </div>
  );
};

export default Board;
