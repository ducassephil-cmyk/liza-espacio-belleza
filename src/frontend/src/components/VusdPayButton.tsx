import { cn } from "@/lib/utils";
import type { VusdItemType } from "@/types/vusd";

// Small vUSD token icon — prism-cyan/gold gradient circle with a "v" glyph.
function VusdTokenIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex size-4 items-center justify-center rounded-full",
        className,
      )}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--prism-cyan)), oklch(var(--prism-gold)))",
        }}
      />
      <span className="relative font-mono text-[0.55rem] font-bold text-background">
        v
      </span>
    </span>
  );
}

export interface VusdPayButtonProps {
  itemType: VusdItemType;
  itemId: bigint;
  itemName: string;
  priceCLP: bigint;
  onPay: () => void;
  minted?: boolean;
  className?: string;
  ocidSuffix?: string;
}

export function VusdPayButton({
  itemType: _itemType,
  itemId: _itemId,
  itemName: _itemName,
  priceCLP: _priceCLP,
  onPay,
  minted = false,
  className,
  ocidSuffix,
}: VusdPayButtonProps) {
  const ocid = ocidSuffix ? `vusd.pay_button.${ocidSuffix}` : "vusd.pay_button";

  if (minted) {
    return (
      <span
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full border border-prism-cyan/40 bg-prism-cyan/10 px-3 font-mono text-xs font-medium text-prism-cyan",
          className,
        )}
        data-ocid={`${ocid}.minted_badge`}
      >
        <span
          aria-hidden
          className="size-1.5 animate-prism-pulse rounded-full bg-prism-cyan"
        />
        Reservado con vUSD
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onPay}
      data-ocid={ocid}
      aria-label={`Pagar ${_itemName} con vUSD`}
      className={cn(
        "group relative inline-flex h-9 items-center gap-1.5 rounded-full border border-prism-cyan/40 bg-glass px-3 font-mono text-xs font-medium text-glass shadow-soft transition-smooth hover:border-prism-cyan/70 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prism-cyan/50",
        className,
      )}
    >
      <VusdTokenIcon className="transition-transform group-hover:scale-110" />
      Pagar con vUSD
    </button>
  );
}
