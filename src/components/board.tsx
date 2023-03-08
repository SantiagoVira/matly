import Tile from "./tile";

const Board: React.FC<{
  nums: number[];
  idx: number;
  stepNext: () => void;
}> = ({ nums, idx, stepNext }) => {
  return (
    <div className="grid h-[30rem] w-[30rem] grid-cols-5 grid-rows-5">
      {nums.map((_, i) => (
        <Tile key={i} idx={i} nextVal={nums[idx] ?? -1} stepNext={stepNext} />
      ))}
    </div>
  );
};

export default Board;
