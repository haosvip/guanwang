import React from "react";
import { cn } from "../../lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <section
      className={cn("py-16 md:py-24 relative overflow-hidden", className)}
      {...props}
    >
      {children}
    </section>
  );
};