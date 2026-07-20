import { cn } from "@/lib/utils";

// Iridescent separator — thin prism line used between sections.
// Subtle shimmer animation; respects reduced-motion via CSS.
export function PrismDivider({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div aria-hidden className={cn("flex items-center gap-4", className)}>
      <span
        aria-hidden
        className="h-px flex-1 bg-[length:200%_100%] animate-prism-shimmer"
        style={{ backgroundImage: "var(--gradient-prism)" }}
      />
      {label ? (
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </span>
      ) : (
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-prism-violet animate-prism-pulse"
        />
      )}
      <span
        aria-hidden
        className="h-px flex-1 bg-[length:200%_100%] animate-prism-shimmer"
        style={{ backgroundImage: "var(--gradient-prism)" }}
      />
    </div>
  );
}
