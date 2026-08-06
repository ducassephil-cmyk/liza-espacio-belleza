import { useState } from "react";

export interface FlowPaymentOptions {
  amount: number;
  subject: string;
  email: string;
  orderId: string;
}

export function useFlowPayment() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay(options: FlowPaymentOptions): Promise<void> {
    setIsPending(true);
    setError(null);
    try {
      const res = await fetch("/api/flow-create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });
      const data = await res.json() as { redirectUrl?: string; error?: string };
      if (!res.ok || !data.redirectUrl) throw new Error(data.error ?? "Error al crear la orden");
      window.location.href = data.redirectUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
      setIsPending(false);
    }
  }

  return { pay, isPending, error };
}

export function generateOrderId(serviceId: bigint): string {
  const rand = Math.random().toString(36).slice(2, 6);
  return `LIZA-${serviceId}-${Date.now()}-${rand}`.toUpperCase();
}
