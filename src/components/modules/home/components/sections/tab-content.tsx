import { memo } from 'react';
import { Users, Car } from 'lucide-react';
import { ProcessFlow } from './process-flow';
import { StatisticsDisplay } from './statistics-display';
import { TAB_STATISTICS, TAB_CONTENT } from '../../constants/how-it-works-section-constants';
import { usePublicStats } from '@/hooks/use-public-stats';
import type { ProcessStep } from '@/constants/how-it-works.constant';

interface TabContentProps {
  type: 'rider' | 'driver';
  steps: ProcessStep[];
}

function TabContentComponent({ type, steps }: TabContentProps) {
  const is_rider = type === 'rider';
  const content = TAB_CONTENT[type];
  const { stats, loading } = usePublicStats();
  const statistics = stats?.[type] || TAB_STATISTICS[type];
  const Icon = is_rider ? Users : Car;
  const gradient_class = is_rider
    ? 'from-primary via-chart-1 to-primary'
    : 'from-chart-1 via-chart-2 to-chart-1';
  const bg_class = is_rider
    ? 'from-primary/10 to-chart-1/10'
    : 'from-chart-1/10 to-chart-2/10';
  const text_class = is_rider ? 'text-primary' : 'text-chart-1';
  const border_class = is_rider ? 'border-primary/20' : 'border-chart-1/20';

  return (
    <div className="mt-0 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 fill-mode-both">
      {/* Header with Enhanced Design */}
      <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
        <div className="relative inline-block mb-4">
          {/* Decorative Background */}
          <div className={`absolute -inset-3 bg-gradient-to-r ${bg_class} rounded-2xl blur-lg`} />
          <div className={`relative bg-${type}/5 backdrop-blur-sm border ${border_class} rounded-xl px-4 py-2`}>
            <div className="flex items-center gap-2">
              <Icon className={`w-5 h-5 ${text_class}`} aria-hidden="true" />
              <span className={`text-sm font-medium ${text_class}`}>For {type === 'rider' ? 'Riders' : 'Drivers'}</span>
            </div>
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
          <span className={`bg-gradient-to-r ${gradient_class} bg-clip-text text-transparent`}>
            {content.title}
          </span>
        </h3>

        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {content.description}
        </p>

        {/* Statistics Row */}
        <StatisticsDisplay statistics={statistics} loading={loading} />
      </div>

      <ProcessFlow
        steps={steps}
        aria-label={`Steps for ${type}s to ${type === 'rider' ? 'book a ride' : 'start earning'}`}
      />
    </div>
  );
}

export const TabContent = memo(TabContentComponent);