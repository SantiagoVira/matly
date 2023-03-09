import type { inferRouterOutputs } from "@trpc/server";
import type { RoomRouter } from "~/server/api/routers/room";

const Leaderboard: React.FC<{
  room: inferRouterOutputs<RoomRouter>["findUnique"];
}> = ({ room }) => {
  return (
    <div className="flex min-h-full w-full flex-1 flex-col items-start justify-start">
      <ol className="ml-4 list-decimal">
        {room?.members
          .filter((user) => user.board?.score && user.board?.score >= 0)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .sort((a, b) => b.board!.score - a.board!.score)
          .map((user, i) => (
            <li key={i}>
              {user.name} -{" "}
              <span className="text-highlight">
                {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
                {user.board!.score}
              </span>
            </li>
          ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
