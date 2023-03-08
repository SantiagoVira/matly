import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "~/components/shared/layout";
import { api } from "~/utils/api";

const Room: React.FC = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const id = router.query.id?.toString();
  const roomQuery = api.room.findUnique.useQuery({ id: id ?? "" });
  const room = roomQuery.data;

  console.log(
    room?.members.map((user) => user.id),
    sessionData?.user.id
  );

  if (
    status === "authenticated" &&
    sessionData?.user.id &&
    !room?.members.map((user) => user.id).includes(sessionData?.user.id)
  )
    return (
      <Layout>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1>Class not found!</h1>
          <p>
            Make sure the code is correct and that you have joined this class.
          </p>
        </div>
      </Layout>
    );

  return (
    <Layout
      title={`Room ${(id ?? "").toUpperCase()}`}
      loading={!room?.members.map((user) => user.id)}
    >
      <h1 className="w-full px-8 text-left">
        Room <span className="text-highlight">{id?.toUpperCase()}</span>
      </h1>
      <div className="my-4 w-full px-8">
        <hr className="w-full border-[#9e9e9e] " />
      </div>
      <div className="flex w-full items-center gap-2 px-10">
        <h2>Members</h2>{" "}
        <h2 className="font-extralight">- {room?.members.length}</h2>
      </div>
      {room?.members.map((user, i) => (
        <p className="w-full px-14 text-left" key={i}>
          {user.name}
        </p>
      ))}
    </Layout>
  );
};

export default Room;
