import { useQuery } from "@tanstack/react-query";

export interface ShopifyOrder {
  id: number;
  name: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface ShopifyData {
  connected: boolean;
  orders: ShopifyOrder[];
  revenue: number;
}

export function useShopifyData() {
  return useQuery<ShopifyData>({
    queryKey: ["shopify-data"],
    queryFn: async () => {
      const res = await fetch("/api/shopify-orders");
      if (!res.ok) return { connected: false, orders: [], revenue: 0 };
      return res.json() as Promise<ShopifyData>;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
