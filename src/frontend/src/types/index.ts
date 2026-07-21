// Shared types matching backend.d.ts — re-exported for ergonomic imports.
// Source of truth lives in @/backend; these aliases keep page imports short.

import {
  ComboType,
  ProductBadge,
  // Enums must be imported as values so callers can use `ServiceCategory.facial` etc.
  ServiceCategory,
} from "@/backend";
import type {
  Application,
  Combo,
  Error_,
  Id,
  Partner,
  Product,
  Result,
  Service,
  Testimonial,
  Timestamp,
  Worker,
} from "@/backend";

export type {
  Service,
  Combo,
  Worker,
  Product,
  Testimonial,
  Partner,
  Application,
  Id,
  Timestamp,
  Result,
  Error_,
};

// Re-export enums as values (not types-only) so consumers can reference members.
export { ServiceCategory, ComboType, ProductBadge };

// Frontend-only helpers — cupos scarcity tiers derived from cuposTotal.
export type CuposTier = "alto" | "medio" | "bajo" | "agotado";

export function deriveCuposTier(cuposTotal: bigint): CuposTier {
  const n = Number(cuposTotal);
  if (n <= 0) return "agotado";
  if (n <= 3) return "bajo";
  if (n <= 8) return "medio";
  return "alto";
}

export const CUPOS_TIER_LABEL: Record<CuposTier, string> = {
  alto: "Cupos disponibles",
  medio: "Cupos limitados",
  bajo: "Últimos cupos",
  agotado: "Cupos agotados",
};

// Service category labels in Spanish (Chile).
export const SERVICE_CATEGORY_LABEL: Record<ServiceCategory, string> = {
  facial: "Facial",
  corporal: "Corporal",
  especial: "Especial",
};

// Combo type labels in Spanish (Chile).
export const COMBO_TYPE_LABEL: Record<ComboType, string> = {
  untilDecember: "Válido hasta diciembre",
  monthly: "Mensual",
  newClient: "Nuevos clientes",
};

// Product badge labels in Spanish (Chile).
export const PRODUCT_BADGE_LABEL: Record<ProductBadge, string> = {
  new: "Nuevo",
  recommended: "Recomendado",
};

// Format CLP currency.
export function formatCLP(value: bigint): string {
  return `$${Number(value).toLocaleString("es-CL")}`;
}

// ---- vUSD demo layer ----
// Re-export vUSD types and helpers so they're available via @/types.
// `VusdItemType` is an enum (value), so it must be re-exported as a value,
// not as a type-only export.
export type {
  VusdWallet,
  MintedServiceToken,
  VusdMintResult,
  VusdDemoConfig,
  VusdMintResultVariant,
} from "./vusd";
export { VusdItemType, formatVusd, clpToVusdCents } from "./vusd";
