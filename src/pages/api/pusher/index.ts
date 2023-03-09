import Pusher from "pusher";
import { env } from "~/env.mjs";

export const pusher = new Pusher({
  appId: env.PUSHER_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export const invalidateRoom = async (roomId: string) => {
  await pusher.trigger(roomId, "invalidate", {});
};
