import crypto from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const FLOW_BASE =
  process.env.FLOW_ENV === "production"
    ? "https://www.flow.cl/api"
    : "https://sandbox.flow.cl/api";

function sign(params: Record<string, string>, secret: string): string {
  const keys = Object.keys(params).sort();
  const msg = keys.map((k) => `${k}${params[k]}`).join("");
  return crypto.createHmac("sha256", secret).update(msg).digest("hex");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const apiKey = process.env.FLOW_API_KEY;
  const secretKey = process.env.FLOW_SECRET_KEY;
  const siteUrl = process.env.SITE_URL ?? "https://liza-espacio-belleza-frontend-ke8yzx3u0-pegassus.vercel.app";

  if (!apiKey || !secretKey)
    return res.status(500).json({ error: "Flow credentials not configured" });

  const { amount, subject, email, orderId } = req.body as {
    amount: number;
    subject: string;
    email: string;
    orderId: string;
  };

  const params: Record<string, string> = {
    apiKey,
    commerceOrder: orderId,
    subject,
    amount: String(Math.round(amount)),
    email,
    urlConfirmation: `${siteUrl}/api/flow-confirm`,
    urlReturn: `${siteUrl}/pago-exitoso`,
    currency: "CLP",
    paymentMethod: "9",
  };
  params.s = sign(params, secretKey);

  const flowRes = await fetch(`${FLOW_BASE}/payment/create`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });

  const data = await flowRes.json() as { url?: string; token?: string; error?: number; message?: string };

  if (!flowRes.ok || data.error)
    return res.status(502).json({ error: data.message ?? "Flow API error" });

  return res.status(200).json({ redirectUrl: `${data.url}?token=${data.token}`, token: data.token });
}
