import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  const domain = process.env.SHOPIFY_STORE_DOMAIN;

  if (!token || !domain) {
    return res.status(200).json({ connected: false, orders: [], revenue: 0 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const r = await fetch(
      `https://${domain}/admin/api/2024-01/orders.json?status=any&created_at_min=${today.toISOString()}&limit=50`,
      {
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
      },
    );

    if (!r.ok) {
      return res
        .status(200)
        .json({ connected: false, orders: [], revenue: 0, error: "Shopify API error" });
    }

    const data = await r.json();
    const orders = (data.orders ?? []) as Array<{
      id: number;
      contact_email?: string;
      customer?: { email?: string };
      total_price?: string;
      financial_status?: string;
      created_at?: string;
    }>;

    const revenue = orders.reduce(
      (sum, o) => sum + parseFloat(o.total_price ?? "0"),
      0,
    );

    return res.status(200).json({
      connected: true,
      orders: orders.map((o) => ({
        id: o.id,
        name: o.contact_email ?? o.customer?.email ?? "Cliente",
        total: parseFloat(o.total_price ?? "0"),
        status: o.financial_status ?? "unknown",
        createdAt: o.created_at ?? "",
      })),
      revenue,
    });
  } catch {
    return res.status(200).json({ connected: false, orders: [], revenue: 0 });
  }
}
