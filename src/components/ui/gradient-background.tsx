import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GradientBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function GradientBackground({
  children,
  className,
}: GradientBackgroundProps) {
  const baseClasses = "relative overflow-hidden";

  return (
    <section
      className={cn(
        baseClasses,
        "bg-gradient-to-br from-primary/5 via-background to-primary/10",
        className,
      )}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <>
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl" />
      </>

      {children}
    </section>
  );
}
