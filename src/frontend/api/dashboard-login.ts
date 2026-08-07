import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildSessionCookie, createSessionToken, findUserByPassword } from "./_lib/session.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { password } = (req.body ?? {}) as { password?: string };
  const user = typeof password === "string" && password.length > 0 ? findUserByPassword(password) : null;

  if (!user) {
    return res.status(401).json({ ok: false, error: "Contraseña incorrecta" });
  }

  res.setHeader("Set-Cookie", buildSessionCookie(createSessionToken(user.id)));
  return res.status(200).json({ ok: true, user });
}
