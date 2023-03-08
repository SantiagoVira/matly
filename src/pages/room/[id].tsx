import { useRouter } from "next/router";
import Layout from "~/components/shared/layout";

const Room: React.FC = () => {
  const router = useRouter();
  const id = router.query.id;

  return <Layout title="Room">{id}</Layout>;
};

export default Room;
