import { useQuery } from "@tanstack/react-query";

export interface InstagramData {
  connected: boolean;
  username?: string;
  followers?: number;
  postCount?: number;
  recentLikes?: number;
  recentComments?: number;
  error?: string;
}

export function useInstagramMetrics() {
  return useQuery<InstagramData>({
    queryKey: ["instagram-metrics"],
    queryFn: async () => {
      const res = await fetch("/api/instagram-metrics");
      if (!res.ok) return { connected: false };
      return res.json() as Promise<InstagramData>;
    },
    staleTime: 15 * 60 * 1000,
    retry: false,
  });
}
