import crypto from "node:crypto";

const FLOW_BASE =
  process.env.FLOW_ENV === "production"
    ? "https://www.flow.cl/api"
    : "https://sandbox.flow.cl/api";

function sign(params: Record<string, string>, secret: string): string {
  const keys = Object.keys(params).sort();
  const msg = keys.map((k) => `${k}${params[k]}`).join("");
  return crypto.createHmac("sha256", secret).update(msg).digest("hex");
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const apiKey = process.env.FLOW_API_KEY;
  const secretKey = process.env.FLOW_SECRET_KEY;
  const siteUrl = process.env.SITE_URL ?? "https://liza-espacio-belleza-frontend-l88z4paqk-pegassus.vercel.app";

  if (!apiKey || !secretKey)
    return new Response(JSON.stringify({ error: "Flow credentials not configured" }), { status: 500, headers: { "Content-Type": "application/json" } });

  const body = await req.json() as { amount: number; subject: string; email: string; orderId: string };
  const { amount, subject, email, orderId } = body;

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

  const res = await fetch(`${FLOW_BASE}/payment/create`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });

  const data = await res.json() as { url?: string; token?: string; error?: number; message?: string };

  if (!res.ok || data.error)
    return new Response(JSON.stringify({ error: data.message ?? "Flow API error" }), { status: 502, headers: { "Content-Type": "application/json" } });

  return new Response(JSON.stringify({ redirectUrl: `${data.url}?token=${data.token}`, token: data.token }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": siteUrl },
  });
}
