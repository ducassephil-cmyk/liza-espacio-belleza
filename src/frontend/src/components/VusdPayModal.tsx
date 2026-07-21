import { BlackGlassButton } from "@/components/BlackGlassButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useConnectDemoWallet,
  useMintServiceToken,
  useTopupVusd,
  useVusdConfig,
  useVusdSession,
  useVusdWallet,
} from "@/hooks/useVusd";
import { cn } from "@/lib/utils";
import {
  type VusdItemType,
  type VusdMintResult,
  clpToVusdCents,
  formatCLP,
  formatVusd,
} from "@/types";
import { Check, Loader2, Sparkles, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const STEP_LABELS = [
  "Conectar wallet",
  "Precio en vUSD",
  "Confirmar mint",
  "Éxito",
] as const;

const NS_PER_MS = 1_000_000n;

function formatDateFromNs(ns: bigint): string {
  const ms = Number(ns / NS_PER_MS);
  return new Date(ms).toLocaleString("es-CL", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function shortAddress(walletId: string): string {
  const head = walletId.slice(0, 10);
  const tail = walletId.slice(-4);
  return `${head}…${tail}`;
}

// ---- Step indicator ----
function StepIndicator({ current }: { current: number }) {
  return (
    <ol
      className="flex items-center gap-1.5"
      aria-label="Pasos del flujo demo"
      data-ocid="vusd.step_indicator"
    >
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <li key={label} className="flex items-center gap-1.5">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full border font-mono text-[0.65rem] font-semibold transition-smooth",
                active &&
                  "border-prism-cyan/60 bg-prism-cyan/15 text-prism-cyan shadow-soft",
                done && "border-prism-gold/50 bg-prism-gold/15 text-prism-gold",
                !active &&
                  !done &&
                  "border-border bg-muted/40 text-muted-foreground",
              )}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check className="size-3" /> : n}
            </span>
            <span
              className={cn(
                "hidden font-mono text-[0.65rem] uppercase tracking-[0.15em] sm:inline",
                active ? "text-prism-cyan" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {n < STEP_LABELS.length && (
              <span
                aria-hidden
                className={cn(
                  "h-px w-4 sm:w-6",
                  done ? "bg-prism-gold/40" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ---- Mock wallet connect card (step 1) ----
function ConnectWalletStep({
  walletId,
  connecting,
  onConnect,
}: {
  walletId: string | null;
  connecting: boolean;
  onConnect: () => void;
}) {
  const mockAddress = useMemo(
    () => `0xvUSD${Date.now().toString(16).slice(0, 8)}`,
    [],
  );

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div
        className="relative flex size-20 items-center justify-center rounded-full border border-prism-cyan/40 bg-glass shadow-glass"
        data-ocid="vusd.wallet_icon"
      >
        <span
          aria-hidden
          className="absolute inset-0 animate-prism-pulse rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--prism-cyan)/0.25), transparent 70%)",
          }}
        />
        <Wallet className="relative size-9 text-prism-cyan" />
      </div>
      <div className="text-center">
        <p className="font-display text-lg text-foreground">
          Conecta tu billetera demo
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Simularemos la conexión de una wallet Web3. No se realiza ninguna
          transacción real on-chain.
        </p>
      </div>
      <div className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 font-mono text-xs text-muted-foreground">
        <span className="text-prism-cyan">Dirección demo:</span>{" "}
        <span className="text-foreground">{mockAddress}</span>
      </div>
      {walletId ? (
        <div className="flex items-center gap-2 rounded-full border border-prism-gold/40 bg-prism-gold/10 px-3 py-1.5 font-mono text-xs text-prism-gold">
          <Check className="size-3.5" />
          Wallet conectada · {shortAddress(walletId)}
        </div>
      ) : (
        <BlackGlassButton
          onClick={onConnect}
          disabled={connecting}
          data-ocid="vusd.connect_wallet_button"
        >
          {connecting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Conectando…
            </>
          ) : (
            <>
              <Wallet className="size-4" />
              Conectar wallet demo
            </>
          )}
        </BlackGlassButton>
      )}
    </div>
  );
}

// ---- Price preview (step 2) ----
function PriceStep({
  itemName,
  priceCLP,
  clpUsdRate,
  priceVusd,
  balance,
  onTopup,
  onContinue,
  topupPending,
}: {
  itemName: string;
  priceCLP: bigint;
  clpUsdRate: bigint;
  priceVusd: bigint;
  balance: bigint;
  onTopup: () => void;
  onContinue: () => void;
  topupPending: boolean;
}) {
  const insufficient = balance < priceVusd;
  return (
    <div className="flex flex-col gap-4 py-1">
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          Reserva
        </p>
        <p className="mt-1 font-display text-lg text-foreground">{itemName}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              Precio CLP
            </p>
            <p className="font-display text-base text-foreground">
              {formatCLP(priceCLP)}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              Tipo de cambio referencial
            </p>
            <p className="font-mono text-base text-prism-violet">
              {Number(clpUsdRate)} CLP = 1 USD
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              Equivalente en vUSD
            </p>
            <p className="font-display text-xl text-prism-cyan">
              {formatVusd(priceVusd)}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              Saldo disponible
            </p>
            <p
              className={cn(
                "font-display text-xl",
                insufficient ? "text-destructive" : "text-prism-gold",
              )}
            >
              {formatVusd(balance)}
            </p>
          </div>
        </div>
      </div>

      {insufficient && (
        <div
          className="flex flex-col gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4"
          data-ocid="vusd.insufficient_balance"
        >
          <p className="text-sm text-destructive">
            Saldo insuficiente para completar la reserva demo.
          </p>
          <BlackGlassButton
            size="sm"
            onClick={onTopup}
            disabled={topupPending}
            data-ocid="vusd.topup_button"
            className="self-start"
          >
            {topupPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
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
      )}

      <BlackGlassButton
        onClick={onContinue}
        disabled={insufficient}
        data-ocid="vusd.continue_to_mint_button"
        className="self-end"
      >
        Continuar
      </BlackGlassButton>
    </div>
  );
}

// ---- Confirm mint (step 3) ----
function ConfirmStep({
  itemName,
  priceVusd,
  onConfirm,
  minting,
}: {
  itemName: string;
  priceVusd: bigint;
  onConfirm: () => void;
  minting: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 py-1">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Al confirmar, se minteará un{" "}
        <span className="text-prism-cyan">service token de demostración</span>{" "}
        asociado a tu reserva. Esto es solo una demo visual, no una transacción
        real on-chain.
      </p>
      <div
        className="relative overflow-hidden rounded-xl border border-prism-cyan/40 bg-glass p-4 shadow-glass"
        data-ocid="vusd.token_preview"
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-[length:200%_100%] animate-prism-shimmer"
          style={{ backgroundImage: "var(--gradient-prism)" }}
        />
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-prism-cyan">
          Service token · preview
        </p>
        <p className="mt-1 font-display text-lg text-foreground">{itemName}</p>
        <p className="mt-2 font-mono text-sm text-prism-gold">
          {formatVusd(priceVusd)}
        </p>
      </div>
      <BlackGlassButton
        onClick={onConfirm}
        disabled={minting}
        data-ocid="vusd.confirm_mint_button"
        className="self-end"
      >
        {minting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Minteando…
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            Confirmar y mintear
          </>
        )}
      </BlackGlassButton>
    </div>
  );
}

// ---- Success (step 4) ----
function SuccessStep({
  result,
  itemName,
  walletId,
}: {
  result: VusdMintResult;
  itemName: string;
  walletId: string;
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div
        className="relative flex size-16 items-center justify-center rounded-full border border-prism-gold/50 bg-prism-gold/10"
        data-ocid="vusd.success_icon"
      >
        <Check className="size-8 text-prism-gold" />
      </div>
      <div className="text-center">
        <p className="font-display text-xl text-foreground">
          ¡Service token minteado!
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu reserva demo quedó registrada con vUSD.
        </p>
      </div>
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-prism-cyan/50 bg-glass p-5 shadow-glass"
        data-ocid="vusd.minted_token_card"
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
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-prism-cyan">
              Service token
            </p>
            <p className="mt-1 font-display text-lg leading-tight text-foreground">
              {itemName}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-prism-cyan/40 bg-prism-cyan/10 px-2.5 py-1 font-mono text-[0.65rem] font-medium text-prism-cyan">
            <span
              aria-hidden
              className="size-1.5 animate-prism-pulse rounded-full bg-prism-cyan"
            />
            Reservado con vUSD
          </span>
        </div>
        <dl className="relative mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
          <div>
            <dt className="text-muted-foreground">Token ID</dt>
            <dd className="text-foreground">#{result.tokenId.toString()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Fecha de mint</dt>
            <dd className="text-foreground">
              {formatDateFromNs(BigInt(Date.now()) * NS_PER_MS)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">Wallet</dt>
            <dd className="truncate text-foreground">
              {shortAddress(walletId)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

// ---- Main modal ----
export interface VusdPayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemType: VusdItemType;
  itemId: bigint;
  itemName: string;
  priceCLP: bigint;
  onSuccess: (result: VusdMintResult) => void;
}

export function VusdPayModal({
  open,
  onOpenChange,
  itemType: _itemType,
  itemId: _itemId,
  itemName,
  priceCLP,
  onSuccess,
}: VusdPayModalProps) {
  const { walletId, setWalletId } = useVusdSession();
  const configQuery = useVusdConfig();
  const walletQuery = useVusdWallet(walletId);
  const connectMutation = useConnectDemoWallet();
  const topupMutation = useTopupVusd();
  const mintMutation = useMintServiceToken();

  const [step, setStep] = useState(1);
  const [mintResult, setMintResult] = useState<VusdMintResult | null>(null);

  // Reset to step 1 each time the modal opens.
  useEffect(() => {
    if (open) {
      setMintResult(null);
      setStep(walletId ? 2 : 1);
    }
  }, [open, walletId]);

  const clpUsdRate = configQuery.data?.clpUsdRate ?? 950n;
  const priceVusd = clpToVusdCents(priceCLP, clpUsdRate);
  const balance = walletQuery.data?.balance ?? 0n;

  const handleConnect = () => {
    connectMutation.mutate(undefined, {
      onSuccess: (wallet) => {
        setWalletId(wallet.walletId);
        setStep(2);
      },
    });
  };

  const handleTopup = () => {
    if (!walletId) return;
    topupMutation.mutate({ walletId });
  };

  const handleConfirm = () => {
    if (!walletId) return;
    mintMutation.mutate(
      {
        walletId,
        itemType: _itemType,
        itemId: _itemId,
        itemName,
        priceVusd,
      },
      {
        onSuccess: (result) => {
          setMintResult(result);
          setStep(4);
        },
      },
    );
  };

  const handleClose = () => {
    if (mintResult) onSuccess(mintResult);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-ocid="vusd.pay_modal">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            Reservar con vUSD
          </DialogTitle>
          <DialogDescription>
            Demo visual del flujo mint service · sin transacciones reales.
          </DialogDescription>
        </DialogHeader>

        <StepIndicator current={step} />

        <div className="min-h-[12rem]">
          {step === 1 && (
            <ConnectWalletStep
              walletId={walletId}
              connecting={connectMutation.isPending}
              onConnect={handleConnect}
            />
          )}
          {step === 2 && (
            <PriceStep
              itemName={itemName}
              priceCLP={priceCLP}
              clpUsdRate={clpUsdRate}
              priceVusd={priceVusd}
              balance={balance}
              onTopup={handleTopup}
              onContinue={() => setStep(3)}
              topupPending={topupMutation.isPending}
            />
          )}
          {step === 3 && (
            <ConfirmStep
              itemName={itemName}
              priceVusd={priceVusd}
              onConfirm={handleConfirm}
              minting={mintMutation.isPending}
            />
          )}
          {step === 4 && mintResult && (
            <SuccessStep
              result={mintResult}
              itemName={itemName}
              walletId={walletId ?? ""}
            />
          )}
        </div>

        <DialogFooter>
          {step === 4 && (
            <BlackGlassButton
              onClick={handleClose}
              data-ocid="vusd.close_success_button"
            >
              <Check className="size-4" />
              Listo
            </BlackGlassButton>
          )}
          {step < 4 && (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              data-ocid="vusd.cancel_button"
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancelar
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
