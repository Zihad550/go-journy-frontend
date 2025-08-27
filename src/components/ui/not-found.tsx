import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, Info, XCircle } from "lucide-react";
import * as React from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";

const notFoundVariants = cva("text-center space-y-4", {
  variants: {
    variant: {
      error: "text-destructive",
      warning: "text-yellow-600",
      info: "text-blue-600",
    },
    size: {
      sm: "p-4",
      default: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "error",
    size: "default",
  },
});

const iconVariants = cva("mx-auto mb-4", {
  variants: {
    variant: {
      error: "text-destructive",
      warning: "text-yellow-600",
      info: "text-blue-600",
    },
    size: {
      sm: "h-12 w-12",
      default: "h-16 w-16",
      lg: "h-20 w-20",
    },
  },
  defaultVariants: {
    variant: "error",
    size: "default",
  },
});

export interface NotFoundProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notFoundVariants> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  retryLabel?: string;
  goBackLabel?: string;
  showRetry?: boolean;
  showGoBack?: boolean;
}

const getVariantConfig = (variant: "error" | "warning" | "info") => {
  const configs = {
    error: {
      icon: XCircle,
      title: "Something went wrong",
      message: "We encountered an error while processing your request.",
    },
    warning: {
      icon: AlertCircle,
      title: "Attention required",
      message: "Please check your input and try again.",
    },
    info: {
      icon: Info,
      title: "No data found",
      message: "The information you're looking for is not available.",
    },
  };

  return configs[variant] || configs.error;
};

const NotFound = React.forwardRef<HTMLDivElement, NotFoundProps>(
  (
    {
      className,
      variant = "error",
      size = "default",
      title,
      message,
      onRetry,
      onGoBack,
      retryLabel = "Retry",
      goBackLabel = "Go Back",
      showRetry = true,
      showGoBack = true,
      ...props
    },
    ref,
  ) => {
    const config = getVariantConfig(variant);
    const IconComponent = config.icon;

    const displayTitle = title || config.title;
    const displayMessage = message || config.message;

    return (
      <div ref={ref} className={className} {...props}>
        <Card>
          <CardContent className={cn(notFoundVariants({ variant, size }))}>
            <IconComponent className={cn(iconVariants({ variant, size }))} />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{displayTitle}</h3>
              {displayMessage && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {displayMessage}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {showRetry && onRetry && (
                <Button onClick={onRetry} variant="default">
                  {retryLabel}
                </Button>
              )}
              {showGoBack && onGoBack && (
                <Button onClick={onGoBack} variant="outline">
                  {goBackLabel}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);

NotFound.displayName = "NotFound";

export { NotFound };
