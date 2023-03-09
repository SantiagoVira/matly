import Pusher from "pusher";
import { env } from "~/env.mjs";
import * as superjson from "superjson";
import type { User } from "next-auth";

export const pusher = new Pusher({
  appId: env.PUSHER_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export const invalidateRoom = async (roomId: string, user: User) => {
  await pusher.trigger(roomId, "invalidate", {
    raw: superjson.stringify({
      userId: user.id,
      redeemedAt: Date.now(),
      user: user,
    }),
  });
};
