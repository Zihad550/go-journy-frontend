import { Skeleton } from "@/components/ui/skeleton"

interface Statistic {
  value: string;
  label: string;
}

interface StatisticsDisplayProps {
  statistics: readonly Statistic[];
  className?: string;
  loading?: boolean;
}

export function StatisticsDisplay({ statistics, className, loading = false }: StatisticsDisplayProps) {
  return (
    <div className={`flex justify-center gap-6 sm:gap-8 mt-6 ${className || ''}`}>
      {loading ? (
        [...Array(3)].map((_, index) => (
          <div key={index} className="text-center">
            <Skeleton className="h-5 w-12 sm:h-6 sm:w-16 mb-1" />
            <Skeleton className="h-3 w-16 sm:h-3.5 sm:w-20" />
          </div>
        ))
      ) : (
        statistics.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))
      )}
    </div>
  );
}