import { env } from "~/env.mjs";
import type { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
import Pusher from "pusher";
import { authOptions } from "~/server/auth";

const pusher = new Pusher({
  appId: env.PUSHER_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

interface ReqBody {
  socket_id: string;
  [key: string]: string; // you could set more explicit headers names or even remove the above and set just this line
}

const handler: NextApiHandler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || !session.user) return res.status(403).end();

  const body = req.body as ReqBody;
  const socketId = body["socket_id"];

  console.log("!!!!!!!!!!!!!!!!!!!!", socketId);

  pusher.authenticateUser(socketId, {
    id: session.user.id,
  });

  return res.status(200).end();
};

export default handler;
