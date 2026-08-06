import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

// Black glass CTA — used for primary actions like "Agenda tu Hora".
// Iridescent prism sheen on the top edge; subtle hover lift.
//
// Decorative sheen + hover glow are rendered as ::before / ::after
// pseudo-elements on the element itself (see index.css, [data-slot="black-glass-button"]).
// This keeps the component's children as the SINGLE child of <Slot> when asChild
// is true, so Radix Slot's React.Children.only invariant holds. The content
// layout (flex, gap, items-center) is applied directly to the Comp element via
// the base className, so no wrapper span is needed.
const blackGlassVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-glass text-glass shadow-glass transition-smooth font-body font-medium tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface BlackGlassButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof blackGlassVariants> {
  asChild?: boolean;
}

function BlackGlassButton({
  className,
  size,
  asChild = false,
  children,
  ...props
}: BlackGlassButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="black-glass-button"
      className={cn(blackGlassVariants({ size }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { BlackGlassButton, blackGlassVariants };
