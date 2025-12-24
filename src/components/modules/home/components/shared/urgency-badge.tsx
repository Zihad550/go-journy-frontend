import { Badge } from "@/components/ui/badge";
import type { UrgencyBadgeProps } from "../../types";

export function UrgencyBadge({ icon, text, variant = "primary", className = "" }: UrgencyBadgeProps) {
  const base_classes = "px-2.5 sm:px-3 py-1 text-xs font-medium animate-pulse";
  const variant_classes = variant === "primary"
    ? "bg-primary text-primary-foreground"
    : "bg-chart-2 text-white";

  return (
    <Badge className={`${base_classes} ${variant_classes} ${className}`}>
      <span className="flex items-center gap-1">
        {icon}
        {text}
      </span>
    </Badge>
  );
}