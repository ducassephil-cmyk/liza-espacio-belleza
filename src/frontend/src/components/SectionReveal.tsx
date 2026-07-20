import { motion } from "motion/react";
import type * as React from "react";

// Scroll-reveal wrapper using motion. Fades + slides up once in view.
// Direction can be varied per section to keep rhythm interesting.
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
  const MotionTag = motion[as] as typeof motion.div;
  const o = offset[direction];
  return (
    <MotionTag
      initial={{ opacity: 0, x: o.x, y: o.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

// Stagger helper — wrap a list of items and pass index to delay.
export function revealDelay(index: number, base = 0.1): number {
  return base + index * 0.1;
}
