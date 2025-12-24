import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  serviceHighlights,
  type ServiceHighlight,
} from "@/constants/serviceHighlights.constant";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { animationClasses } from "@/lib/animations";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface ServiceHighlightsProps {
  className?: string;
}

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2000,
}) => {
  const [displayValue, setDisplayValue] = useState("0");
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    // Extract numeric value from string
    const numericMatch = value.match(/\d+/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseInt(numericMatch[0]);
    const prefix = value.substring(0, value.indexOf(numericMatch[0]));
    const suffix = value.substring(
      value.indexOf(numericMatch[0]) + numericMatch[0].length,
    );

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentNumber = Math.floor(targetNumber * easeOutQuart);

      setDisplayValue(`${prefix}${currentNumber}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return <span ref={elementRef}>{displayValue}</span>;
};

interface HighlightCardProps {
  highlight: ServiceHighlight;
  index: number;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ highlight, index }) => {
  const { icon: Icon, title, description, metric, color } = highlight;

  // Animation hook for each card
  const cardAnimation = useScrollAnimation<HTMLDivElement>({
    animationType: "slideUp",
    duration: 600,
    threshold: 0.2,
    staggerDelay: index * 150,
  });

  return (
    <Card
      ref={cardAnimation.ref}
      className={cn(
        "group relative overflow-hidden transition-all duration-300 ease-out",
        "hover:scale-105 hover:shadow-2xl hover:-translate-y-2",
        "bg-card/50 backdrop-blur-sm border-border/50",
        "transform-gpu",
        animationClasses.hoverLift,
        cardAnimation.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8",
      )}
    >
      {/* Background gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
          `bg-gradient-to-br from-${color} to-${color}/50`,
        )}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] opacity-50" />

      <CardHeader className="relative pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300",
              `bg-${color}/10 group-hover:bg-${color}/20`,
              "group-hover:scale-110 transform-gpu",
            )}
            aria-hidden="true"
          >
            <Icon
              className={cn(
                "h-6 w-6 sm:h-8 sm:w-8 transition-colors duration-300",
                `text-${color} group-hover:text-${color}`,
              )}
            />
          </div>
          <div
            className={cn(
              "text-right",
              "group-hover:scale-110 transition-transform duration-300 transform-gpu",
            )}
          >
            <div
              className={cn(
                "text-xl sm:text-2xl md:text-3xl font-bold transition-colors duration-300",
                `text-${color}`,
              )}
            >
              <AnimatedCounter value={metric} />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative p-4 sm:p-6 pt-0">
        <CardTitle className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </CardTitle>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export const ServiceHighlightsSection: React.FC<ServiceHighlightsProps> = ({
  className,
}) => {
  // Animation refs are handled by useScrollAnimation

  // Animation hooks for section elements
  const headerAnimation = useScrollAnimation<HTMLDivElement>({
    animationType: "fade",
    duration: 800,
    threshold: 0.1,
  });

  const ctaAnimation = useScrollAnimation<HTMLDivElement>({
    animationType: "slideUp",
    duration: 600,
    threshold: 0.3,
  });

  return (
    <section
      className={cn("relative overflow-hidden", className)}
      aria-labelledby="service-highlights-heading"
      role="region"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-chart-1/5 rounded-full blur-3xl" />

      <div className="container relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header - Enhanced Mobile */}
        <div
          ref={headerAnimation.ref}
          className={cn(
            "text-center mb-8 sm:mb-12 md:mb-16 px-4 sm:px-0 transition-all duration-800",
            headerAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6",
          )}
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm font-medium text-primary">
              Platform Benefits
            </span>
          </div>
          <h2
            id="service-highlights-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
          >
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              Go Journy
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the future of transportation with our cutting-edge
            platform designed for speed, safety, and convenience.
          </p>
        </div>

        {/* Service highlights grid - Enhanced Mobile */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 px-4 sm:px-0"
          role="list"
          aria-label="Platform benefits and service highlights"
        >
          {serviceHighlights.map((highlight, index) => (
            <div key={highlight.title} role="listitem">
              <HighlightCard highlight={highlight} index={index} />
            </div>
          ))}
        </div>

        {/* Bottom CTA section - Enhanced Mobile */}
        <div
          ref={ctaAnimation.ref}
          className={cn(
            "text-center mt-8 sm:mt-12 md:mt-16 px-4 sm:px-0 transition-all duration-600",
            ctaAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4",
          )}
        >
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            Join thousands of satisfied users who trust Go Journy for their
            daily transportation needs
          </p>
          <div
            className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-muted-foreground"
            role="list"
            aria-label="Platform statistics"
          >
            <div className="flex items-center gap-1.5 sm:gap-2" role="listitem">
              <div
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-chart-1 rounded-full"
                aria-hidden="true"
              />
              <span>10K+ Happy Riders</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2" role="listitem">
              <div
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-chart-2 rounded-full"
                aria-hidden="true"
              />
              <span>2K+ Active Drivers</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2" role="listitem">
              <div
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-chart-3 rounded-full"
                aria-hidden="true"
              />
              <span>50+ Cities</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2" role="listitem">
              <div
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-chart-4 rounded-full"
                aria-hidden="true"
              />
              <span>4.9★ Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
