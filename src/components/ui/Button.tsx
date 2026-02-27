
import React from "react";
import { cn } from "../../lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "shine" | "glass";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-[var(--color-primary)]/40 border-transparent",
    secondary:
      "bg-[var(--color-surface)] text-[var(--color-primary)] border-transparent shadow-md hover:shadow-lg",
    outline:
      "bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5",
    ghost: "bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)]",
    shine: "bg-[var(--color-primary)] text-white overflow-hidden relative after:content-[''] after:absolute after:top-0 after:left-[-100%] after:w-full after:h-full after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:transition-all after:duration-500 hover:after:left-[100%]",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl font-bold",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
