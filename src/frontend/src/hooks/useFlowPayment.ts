import { useState } from "react";

export interface FlowPaymentOptions {
  amount: number;
  subject: string;
  email: string;
  orderId: string;
}

export function useFlowPayment() {
  const [isPending, setIsPending] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createPaymentLink(options: FlowPaymentOptions): Promise<string | null> {
    setIsPending(true);
    setError(null);
    setPaymentUrl(null);
    try {
      const res = await fetch("/api/flow-create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });
      const data = await res.json() as { redirectUrl?: string; error?: string };
      if (!res.ok || !data.redirectUrl) throw new Error(data.error ?? "Error al crear la orden");
      setPaymentUrl(data.redirectUrl);
      return data.redirectUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
      return null;
    } finally {
      setIsPending(false);
    }
  }

  function reset() {
    setPaymentUrl(null);
    setError(null);
  }

  return { createPaymentLink, isPending, paymentUrl, error, reset };
}

export function generateOrderId(serviceId: bigint): string {
  const rand = Math.random().toString(36).slice(2, 6);
  return `LIZA-${serviceId}-${Date.now()}-${rand}`.toUpperCase();
}
