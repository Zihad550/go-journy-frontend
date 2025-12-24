import type { IReview } from "@/types";
import type { IReviewForComponent } from "@/types/review-type";

/**
 * Get initials from a name for avatar fallback
 */
export const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return 'U'; // Default fallback for unknown user
  }

  const nameParts = name
    .trim()
    .split(' ')
    .filter((part) => part.length > 0);

  if (nameParts.length === 0) {
    return 'U';
  }

  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return (
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
};

/**
 * Format relative time from ISO date string
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  } catch {
    return 'Recently';
  }
};

/**
 * Transform API review data to component-compatible format
 */
export const transformReviewForComponent = (
  review: IReview,
  role: 'rider' | 'driver' = 'rider'
): IReviewForComponent => {
  const isRiderReview = role === 'rider';

  // Safely extract names with fallbacks
  const riderName = review.rider?.name || 'Anonymous Rider';
  const driverName = review.driver?.user?.name || 'Anonymous Driver';

  return {
    ...review,
    id: review._id || `review-${Date.now()}`,
    name: isRiderReview ? riderName : driverName,
    role,
    review: review.comment || 'No review text available',
    metric: formatRelativeTime(review.createdAt),
    // Keep original API structure for potential future use
    rider: review.rider,
    driver: review.driver,
  };
};

/**
 * Transform array of API reviews to component format
 * Creates unified array with both rider and driver perspectives
 */
export const transformReviewsForComponent = (
  reviews: IReview[]
): IReviewForComponent[] => {
  const allReviews: IReviewForComponent[] = [];

  // Filter out invalid reviews and transform valid ones
  reviews
    .filter((review) => review && review._id && (review.comment || review.rating))
    .forEach((review) => {
      try {
        // Create rider perspective review
        allReviews.push(transformReviewForComponent(review, 'rider'));

        // Create driver perspective review
        allReviews.push(transformReviewForComponent(review, 'driver'));
      } catch (error) {
        console.warn('Failed to transform review:', review._id, error);
      }
    });

  return allReviews;
};

// Re-export the type for convenience
export type { IReviewForComponent };

/**
 * Get fallback testimonials data structure for error states
 */
export const getFallbackTestimonialsData = () => ({
  riders: [],
  drivers: [],
});