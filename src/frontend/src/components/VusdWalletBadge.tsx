import { BlackGlassButton } from "@/components/BlackGlassButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useConnectDemoWallet,
  useMintedTokens,
  useTopupVusd,
  useVusdSession,
  useVusdWallet,
} from "@/hooks/useVusd";
import { cn } from "@/lib/utils";
import { formatVusd } from "@/types";
import { Link } from "@tanstack/react-router";
import { Loader2, LogOut, Sparkles, Wallet } from "lucide-react";
import { useState } from "react";

const NS_PER_MS = 1_000_000n;

function formatDateFromNs(ns: bigint): string {
  const ms = Number(ns / NS_PER_MS);
  return new Date(ms).toLocaleDateString("es-CL", {
    dateStyle: "medium",
  });
}

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

export interface VusdWalletBadgeProps {
  className?: string;
}

export function VusdWalletBadge({ className }: VusdWalletBadgeProps) {
  const { walletId, setWalletId, clearWalletId } = useVusdSession();
  const walletQuery = useVusdWallet(walletId);
  const mintedQuery = useMintedTokens(walletId);
  const connectMutation = useConnectDemoWallet();
  const topupMutation = useTopupVusd();
  const [open, setOpen] = useState(false);

  const balance = walletQuery.data?.balance ?? 0n;
  const minted = mintedQuery.data ?? [];
  const connected = !!walletId;

  const handleTriggerClick = () => {
    if (!connected) {
      connectMutation.mutate(undefined, {
        onSuccess: (wallet) => {
          setWalletId(wallet.walletId);
          setOpen(true);
        },
      });
    } else {
      setOpen(true);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          onClick={handleTriggerClick}
          data-ocid="vusd.wallet_badge"
          aria-label="Abrir billetera vUSD demo"
          className={cn(
            "group relative inline-flex h-9 items-center gap-1.5 rounded-full border border-prism-cyan/40 bg-glass px-3 font-mono text-xs font-medium text-glass shadow-soft transition-smooth hover:border-prism-cyan/70 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prism-cyan/50",
            className,
          )}
        >
          <VusdTokenIcon className="transition-transform group-hover:scale-110" />
          {connected ? (
            <span className="text-prism-cyan">{formatVusd(balance)}</span>
          ) : connectMutation.isPending ? (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Conectando
            </span>
          ) : (
            <span className="text-glass">Conectar vUSD</span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex flex-col gap-0 p-0"
        data-ocid="vusd.wallet_sheet"
      >
        <SheetHeader className="border-b border-border bg-card/60 p-5">
          <SheetTitle className="flex items-center gap-2 font-display text-foreground">
            <VusdTokenIcon />
            Billetera vUSD demo
          </SheetTitle>
          <p className="font-mono text-xs text-muted-foreground">
            Demo visual · sin transacciones reales on-chain
          </p>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
          {/* Balance card */}
          <div
            className="relative overflow-hidden rounded-2xl border border-prism-cyan/40 bg-glass p-5 shadow-glass"
            data-ocid="vusd.wallet_balance_card"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-[length:200%_100%] animate-prism-shimmer"
              style={{ backgroundImage: "var(--gradient-prism)" }}
            />
            <span
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(circle at top right, oklch(var(--prism-cyan)/0.18), transparent 60%)",
              }}
            />
            <div className="relative">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                Saldo disponible
              </p>
              <p className="mt-1 font-display text-3xl text-prism-cyan">
                {formatVusd(balance)}
              </p>
              <div className="mt-4">
                <BlackGlassButton
                  size="sm"
                  onClick={() => {
                    if (walletId) topupMutation.mutate({ walletId });
                  }}
                  disabled={topupMutation.isPending || !walletId}
                  data-ocid="vusd.wallet_topup_button"
                >
                  {topupMutation.isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Recargando…
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5" />
                      Recargar saldo demo
                    </>
                  )}
                </BlackGlassButton>
              </div>
            </div>
          </div>

          {/* Minted tokens list */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm text-foreground">
                Service tokens minted
              </h3>
              <span className="font-mono text-xs text-muted-foreground">
                {minted.length}
              </span>
            </div>

            {minted.length === 0 ? (
              <div
                className="mt-3 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center"
                data-ocid="vusd.empty_state"
              >
                <Wallet className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Aún no tienes service tokens minted
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  Reserva un servicio o combo con vUSD para verlo aquí.
                </p>
              </div>
            ) : (
              <ul className="mt-3 flex flex-col gap-2.5">
                {minted.map((token, i) => (
                  <li key={token.tokenId.toString()}>
                    <Link
                      to="/servicios"
                      data-ocid={`vusd.minted_token.${i + 1}`}
                      className="group flex items-center gap-3 rounded-xl border border-border bg-glass p-3 transition-smooth hover:-translate-y-0.5 hover:border-prism-cyan/50 hover:shadow-soft"
                    >
                      <span
                        aria-hidden
                        className="relative flex size-9 shrink-0 items-center justify-center rounded-lg border border-prism-cyan/40 bg-prism-cyan/10"
                      >
                        <VusdTokenIcon />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-sm text-foreground">
                          {token.itemName}
                        </p>
                        <p className="font-mono text-[0.65rem] text-muted-foreground">
                          #{token.tokenId.toString()} ·{" "}
                          {formatDateFromNs(token.mintedAt)}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-prism-cyan/40 bg-prism-cyan/10 px-2 py-0.5 font-mono text-[0.6rem] font-medium text-prism-cyan">
                        {formatVusd(token.priceVusd)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer: disconnect */}
        <div className="border-t border-border bg-card/60 p-4">
          <button
            type="button"
            onClick={() => {
              clearWalletId();
              setOpen(false);
            }}
            disabled={!connected}
            data-ocid="vusd.disconnect_button"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
          >
            <LogOut className="size-3.5" />
            Desconectar wallet demo
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
