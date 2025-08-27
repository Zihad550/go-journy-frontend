import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const spinnerVariants = cva(
  "animate-spin rounded-full border-solid border-current border-r-transparent",
  {
    variants: {
      size: {
        xs: "h-3 w-3 border",
        sm: "h-4 w-4 border",
        default: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-2",
        xl: "h-12 w-12 border-[3px]",
        "2xl": "h-16 w-16 border-4",
      },
      variant: {
        default: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
        success: "text-green-500",
        warning: "text-yellow-500",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

const dotSpinnerVariants = cva(
  "flex space-x-1",
  {
    variants: {
      size: {
        xs: "gap-0.5",
        sm: "gap-1",
        default: "gap-1",
        lg: "gap-1.5",
        xl: "gap-2",
        "2xl": "gap-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const dotVariants = cva(
  "rounded-full bg-current animate-pulse",
  {
    variants: {
      size: {
        xs: "h-1 w-1",
        sm: "h-1.5 w-1.5",
        default: "h-2 w-2",
        lg: "h-3 w-3",
        xl: "h-4 w-4",
        "2xl": "h-6 w-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const pulseSpinnerVariants = cva(
  "rounded-full bg-current animate-pulse",
  {
    variants: {
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
        "2xl": "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  type?: "circular" | "dots" | "pulse"
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, variant, size, type = "circular", ...props }, ref) => {
    if (type === "dots") {
      return (
        <div
          ref={ref}
          className={cn(dotSpinnerVariants({ size }), className)}
          {...props}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                dotVariants({ size }),
                variant === "default" && "text-primary",
                variant === "secondary" && "text-secondary",
                variant === "muted" && "text-muted-foreground",
                variant === "destructive" && "text-destructive",
                variant === "success" && "text-green-500",
                variant === "warning" && "text-yellow-500",
                variant === "white" && "text-white"
              )}
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.6s",
              }}
            />
          ))}
        </div>
      )
    }

    if (type === "pulse") {
      return (
        <div
          ref={ref}
          className={cn(
            pulseSpinnerVariants({ size }),
            variant === "default" && "text-primary",
            variant === "secondary" && "text-secondary",
            variant === "muted" && "text-muted-foreground",
            variant === "destructive" && "text-destructive",
            variant === "success" && "text-green-500",
            variant === "warning" && "text-yellow-500",
            variant === "white" && "text-white",
            className
          )}
          style={{
            animationDuration: "1s",
            animationIterationCount: "infinite",
          }}
          {...props}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Spinner.displayName = "Spinner"

// Loading overlay component for full-screen loading states
export interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  spinnerProps?: SpinnerProps
  message?: string
  className?: string
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ isLoading, children, spinnerProps, message, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <Spinner {...spinnerProps} />
            {message && (
              <p className="mt-4 text-sm text-muted-foreground">{message}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)
LoadingOverlay.displayName = "LoadingOverlay"

// Button spinner for inline loading states
export interface ButtonSpinnerProps
  extends Omit<SpinnerProps, "size"> {
  size?: "xs" | "sm"
}

const ButtonSpinner = React.forwardRef<HTMLDivElement, ButtonSpinnerProps>(
  ({ className, ...props }, ref) => {
    return (
      <Spinner
        ref={ref}
        size="sm"
        className={cn("mr-2", className)}
        {...props}
      />
    )
  }
)
ButtonSpinner.displayName = "ButtonSpinner"

// Page spinner for full-page loading states
export interface PageSpinnerProps extends SpinnerProps {
  message?: string
  fullScreen?: boolean
}

const PageSpinner = React.forwardRef<HTMLDivElement, PageSpinnerProps>(
  ({ message, fullScreen = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center",
          fullScreen ? "fixed inset-0 z-50 bg-background" : "py-12",
          className
        )}
      >
        <Spinner size="xl" {...props} />
        {message && (
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    )
  }
)
PageSpinner.displayName = "PageSpinner"

export { ButtonSpinner, LoadingOverlay, PageSpinner, Spinner }

