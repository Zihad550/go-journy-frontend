import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Car, Users } from 'lucide-react';

interface CTAButtonProps {
  type: 'rider' | 'driver';
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
  className?: string;
  'aria-describedby'?: string;
}

function CTAButtonComponent({
  type,
  variant = 'primary',
  children,
  className,
  'aria-describedby': ariaDescribedBy,
}: CTAButtonProps) {
  const isRider = type === 'rider';
  const Icon = isRider ? Users : Car;

  if (variant === 'outline') {
    return (
      <Button
        variant="outline"
        size="lg"
        className={cn(
          'group w-full sm:w-auto px-8 py-6 text-lg font-semibold',
          'border-2 hover:border-primary',
          'hover:bg-primary hover:text-primary-foreground',
          'transition-all duration-300 ease-out min-h-[56px] rounded-xl',
          'hover:shadow-lg transform hover:-translate-y-1',
          isRider
            ? 'border-primary/30 hover:border-primary'
            : 'border-chart-1/30 hover:border-chart-1 hover:bg-chart-1',
          className
        )}
        aria-describedby={ariaDescribedBy}
      >
        <div className="flex items-center gap-2">
          {children}
        </div>
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className={cn(
        'group w-full sm:w-auto px-8 py-6 text-lg font-bold',
        'shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105',
        'transition-all duration-300 ease-out min-h-[56px] rounded-xl',
        'border-2 hover:border-primary/40',
        isRider
          ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary border-primary/20'
          : 'bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90 border-chart-1/20',
        className
      )}
      aria-describedby={ariaDescribedBy}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
        {children}
        <ArrowRight
          className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
          aria-hidden="true"
        />
      </div>
    </Button>
  );
}

export const CTAButton = memo(CTAButtonComponent);