import Layout from "../shared/layout";

const RoomNotFound: React.FC = () => (
  <Layout>
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1>Room not found!</h1>
      <p>Make sure the code is correct and that you have joined this class.</p>
    </div>
  </Layout>
);

export default RoomNotFound;
