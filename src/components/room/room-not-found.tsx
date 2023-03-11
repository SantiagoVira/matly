import Layout from "../shared/layout";

const RoomNotFound: React.FC = () => (
  <Layout>
    <div className="flex h-full w-full flex-col items-center justify-center pt-4">
      <h1 className="text-center">Room not found!</h1>
      <p className="text-center">
        Make sure the code is correct and that you have joined this class.
      </p>
    </div>
  </Layout>
);

export default RoomNotFound;
