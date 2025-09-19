interface Statistic {
  value: string;
  label: string;
}

interface StatisticsDisplayProps {
  statistics: readonly Statistic[];
  className?: string;
}

export function StatisticsDisplay({ statistics, className }: StatisticsDisplayProps) {
  return (
    <div className={`flex justify-center gap-6 sm:gap-8 mt-6 ${className || ''}`}>
      {statistics.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-primary">{stat.value}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}