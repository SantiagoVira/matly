import Layout from "./shared/layout";

export const LoadingAnim: React.FC = () => (
  <div className="my-auto h-10 w-10 animate-pulse rounded-full bg-black/30" />
);

const Loading: React.FC = () => (
  <Layout title="Loading...">
    <LoadingAnim />
  </Layout>
);

export default Loading;
