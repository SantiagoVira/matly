import { inferRouterOutputs } from "@trpc/server";
import { RoomRouter } from "~/server/api/routers/room";

const MemberList: React.FC<{
  room: inferRouterOutputs<RoomRouter>["findUnique"];
}> = ({ room }) => {
  return (
    <div className="h-full w-full">
      <div className="flex w-full items-center gap-2 px-10">
        <h2>Members</h2>{" "}
        <h2 className="font-extralight">- {room?.members.length}</h2>
      </div>
      {room?.members.map((user, i) => (
        <p className="w-full px-14 text-left" key={i}>
          {user.name}
        </p>
      ))}
    </div>
  );
};

export default MemberList;
