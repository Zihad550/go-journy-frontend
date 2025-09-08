import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

interface CardLoaderProps {
  message?: string;
  className?: string;
  spinnerSize?: 'sm' | 'default' | 'lg';
}

export function CardLoader({
  message = 'Loading...',
  className,
  spinnerSize = 'lg',
}: CardLoaderProps) {
  return (
    <div
      className={cn(
        'bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl',
        className
      )}
    >
      <div className="flex items-center justify-center py-8">
        <Spinner size={spinnerSize} />
        <span className="ml-3 text-muted-foreground">{message}</span>
      </div>
    </div>
  );
}
