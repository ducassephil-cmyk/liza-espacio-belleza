import { BlackGlassButton } from "@/components/BlackGlassButton";
import { COMBO_TYPE_LABEL, type Combo, formatCLP } from "@/types";
import { Check } from "lucide-react";
import { motion } from "motion/react";

export function ComboCard({
  combo,
  index = 0,
}: { combo: Combo; index?: number }) {
  const regular = Number(combo.regularPriceCLP);
  const price = Number(combo.priceCLP);
  const hasDiscount = regular > price && regular > 0;
  const discountPct = hasDiscount
    ? Math.round(((regular - price) / regular) * 100)
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elevated"
      data-ocid={`combo.card.${index + 1}`}
    >
      {/* Prism border accent */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px scale-x-0 bg-[length:200%_100%] transition-transform duration-500 group-hover:scale-x-100"
        style={{ backgroundImage: "var(--gradient-prism)" }}
      />

      {/* Combo type badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-full border border-prism-violet/40 bg-accent/10 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-prism-violet">
          {COMBO_TYPE_LABEL[combo.comboType]}
        </span>
        {hasDiscount && (
          <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 font-mono text-xs font-semibold text-primary-foreground">
            -{discountPct}%
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-2xl leading-tight text-foreground">
        {combo.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {combo.description}
      </p>

      {/* Services included count */}
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Check className="size-3.5 text-prism-rose" />
        <span>
          {combo.servicesIncluded.length} servicio
          {combo.servicesIncluded.length === 1 ? "" : "s"} incluido
          {combo.servicesIncluded.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Validity */}
      <p className="mt-1 font-mono text-xs text-muted-foreground">
        {combo.validity}
      </p>

      {/* Cupos scarcity */}
      <div className="mt-4 flex items-center gap-2">
        <span
          aria-hidden
          className="size-2 animate-prism-pulse rounded-full bg-prism-cyan"
        />
        <span className="font-mono text-xs text-muted-foreground">
          {Number(combo.cuposTotal)} cupos disponibles
        </span>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
        <div className="flex flex-col">
          {hasDiscount && (
            <span className="font-mono text-xs text-muted-foreground line-through">
              {formatCLP(combo.regularPriceCLP)}
            </span>
          )}
          <span className="font-display text-3xl text-foreground">
            {formatCLP(combo.priceCLP)}
          </span>
        </div>
        <BlackGlassButton
          size="sm"
          asChild
          data-ocid={`combo.agendar_button.${index + 1}`}
        >
          <a
            href={combo.agendaproUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar
          </a>
        </BlackGlassButton>
      </div>
    </motion.article>
  );
}
