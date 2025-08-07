/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "~/components/shared/layout";
import Button from "~/components/ui/button";
import * as sr from "seedrandom";
import useWindowSize from "~/utils/useWindowSize";
import LocalBoard from "~/components/local-board";
import HowToLink from "~/components/how-to-link";
import { calculateScoreOldLocal } from "~/utils/score-board";

const LocalRoom: React.FC = () => {
  const router = useRouter();
  const { isMobile } = useWindowSize();

  const [nums, setNums] = useState<number[]>();
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState<number[]>(new Array(25).fill(-1));

  useEffect(() => {
    // Finalize board scoring
    if (idx === 25 && board.filter((t) => t === -1).length === 0) {
      const newScore = calculateScoreOldLocal(board);

      setScore(newScore);
      setIdx(26);
    }
  }, [idx, setIdx, board]);

  useEffect(() => {
    const seed = Math.random().toString();
    setNums(
      new Array(25)
        .fill(0)
        .map(
          (_, i) => Math.floor(sr.default(`${seed}-LocalRoom-${i}`)() * 10) + 1
        )
    );
  }, []);

  return (
    <Layout title="Local Room" requireAuth={false}>
      <div className="flex w-full items-center justify-between px-8 pt-4">
        <h1 className=" text-left">Local{isMobile ? "" : " Room"}</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              setBoard(new Array(25).fill(-1));
              setScore(0);
              setIdx(0);

              const seed = Math.random().toString();
              setNums(
                new Array(25)
                  .fill(0)
                  .map((_, i) =>
                    Math.floor(sr.default(`${seed}-LocalRoom-${i}`)() * 10 + 1)
                  )
              );
            }}
            className="font-medium text-highlight"
          >
            Reset{isMobile ? "" : " Game"}
          </Button>

          <Button
            onClick={async () => {
              await router.push("/");
            }}
            className="font-medium text-rose-600"
          >
            End{isMobile ? "" : " Game"}
          </Button>
        </div>
      </div>

      <div className="my-4 w-full px-8">
        <hr className="w-full border-[#9e9e9e] " />
      </div>
      <div className="flex w-full flex-col items-center gap-6 md:gap-0">
        <h3 className="mb-2 text-center">
          {idx >= 25 ? (
            <>
              Done! Score: <span className="text-highlight">{score}</span>
            </>
          ) : (
            "Number: "
          )}
          <span className="text-highlight">{nums ? nums[idx] : 0}</span>
        </h3>
        <div className="flex flex-col items-center justify-center">
          <LocalBoard
            nums={nums || []}
            idx={idx}
            board={board}
            stepNext={() => {
              setIdx((i) => i + 1);
            }}
            changeBoard={setBoard}
          />
        </div>
        <HowToLink />
      </div>
    </Layout>
  );
};

export default LocalRoom;
