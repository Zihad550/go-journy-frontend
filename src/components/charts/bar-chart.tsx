import { useMemo } from "react";
import {
  getChartTextColor,
  getChartGridColor,
  resolveChartColor,
} from "@/utils/date-utils";

export interface IBarChartData {
  label: string;
  value: number;
  color?: string;
}

interface IBarChartProps {
  data: IBarChartData[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  className?: string;
}

const BarChart = ({
  data,
  width = 400,
  height = 300,
  showLabels = true,
  showValues = true,
  className = "",
}: IBarChartProps) => {
  const chart_data = useMemo(() => {
    if (data.length === 0) return [];

    // Fallback colors that match the CSS variables (converted from oklch to hex)
    const fallbackColors = [
      "#3b82f6", // blue-500 (chart-1 equivalent)
      "#10b981", // emerald-500 (chart-2 equivalent)
      "#8b5cf6", // violet-500 (chart-3 equivalent)
      "#f59e0b", // amber-500 (chart-4 equivalent)
      "#ef4444", // red-500 (chart-5 equivalent)
    ];

    const maxValue = Math.max(...data.map((item) => item.value));
    const padding = {
      top: 20,
      right: 30,
      bottom: showLabels ? 60 : 20,
      left: 40,
    };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const barWidth = (chartWidth / data.length) * 0.8;
    const barSpacing = (chartWidth / data.length) * 0.2;

    return data.map((item, index) => {
      const barHeight =
        maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
      const x = padding.left + index * (barWidth + barSpacing) + barSpacing / 2;
      const y = padding.top + chartHeight - barHeight;

      // Resolve CSS variables to actual colors for SVG compatibility
      const color = item.color
        ? resolveChartColor(item.color)
        : fallbackColors[index % fallbackColors.length];

      return {
        ...item,
        x,
        y,
        width: barWidth,
        height: barHeight,
        color,
      };
    });
  }, [data, width, height, showLabels]);

  if (data.length === 0 || data.every((item) => item.value === 0)) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-muted-foreground text-sm">
          {data.length === 0 ? "No data available" : "All values are zero"}
        </div>
      </div>
    );
  }

  const padding = {
    top: 20,
    right: 30,
    bottom: showLabels ? 60 : 20,
    left: 40,
  };
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className={`${className}`}>
      <svg width={width} height={height} className="drop-shadow-sm">
        {/* Background grid lines */}
        <defs>
          <pattern
            id="grid"
            width="1"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 1 0 L 0 0 0 20"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>

        {/* Y-axis labels and grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const value = Math.round(maxValue * ratio);
          const y = padding.top + chartHeight - ratio * chartHeight;

          return (
            <g key={ratio}>
              {/* Grid line */}
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke={getChartGridColor()}
                strokeWidth="0.5"
                opacity="0.3"
              />
              {/* Y-axis label */}
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill={getChartTextColor("muted")}
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {chart_data.map((item, index) => (
          <g key={`${item.label}-${index}`}>
            {/* Bar */}
            <rect
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              fill={item.color}
              className="transition-opacity hover:opacity-80"
              aria-label={`${item.label}: ${item.value}`}
            />

            {/* Value label on top of bar */}
            {showValues && item.height > 15 && (
              <text
                x={item.x + item.width / 2}
                y={item.y - 5}
                textAnchor="middle"
                fontSize="11"
                fill={getChartTextColor("foreground")}
                fontWeight="500"
              >
                {item.value}
              </text>
            )}

            {/* X-axis labels */}
            {showLabels && (
              <text
                x={item.x + item.width / 2}
                y={height - padding.bottom + 15}
                textAnchor="middle"
                fontSize="12"
                fill={getChartTextColor("muted")}
              >
                {item.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default BarChart;
