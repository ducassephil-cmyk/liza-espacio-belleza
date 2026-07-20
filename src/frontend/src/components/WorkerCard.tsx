import { cn } from "@/lib/utils";
import type { Worker } from "@/types";
import { motion } from "motion/react";

// Prism-styled silhouette — no real photos or generated portraits.
// Variant picks a different prism gradient + shape per worker.
const variantGradient: Record<number, string> = {
  0: "linear-gradient(135deg, oklch(var(--prism-rose)), oklch(var(--prism-violet)))",
  1: "linear-gradient(135deg, oklch(var(--prism-violet)), oklch(var(--prism-cyan)))",
  2: "linear-gradient(135deg, oklch(var(--prism-cyan)), oklch(var(--prism-gold)))",
  3: "linear-gradient(135deg, oklch(var(--prism-gold)), oklch(var(--prism-rose)))",
};

function gradientFor(variant: bigint): string {
  const n = Number(variant) % 4;
  return variantGradient[n] ?? variantGradient[0];
}

export function WorkerCard({
  worker,
  index = 0,
  servicesCount,
}: {
  worker: Worker;
  index?: number;
  servicesCount?: number;
}) {
  const grad = gradientFor(worker.silhouetteVariant);

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
      className="group relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-border bg-card p-6 text-center shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elevated"
      data-ocid={`worker.card.${index + 1}`}
    >
      {/* Prism silhouette */}
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-3 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
          style={{ background: grad }}
        />
        <div
          aria-hidden
          className="relative size-28 overflow-hidden rounded-full border border-white/20 shadow-glass"
          style={{ background: grad }}
        >
          {/* Stylized silhouette shape */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 size-full opacity-90"
            aria-hidden
            role="img"
          >
            <title>Silueta del profesional</title>
            <defs>
              <mask id={`sil-${worker.id}`}>
                <rect width="100" height="100" fill="black" />
                <circle cx="50" cy="38" r="16" fill="white" />
                <path d="M22 92 Q22 60 50 60 Q78 60 78 92 Z" fill="white" />
              </mask>
            </defs>
            <rect
              width="100"
              height="100"
              fill="oklch(0.16 0.02 350)"
              mask={`url(#sil-${worker.id})`}
            />
          </svg>
          {/* Prism shimmer overlay */}
          <span
            aria-hidden
            className="absolute inset-0 mix-blend-overlay opacity-40 animate-prism-shimmer"
            style={{
              backgroundImage: "var(--gradient-prism)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      </div>

      <h3 className="mt-5 font-display text-xl text-foreground">
        {worker.name}
      </h3>
      <span
        className={cn(
          "mt-1 inline-block font-mono text-[0.65rem] uppercase tracking-[0.25em] text-prism-violet",
        )}
      >
        {worker.role}
      </span>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {worker.bio}
      </p>

      {servicesCount !== undefined && (
        <span className="mt-4 font-mono text-xs text-muted-foreground">
          {servicesCount} servicio{servicesCount === 1 ? "" : "s"}
        </span>
      )}
    </motion.article>
  );
}
