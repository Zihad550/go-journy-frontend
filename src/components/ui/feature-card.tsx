import type { LucideIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  highlighted?: boolean;
  category?: string;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  highlighted = false,
  category,
  className,
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-lg hover:scale-105 h-full',
        highlighted &&
          'ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5',
        className
      )}
    >
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div
              className={cn(
                'p-1.5 sm:p-2 rounded-lg flex-shrink-0',
                highlighted
                  ? 'bg-primary/10 text-primary'
                  : 'bg-chart-1/10 text-chart-1'
              )}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <CardTitle className="text-base sm:text-lg leading-tight">
              {title}
            </CardTitle>
          </div>
          {category && (
            <Badge variant="secondary" className="text-xs w-fit">
              {category}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
