"use client";

/**
 * Reusable Framer Motion wrappers — inspired by the smooth animation
 * patterns from the Swadesh Patel portfolio (whileInView + stagger).
 *
 * Usage:
 *   <FadeUp>...</FadeUp>
 *   <StaggerContainer><FadeUp>A</FadeUp><FadeUp>B</FadeUp></StaggerContainer>
 *   <ScaleIn>modal content</ScaleIn>
 */

import { motion, type Variants } from "framer-motion";
import { memo } from "react";

// Shared easing (same spring curve used by the reference portfolio)
const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

// FadeUp
// Replaces every .animate-fade-up usage. Triggers once on viewport entry.
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE, delay },
  }),
};

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}

export const FadeUp = memo(function FadeUp({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: FadeUpProps) {
  // Use stable pre-defined motion components for common tags to prevent remounts/focus loss
  const MotionTag = Tag === "span" ? motion.span : Tag === "section" ? motion.section : Tag === "article" ? motion.article : motion.div;

  return (
    <MotionTag
      className={className}
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px" }}
      custom={delay}
    >
      {children}
    </MotionTag>
  );
});

// StaggerContainer
// Wraps a list of children and staggers their FadeUp animations.
const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.012,
      delayChildren: 0.01,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE },
  },
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  trigger?: "whileInView" | "animate";
}

export const StaggerContainer = memo(function StaggerContainer({
  children,
  className,
  trigger = "whileInView",
}: StaggerContainerProps) {
  const animationProps = trigger === "whileInView" 
    ? { whileInView: "visible", viewport: { once: true, margin: "-10px" } }
    : { animate: "visible" };

  return (
    <motion.div
      className={className}
      variants={staggerContainerVariants}
      initial="hidden"
      {...animationProps}
    >
      {children}
    </motion.div>
  );
});

// StaggerItem
// Must be a direct child of StaggerContainer for the stagger to work.
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggerItem = memo(function StaggerItem({
  children,
  className,
}: StaggerItemProps) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
});

// ScaleIn
// Spring-physics modal entrance — replaces CSS .animate-scale-in.
// Uses a real spring so it feels physical, not linear.
const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 30, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 4,
    transition: { duration: 0.12, ease: [0.4, 0, 1, 1] },
  },
};

interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
}

export const ScaleIn = memo(function ScaleIn({
  children,
  className,
}: ScaleInProps) {
  return (
    <motion.div
      className={className}
      variants={scaleInVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
});

// FadeIn (simple, no translate)
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FadeIn = memo(function FadeIn({
  children,
  delay = 0,
  className,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
});
