import { useMemo } from "react";
import { getChartTextColor, resolveChartColor } from "@/utils/date-utils";

export interface IPieChartData {
  label: string;
  value: number;
  color?: string;
}

interface IPieChartProps {
  data: IPieChartData[];
  size?: number;
  showLabels?: boolean;
  className?: string;
}

const PieChart = ({
  data,
  size = 200,
  showLabels = true,
  className = "",
}: IPieChartProps) => {
  const chart_data = useMemo(() => {
    // Fallback colors that match the CSS variables (converted from oklch to hex)
    const fallbackColors = [
      "#3b82f6", // blue-500 (chart-1 equivalent)
      "#10b981", // emerald-500 (chart-2 equivalent)
      "#8b5cf6", // violet-500 (chart-3 equivalent)
      "#f59e0b", // amber-500 (chart-4 equivalent)
      "#ef4444", // red-500 (chart-5 equivalent)
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) return [];

    let currentAngle = 0;

    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      // Calculate path for pie slice
      const radius = (size - 40) / 2;
      const centerX = size / 2;
      const centerY = size / 2;

      const startX =
        centerX + radius * Math.cos(((startAngle - 90) * Math.PI) / 180);
      const startY =
        centerY + radius * Math.sin(((startAngle - 90) * Math.PI) / 180);

      const endX =
        centerX + radius * Math.cos(((endAngle - 90) * Math.PI) / 180);
      const endY =
        centerY + radius * Math.sin(((endAngle - 90) * Math.PI) / 180);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`,
        "Z",
      ].join(" ");

      currentAngle += angle;

      // Resolve CSS variables to actual colors for SVG compatibility
      const color = item.color
        ? resolveChartColor(item.color)
        : fallbackColors[index % fallbackColors.length];

      return {
        ...item,
        percentage,
        pathData,
        color,
      };
    });
  }, [data, size]);

  // Debug logging
  console.log("PieChart data:", data);

  if (data.length === 0 || data.every((item) => item.value === 0)) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-muted-foreground text-sm">
          {data.length === 0 ? "No data available" : "All values are zero"}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="drop-shadow-sm">
        <g>
          {chart_data.map((item, index) => (
            <path
              key={`${item.label}-${index}`}
              d={item.pathData}
              fill={item.color}
              stroke="hsl(var(--background))"
              strokeWidth="2"
              className="transition-opacity hover:opacity-80"
              aria-label={`${item.label}: ${item.value} (${item.percentage.toFixed(1)}%)`}
            />
          ))}
        </g>
      </svg>

      {showLabels && (
        <div className="mt-4 space-y-2 w-full">
          {chart_data.map((item, index) => (
            <div
              key={`label-${item.label}-${index}`}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span style={{ color: getChartTextColor("muted") }}>
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.value}</span>
                <span
                  className="text-xs"
                  style={{ color: getChartTextColor("muted") }}
                >
                  ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieChart;
