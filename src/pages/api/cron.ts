/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  await prisma.board.deleteMany({ where: { dailyUser: { isNot: undefined } } });
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  });
}
