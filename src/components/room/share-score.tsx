/* eslint-disable @typescript-eslint/no-misused-promises */
import { useToast } from "~/utils/use-toast";

const ShareScore: React.FC<{ score: number | undefined }> = ({ score }) => {
  const { toast } = useToast();
  return score && score > 0 ? (
    <p
      className="mb-2 text-highlight underline hover:cursor-pointer"
      onClick={async () => {
        if (navigator.share) {
          await navigator.share({
            title: "Daily Matly",
            text: `I scored ${
              score ?? 0
            } on today's daily Matly. Can you beat me?`,
            url: "https://matly.fun/daily",
          });
        } else {
          await navigator.clipboard.writeText(
            `I scored ${
              score ?? 0
            } on today's daily Matly. Can you beat me? https://matly.fun/daily`
          );
          toast({
            title: `Results copied to clipboard`,
          });
        }
      }}
    >
      Share my score
    </p>
  ) : (
    <></>
  );
};

export default ShareScore;
