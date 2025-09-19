import type { BenefitGridProps } from "../../types";

export function BenefitGrid({ items, className = "", itemClassName = "" }: BenefitGridProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-2 sm:gap-3 ${className}`}
      role="list"
      aria-label="Benefits"
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-center gap-1.5 sm:gap-2 bg-muted/30 rounded-lg p-2 ${itemClassName}`}
          role="listitem"
        >
          <div className="flex-shrink-0" aria-hidden="true">
            {item.icon}
          </div>
          <span className="truncate">{item.text}</span>
        </div>
      ))}
    </div>
  );
}