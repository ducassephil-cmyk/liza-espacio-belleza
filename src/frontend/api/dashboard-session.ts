import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSessionUser } from "./_lib/session.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = getSessionUser(req);
  return res.status(200).json({ authenticated: !!user, user });
}
