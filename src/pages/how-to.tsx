import Layout from "~/components/shared/layout";
import Tile from "~/components/tile";

// prettier-ignore
const sample = [
  1, 2, 3, 4, 5, 
  1, 1, 3, 7, 10, 
  4, 4, 8, 8, 8, 
  4, 4, 3, 2, 1, 
  6, 6, 9, 9, 10,
];
// prettier-ignore
const sampleColors = [
  'bg-rose-400/50', '', 'bg-orange-400/50', '', '', 
  'bg-rose-400/75', 'bg-rose-400/50', 'bg-orange-400/50', '', '', 
  'bg-amber-400/75', 'bg-amber-400/75', 'bg-lime-400/50', 'bg-lime-400/50', 'bg-lime-400/50', 
  'bg-amber-400/75', 'bg-amber-400/75', '', '', '', 
  'bg-teal-400/50', 'bg-teal-400/50', 'bg-violet-400/50', 'bg-violet-400/50', '']

const HowTo: React.FC = () => {
  return (
    <Layout title="How To Play" requireAuth={false}>
      <h1 className="mt-4 text-4xl md:text-5xl">
        How To Play <span className="text-highlight">Matly</span>
      </h1>
      <p className="mx-10 mt-10 text-center sm:min-w-[35rem] md:mx-0 md:w-1/2 md:min-w-[25rem]">
        You start with a board. Each board consists of a grid of 25 tiles. A
        random number is chosen for every player, and everyone places it on
        their board. This repeats 25 times, until the grid is full. Every number
        must be placed before recieving the next. <br />
        <br />
        You score points whenever like numbers (e.g., 4-4, or 7-7-7) appear as
        neighbors within a row or column. If that happens, add their sum to your
        score. A single number may count twice: once in its row, and once in its
        column. Players are ranked by their scores at the end of the game, and
        the person with the highest score wins
      </p>

      <div className="relative mx-auto mt-4 h-[20rem] w-[20rem] md:h-[30rem] md:w-[30rem]">
        {/* prettier-ignore */ }
        <div className="absolute left-0 top-0 grid h-[20rem] w-[20rem] md:h-[30rem] md:w-[30rem] grid-cols-5 grid-rows-5">
          {sampleColors.map((c, i) => (
            <div key={i} className={c} />
          ))}
        </div>
        <div className="absolute left-0 top-0 grid h-[20rem] w-[20rem] grid-cols-5 grid-rows-5 md:h-[30rem] md:w-[30rem]">
          {sample.map((t, i) => (
            <Tile
              key={i}
              idx={i}
              nextVal={-1}
              stepNext={() => console.log("not playable")}
              val={t}
              noHover
            />
          ))}
        </div>
      </div>
      <p className="mx-10 mt-10 text-center sm:min-w-[35rem] md:mx-0 md:w-1/2 md:min-w-[25rem]">
        In this case, the grouped numbers are highlighted. Going by rows, we see
        Row 1 has no matches. Row 2 has one match adding up to 2 points. Row 3
        has 2 groups, 1 adding to 8 and the other adding to 24. Row 4 has 1
        group of 8 points and Row 5 hs a group of 12 and a group of 18. Doing
        the same thing to the columns and summing all values, we get a total
        score of 96.
        <br />
        <br />
        As you can see, a 2x2 square of numbers is the optimal organization of 4
        numbers, adding up to twice as much as it would if the numbers were in a
        straight line. This highlights the strategy part of this game. While the
        numbers are random, there is still a necessary strategic component. Good
        luck!
      </p>
    </Layout>
  );
};

export default HowTo;
