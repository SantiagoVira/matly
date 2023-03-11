import LocalTile from "./local-tile";

const LocalBoard: React.FC<{
  nums: number[];
  idx: number;
  board: number[];
  stepNext: () => void;
  changeBoard: React.Dispatch<React.SetStateAction<number[]>>;
}> = ({ nums, idx, board, stepNext, changeBoard }) => {
  return (
    <div className="grid h-[20rem] w-[20rem] grid-cols-5 grid-rows-5 md:h-[30rem] md:w-[30rem]">
      {board.map((t, i) => (
        <LocalTile
          key={i}
          idx={i}
          nextVal={nums[idx] ?? -1}
          stepNext={stepNext}
          changeBoard={changeBoard}
          val={t}
        />
      ))}
    </div>
  );
};

export default LocalBoard;
