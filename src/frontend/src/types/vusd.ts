// vUSD demo layer types — re-exported from the generated Candid bindings
// (@/backend) so the frontend stays in lockstep with backend.d.ts.
// All amounts are in cents (bigint) to keep integer math exact:
//   - balance / priceVusd / demoTopupAmount are vUSD *cents* (1 vUSD = 100 cents)
//   - clpUsdRate is CLP per 1 USD (e.g. 950n => 950 CLP = 1 USD = 1 vUSD)
//
// This is a visual demo only — no real on-chain transactions are performed.

import { MintableItemType } from "@/backend";
import type {
  MintedServiceToken,
  Result_1,
  VusdDemoConfig,
  VusdMintResult,
  VusdWallet,
} from "@/backend";

// Re-export the generated interfaces with the names the rest of the
// codebase expects.
export type {
  VusdWallet,
  MintedServiceToken,
  VusdMintResult,
  VusdDemoConfig,
  Result_1 as VusdMintResultVariant,
};

// `VusdItemType` is an alias for the generated `MintableItemType` enum so
// consumers can keep using `VusdItemType.service` / `VusdItemType.combo`.
// Re-exported as a value (enum) — not a type-only export.
export { MintableItemType as VusdItemType };

// Format vUSD cents as a localized currency string, e.g. 123456n => "1.234,56 vUSD".
export function formatVusd(balanceCents: bigint): string {
  const cents = Number(balanceCents);
  const value = cents / 100;
  const formatted = value.toLocaleString("es-CL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} vUSD`;
}

// Convert CLP to vUSD cents using the CLP/USD rate.
// vUSD cents = (clp / clpUsdRate) * 100, integer division.
export function clpToVusdCents(clp: bigint, clpUsdRate: bigint): bigint {
  if (clpUsdRate <= 0n) return 0n;
  return (clp / clpUsdRate) * 100n;
}
