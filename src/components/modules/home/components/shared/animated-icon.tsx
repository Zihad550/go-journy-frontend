import { cn } from "@/lib/utils";
import type { AnimatedIconProps } from "../../types";

export function AnimatedIcon({
  icon,
  size = "md",
  color = "text-primary",
  bgColor = "bg-gradient-to-br from-primary/20 to-primary/10",
  className = ""
}: AnimatedIconProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16 sm:w-20 sm:h-20",
    lg: "w-20 h-20 sm:w-24 sm:h-24"
  };

  const iconSizeClasses = {
    sm: "w-6 h-6 sm:w-8 sm:h-8",
    md: "w-8 h-8 sm:w-10 sm:h-10",
    lg: "w-10 h-10 sm:w-12 sm:h-12"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300",
        sizeClasses[size],
        bgColor,
        className
      )}
      aria-hidden="true"
    >
      <div className={cn(iconSizeClasses[size], color, "group-hover:animate-pulse")}>
        {icon}
      </div>
    </div>
  );
}