import React from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'compact' | 'normal' | 'generous';
  zIndex?: number;
  ref?: React.RefObject<HTMLDivElement>;
}

const spacingClasses = {
  compact: 'py-8 sm:py-12 md:py-16 lg:py-20',
  normal: 'py-10 sm:py-14 md:py-18 lg:py-22',
  generous: 'py-12 sm:py-16 md:py-20 lg:py-24'
} as const;

export const SectionWrapper = React.forwardRef<HTMLDivElement, SectionWrapperProps>(
  ({ children, className = '', spacing = 'normal', zIndex = 0, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          `z-${zIndex}`,
          spacingClasses[spacing],
          'section-transition',
          className
        )}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    );
  }
);

SectionWrapper.displayName = 'SectionWrapper';