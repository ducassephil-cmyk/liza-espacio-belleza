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
  if (!apiKey || !secretKey) return res.status(500).send("Missing credentials");

  const token = (req.body as { token?: string }).token;
  if (!token) return res.status(400).send("Missing token");

  const params: Record<string, string> = { apiKey, token };
  params.s = sign(params, secretKey);

  const flowRes = await fetch(`${FLOW_BASE}/payment/getStatus?${new URLSearchParams(params)}`);
  const payment = await flowRes.json() as { status: number; commerceOrder: string; amount: number; payer: string };

  if (payment.status === 2) {
    console.log(`✅ Pago confirmado — orden ${payment.commerceOrder} $${payment.amount} CLP ${payment.payer}`);
  }

  return res.status(200).send("OK");
}
