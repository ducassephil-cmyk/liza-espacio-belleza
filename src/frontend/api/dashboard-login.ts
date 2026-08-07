import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildSessionCookie, createSessionToken, safeCompare } from "./_lib/session";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) {
    return res.status(500).json({ ok: false, error: "DASHBOARD_PASSWORD no está configurada en Vercel" });
  }

  const { password } = (req.body ?? {}) as { password?: string };
  if (typeof password !== "string" || password.length === 0 || !safeCompare(password, expected)) {
    return res.status(401).json({ ok: false, error: "Contraseña incorrecta" });
  }

  res.setHeader("Set-Cookie", buildSessionCookie(createSessionToken()));
  return res.status(200).json({ ok: true });
}
