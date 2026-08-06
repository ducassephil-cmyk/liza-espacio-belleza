import { MintableItemType } from "@/backend";
import { BlackGlassButton } from "@/components/BlackGlassButton";
import { VusdPayButton } from "@/components/VusdPayButton";
import { VusdPayModal } from "@/components/VusdPayModal";
import { useMintedTokens, useVusdSession } from "@/hooks/useVusd";
import { cn } from "@/lib/utils";
import {
  CUPOS_TIER_LABEL,
  type CuposTier,
  SERVICE_CATEGORY_LABEL,
  type Service,
  deriveCuposTier,
  formatCLP,
} from "@/types";
import { Clock, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const tierStyles: Record<CuposTier, string> = {
  alto: "text-success",
  medio: "text-warning",
  bajo: "text-destructive",
  agotado: "text-muted-foreground",
};

const tierDot: Record<CuposTier, string> = {
  alto: "bg-success",
  medio: "bg-warning",
  bajo: "bg-destructive",
  agotado: "bg-muted-foreground",
};

export function ServiceCard({
  service,
  index = 0,
}: {
  service: Service;
  index?: number;
}) {
  const tier = deriveCuposTier(service.cuposTotal);
  const cuposNum = Number(service.cuposTotal);
  const { walletId } = useVusdSession();
  const mintedQuery = useMintedTokens(walletId);
  const [modalOpen, setModalOpen] = useState(false);

  const minted = (mintedQuery.data ?? []).some(
    (t) => t.itemType === MintableItemType.service && t.itemId === service.id,
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px", amount: 0.1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elevated"
      data-ocid={`service.card.${index + 1}`}
    >
      <VusdPayModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        itemType={MintableItemType.service}
        itemId={service.id}
        itemName={service.name}
        priceCLP={service.priceCLP}
        onSuccess={() => {
          void mintedQuery.refetch();
        }}
      />
      {/* Prism top accent on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px scale-x-0 bg-[length:200%_100%] transition-transform duration-500 group-hover:scale-x-100"
        style={{ backgroundImage: "var(--gradient-prism)" }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-prism-violet">
            {SERVICE_CATEGORY_LABEL[service.category]}
          </span>
          <h3 className="mt-1 font-display text-xl leading-tight text-foreground">
            {service.name}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs text-muted-foreground">
          <Clock className="size-3" />
          {Number(service.durationMins)} min
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {service.description}
      </p>

      {/* Techniques chips */}
      {service.techniques.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {service.techniques.slice(0, 4).map((t) => (
            <li
              key={t}
              className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-xs text-foreground/80"
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      {/* Cupos scarcity counter — front-end only */}
      <div className="mt-5 flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            "size-2 rounded-full",
            tierDot[tier],
            tier !== "agotado" && "animate-prism-pulse",
          )}
        />
        <span className={cn("font-mono text-xs font-medium", tierStyles[tier])}>
          {CUPOS_TIER_LABEL[tier]}
        </span>
        {tier !== "agotado" && (
          <span className="font-mono text-xs text-muted-foreground">
            · {cuposNum} restantes
          </span>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="font-display text-2xl text-foreground">
              {formatCLP(service.priceCLP)}
            </span>
            {service.allIncluded && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs text-prism-rose">
                <Sparkles className="size-3" />
                Todo incluido
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BlackGlassButton
            size="sm"
            asChild
            className="flex-1"
            data-ocid={`service.agendar_button.${index + 1}`}
          >
            <a
              href={service.agendaproUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar
            </a>
          </BlackGlassButton>
          <VusdPayButton
            itemType={MintableItemType.service}
            itemId={service.id}
            itemName={service.name}
            priceCLP={service.priceCLP}
            onPay={() => setModalOpen(true)}
            minted={minted}
            ocidSuffix={`service.${index + 1}`}
          />
        </div>
      </div>
    </motion.article>
  );
}
