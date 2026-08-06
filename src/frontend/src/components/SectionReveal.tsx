import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type * as React from "react";

type Direction = "up" | "left" | "right" | "fade";

const offset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  left: { x: -24, y: 0 },
  right: { x: 24, y: 0 },
  fade: { x: 0, y: 0 },
};

export function SectionReveal({
  children,
  direction = "up",
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const MotionTag = motion[as] as typeof motion.div;
  const o = offset[direction];

  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, x: o.x, y: o.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

export function revealDelay(index: number, base = 0.1): number {
  return base + index * 0.1;
}
