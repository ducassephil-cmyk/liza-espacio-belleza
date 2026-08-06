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
  if (!apiKey || !secretKey) return new Response("Missing credentials", { status: 500 });

  const formData = await req.formData();
  const token = formData.get("token") as string;
  if (!token) return new Response("Missing token", { status: 400 });

  const params: Record<string, string> = { apiKey, token };
  params.s = sign(params, secretKey);

  const res = await fetch(`${FLOW_BASE}/payment/getStatus?${new URLSearchParams(params)}`);
  const payment = await res.json() as { status: number; commerceOrder: string; amount: number; payer: string };

  if (payment.status === 2) {
    console.log(`✅ Pago confirmado — orden ${payment.commerceOrder} $${payment.amount} CLP ${payment.payer}`);
  }

  return new Response("OK", { status: 200 });
}
