import React, { useMemo } from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  testimonialsData,
  type Testimonial,
} from "@/constants/testimonials-constant";
import { useGetFeaturedReviewsQuery } from "@/redux/features/review/review-api";
import { transformReviewsForComponent } from "@/utils/review-utils";
import type { IReviewForComponent } from "@/types/review-type";

interface TestimonialsProps {
  className?: string;
}

interface StarRatingProps {
  rating: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, className }) => {
  return (
    <div className={cn("flex items-center gap-0.5 sm:gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-3 w-3 sm:h-4 sm:w-4",
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted-foreground",
          )}
        />
      ))}
    </div>
  );
};

interface TestimonialCardProps {
  testimonial: Testimonial | IReviewForComponent;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <Quote className="h-6 w-6 text-primary/30 mb-4" aria-hidden="true" />

        <blockquote className="text-base leading-relaxed text-foreground/90 mb-4">
          "{testimonial.review}"
        </blockquote>

        <div className="mb-4">
          <StarRating rating={testimonial.rating} />
          <span className="sr-only">{testimonial.rating} out of 5 stars</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={`Profile picture of ${testimonial.name}`}
                className="h-10 w-10 rounded-full object-cover border-2 border-primary/20"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={cn(
                "h-10 w-10 rounded-full bg-gradient-to-br from-primary to-chart-1",
                "flex items-center justify-center text-primary-foreground font-semibold text-sm",
                testimonial.avatar ? "hidden" : "flex",
              )}
              aria-label={`Profile initials for ${testimonial.name}`}
            >
              {getInitials(testimonial.name)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground text-sm truncate">
                {testimonial.name}
              </h4>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs flex-shrink-0",
                  testimonial.role === "driver"
                    ? "bg-chart-1/20 text-chart-1 border-chart-1/30"
                    : "bg-chart-2/20 text-chart-2 border-chart-2/30",
                )}
              >
                {testimonial.role === "driver" ? "Driver" : "Rider"}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {testimonial.location && (
                <span className="truncate">{testimonial.location}</span>
              )}
              {testimonial.location && testimonial.metric && <span>•</span>}
              {testimonial.metric && (
                <span className="font-medium text-primary flex-shrink-0">
                  {testimonial.metric}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TestimonialsSection: React.FC<TestimonialsProps> = ({
  className,
}) => {
  // Fetch featured reviews from API
  const {
    data: reviewsResponse,
    isLoading,
    error,
    refetch,
  } = useGetFeaturedReviewsQuery();

  // Transform API data or use fallback
  const testimonials = useMemo(() => {
    if (reviewsResponse?.data && reviewsResponse.data.length > 0) {
      return transformReviewsForComponent(reviewsResponse.data);
    }
    // Fallback to static data if API fails or no data
    return testimonialsData;
  }, [reviewsResponse]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="h-full bg-card/50 backdrop-blur-sm border-border/50"
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-6 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Skeleton key={star} className="h-3 w-3 sm:h-4 sm:w-4 rounded" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="text-center py-8">
      <div className="text-muted-foreground mb-4">
        Unable to load testimonials at this time.
      </div>
      <Button
        variant="outline"
        onClick={() => refetch()}
        className="bg-background/80 backdrop-blur-sm"
      >
        Try Again
      </Button>
    </div>
  );

  return (
    <section
      className={cn("relative overflow-hidden", className)}
      aria-labelledby="testimonials-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />

      {/* Decorative Blur Elements */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-chart-1/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 bg-background/50 backdrop-blur-sm text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5"
          >
            Customer Stories
          </Badge>
          <h2
            id="testimonials-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            What Our Users Say
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real experiences from riders and drivers who trust Go Journy for
            their transportation needs
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : (
            testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
