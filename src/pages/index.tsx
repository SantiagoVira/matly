import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "~/components/shared/layout";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <Layout>
      {sessionData?.user ? (
        <p>Welcome</p>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1>To begin, sign in!</h1>
        </div>
      )}
    </Layout>
  );
};

export default Home;
