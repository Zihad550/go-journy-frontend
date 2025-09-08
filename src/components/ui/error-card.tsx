import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface ErrorCardProps {
  message?: string;
  className?: string;
  showIcon?: boolean;
}

export function ErrorCard({
  message = 'Something went wrong. Please try again.',
  className,
  showIcon = true,
}: ErrorCardProps) {
  return (
    <div
      className={cn(
        'bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl',
        className
      )}
    >
      <div className="flex items-center justify-center py-8">
        {showIcon && <AlertCircle className="h-5 w-5 text-destructive mr-3" />}
        <span className="text-destructive text-center">{message}</span>
      </div>
    </div>
  );
}
