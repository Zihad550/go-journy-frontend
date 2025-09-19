import { cn } from '@/lib/utils';
import { ProcessStepCard } from './ProcessStepCard';
import type { ProcessStep } from '@/constants/howItWorks.constant';

interface ProcessFlowProps {
  steps: ProcessStep[];
  className?: string;
  'aria-label'?: string;
}

export function ProcessFlow({
  steps,
  className,
  'aria-label': ariaLabel,
}: ProcessFlowProps) {
  return (
    <div
      className={cn('space-y-6 sm:space-y-8 md:space-y-16', className)}
      role="list"
      aria-label={ariaLabel}
    >
      {/* Mobile: Enhanced Vertical Stack */}
      <div className="md:hidden space-y-6 px-4">
        {steps.map((step, index) => (
          <div
            key={step.step}
            className="animate-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 150}ms` }}
            role="listitem"
          >
            <ProcessStepCard
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          </div>
        ))}
      </div>

      {/* Desktop: Horizontal Layout */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 xl:gap-12">
        {steps.map((step, index) => (
          <div
            key={step.step}
            className="animate-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 200}ms` }}
            role="listitem"
          >
            <ProcessStepCard
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}