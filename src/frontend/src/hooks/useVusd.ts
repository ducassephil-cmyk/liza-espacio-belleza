import { createActor } from "@/backend";
import type { MintableItemType } from "@/backend";
import { mockBackend } from "@/mocks/backend";
import type {
  MintedServiceToken,
  VusdMintResultVariant as Result_1,
  VusdDemoConfig,
  VusdMintResult,
  VusdWallet,
} from "@/types/vusd";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

const WALLET_STORAGE_KEY = "liza_vusd_wallet";

// ---- Session: persists the demo walletId across reloads ----

export interface VusdSession {
  walletId: string | null;
  setWalletId: (id: string | null) => void;
  clearWalletId: () => void;
}

export function useVusdSession(): VusdSession {
  const [walletId, setWalletIdState] = useState<string | null>(null);

  // Read once on mount (avoids SSR mismatch and storage race).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(WALLET_STORAGE_KEY);
      if (stored) setWalletIdState(stored);
    } catch {
      // localStorage unavailable — ignore.
    }
  }, []);

  const setWalletId = useCallback((id: string | null) => {
    setWalletIdState(id);
    try {
      if (id) {
        window.localStorage.setItem(WALLET_STORAGE_KEY, id);
      } else {
        window.localStorage.removeItem(WALLET_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const clearWalletId = useCallback(() => setWalletId(null), [setWalletId]);

  return { walletId, setWalletId, clearWalletId };
}

// ---- Actor accessor with mock fallback ----
// The backend.d.ts may not yet expose the vUSD methods. We probe the actor at
// runtime and fall back to the in-memory mockBackend so the demo always works.
// We use a structural interface (not Pick<backendInterface, ...>) because the
// vUSD methods are demo-only and not part of the generated Candid bindings.

export interface VusdActor {
  getVusdConfig(): Promise<VusdDemoConfig>;
  getVusdWallet(walletId: string): Promise<VusdWallet | null>;
  connectDemoWallet(): Promise<VusdWallet>;
  topupVusd(walletId: string): Promise<VusdWallet>;
  getMintedTokens(walletId: string): Promise<MintedServiceToken[]>;
  mintServiceToken(
    walletId: string,
    itemType: MintableItemType,
    itemId: bigint,
    itemName: string,
    priceVusd: bigint,
  ): Promise<Result_1>;
}

function isVusdActor(actor: unknown): actor is VusdActor {
  if (!actor || typeof actor !== "object") return false;
  const a = actor as Record<string, unknown>;
  return (
    typeof a.getVusdConfig === "function" &&
    typeof a.getVusdWallet === "function" &&
    typeof a.connectDemoWallet === "function" &&
    typeof a.topupVusd === "function" &&
    typeof a.getMintedTokens === "function" &&
    typeof a.mintServiceToken === "function"
  );
}

function resolveVusdActor(actor: unknown): VusdActor {
  return isVusdActor(actor) ? actor : (mockBackend as unknown as VusdActor);
}

// ---- Queries ----

export function useVusdConfig() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<VusdDemoConfig>({
    queryKey: ["vusd-config"],
    queryFn: async () => {
      const a = resolveVusdActor(actor);
      return a.getVusdConfig();
    },
    enabled: !isFetching,
  });
}

export function useVusdWallet(walletId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<VusdWallet | null>({
    queryKey: ["vusd-wallet", walletId],
    queryFn: async () => {
      if (!walletId) return null;
      const a = resolveVusdActor(actor);
      return a.getVusdWallet(walletId);
    },
    enabled: !!walletId && !isFetching,
  });
}

export function useMintedTokens(walletId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MintedServiceToken[]>({
    queryKey: ["vusd-minted-tokens", walletId],
    queryFn: async () => {
      if (!walletId) return [];
      const a = resolveVusdActor(actor);
      return a.getMintedTokens(walletId);
    },
    enabled: !!walletId && !isFetching,
  });
}

// ---- Mutations ----

export function useConnectDemoWallet() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<VusdWallet, Error, void>({
    mutationFn: async () => {
      const a = resolveVusdActor(actor);
      return a.connectDemoWallet();
    },
    onSuccess: (wallet) => {
      queryClient.invalidateQueries({
        queryKey: ["vusd-wallet", wallet.walletId],
      });
      queryClient.invalidateQueries({
        queryKey: ["vusd-minted-tokens", wallet.walletId],
      });
    },
  });
}

export function useTopupVusd() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<VusdWallet, Error, { walletId: string }>({
    mutationFn: async ({ walletId }) => {
      const a = resolveVusdActor(actor);
      return a.topupVusd(walletId);
    },
    onSuccess: (wallet) => {
      queryClient.invalidateQueries({
        queryKey: ["vusd-wallet", wallet.walletId],
      });
    },
  });
}

export interface MintServiceTokenInput {
  walletId: string;
  itemType: MintableItemType;
  itemId: bigint;
  itemName: string;
  priceVusd: bigint; // vUSD cents
}

export function useMintServiceToken() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<VusdMintResult, Error, MintServiceTokenInput>({
    mutationFn: async (input) => {
      const a = resolveVusdActor(actor);
      const res = await a.mintServiceToken(
        input.walletId,
        input.itemType,
        input.itemId,
        input.itemName,
        input.priceVusd,
      );
      if (res.__kind__ === "err") {
        throw new Error("Saldo vUSD insuficiente");
      }
      return res.ok;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["vusd-wallet", result.walletId],
      });
      queryClient.invalidateQueries({
        queryKey: ["vusd-minted-tokens", result.walletId],
      });
    },
  });
}
