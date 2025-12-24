import { Badge } from "@/components/ui/badge";
import type { UrgencyBadgeProps } from "../../types";

export function UrgencyBadge({ icon, text, variant = "primary", className = "" }: UrgencyBadgeProps) {
  const baseClasses = "px-2.5 sm:px-3 py-1 text-xs font-medium animate-pulse";
  const variantClasses = variant === "primary"
    ? "bg-primary text-primary-foreground"
    : "bg-chart-2 text-white";

  return (
    <Badge className={`${baseClasses} ${variantClasses} ${className}`}>
      <span className="flex items-center gap-1">
        {icon}
        {text}
      </span>
    </Badge>
  );
}