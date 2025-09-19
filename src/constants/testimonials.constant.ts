// Testimonials data structure and validation utilities

export interface Testimonial {
  id: string;
  name: string;
  role: 'rider' | 'driver';
  avatar?: string;
  rating: number;
  review: string;
  location?: string;
  metric?: string; // e.g., "Saved 30 minutes daily"
}

export interface TestimonialValidationResult {
  isValid: boolean;
  errors: string[];
}

// Avatar placeholder system with fallback initials
export const getAvatarFallback = (name: string): string => {
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

// Data validation for testimonial objects
export const validateTestimonial = (
  testimonial: unknown
): TestimonialValidationResult => {
  const errors: string[] = [];

  // Type guard to ensure testimonial is an object
  if (!testimonial || typeof testimonial !== 'object') {
    errors.push('Testimonial must be an object');
    return { isValid: false, errors };
  }

  const t = testimonial as Record<string, unknown>;

  // Required fields validation
  if (!t.id || typeof t.id !== 'string') {
    errors.push('Testimonial ID is required and must be a string');
  }

  if (!t.name || typeof t.name !== 'string' || t.name.trim().length === 0) {
    errors.push('Testimonial name is required and must be a non-empty string');
  }

  if (!t.role || !['rider', 'driver'].includes(t.role as string)) {
    errors.push('Testimonial role must be either "rider" or "driver"');
  }

  if (typeof t.rating !== 'number' || t.rating < 1 || t.rating > 5) {
    errors.push('Testimonial rating must be a number between 1 and 5');
  }

  if (
    !t.review ||
    typeof t.review !== 'string' ||
    t.review.trim().length === 0
  ) {
    errors.push(
      'Testimonial review is required and must be a non-empty string'
    );
  }

  // Optional fields validation
  if (t.avatar && typeof t.avatar !== 'string') {
    errors.push('Testimonial avatar must be a string if provided');
  }

  if (t.location && typeof t.location !== 'string') {
    errors.push('Testimonial location must be a string if provided');
  }

  if (t.metric && typeof t.metric !== 'string') {
    errors.push('Testimonial metric must be a string if provided');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate testimonial data structure
export const validateTestimonialData = (
  data: unknown
): TestimonialValidationResult => {
  const errors: string[] = [];

  if (!Array.isArray(data)) {
    errors.push('Testimonial data must be an array');
    return { isValid: false, errors };
  }

  data.forEach((testimonial: unknown, index: number) => {
    const validation = validateTestimonial(testimonial);
    if (!validation.isValid) {
      errors.push(
        `Testimonial ${index + 1}: ${validation.errors.join(', ')}`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Error handling wrapper for safe testimonial data access
export const safeGetTestimonials = (data: Testimonial[]): Testimonial[] => {
  try {
    const validation = validateTestimonialData(data);
    if (!validation.isValid) {
      console.warn('Testimonial data validation failed:', validation.errors);
      // Return empty array as fallback
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error accessing testimonial data:', error);
    return [];
  }
};

export interface TestimonialData {
  riders: Testimonial[];
  drivers: Testimonial[];
}

// Combined testimonials for unified display
export const testimonialsData: Testimonial[] = [
  // Rider testimonials
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'rider',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review:
      'Go Journy has completely transformed my daily commute. The drivers are professional, the app is intuitive, and I always feel safe. The real-time tracking gives me peace of mind, and the pricing is transparent with no hidden fees.',
    location: 'New York, NY',
    metric: 'Saved 45 minutes daily',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'rider',
    rating: 5,
    review:
      'As a business traveler, reliability is everything. Go Journy never lets me down - quick bookings, professional drivers, and seamless payment. The ride history feature makes expense reporting a breeze.',
    location: 'Los Angeles, CA',
    metric: 'Used 200+ rides',
  },
  {
    id: '3',
    name: 'Emily Chen',
    role: 'rider',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 4,
    review:
      'Love the convenience and safety features. The emergency button gives me confidence riding alone at night, and the driver verification process is thorough. Great value for money!',
    location: 'Chicago, IL',
    metric: '4.9★ average experience',
  },
  {
    id: '4',
    name: 'David Thompson',
    role: 'rider',
    rating: 5,
    review:
      "The best ride-sharing experience I've had. Clean cars, friendly drivers, and the app works flawlessly. The loyalty program rewards are a nice bonus too.",
    location: 'Miami, FL',
    metric: 'Member since 2022',
  },
  {
    id: '5',
    name: 'Jennifer Martinez',
    role: 'rider',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review:
      'Perfect for my daily work commute! The app is so easy to use, and I love being able to schedule rides in advance. The drivers are always punctual and professional.',
    location: 'Denver, CO',
    metric: '150+ rides completed',
  },
  {
    id: '6',
    name: 'Robert Kim',
    role: 'rider',
    rating: 4,
    review:
      'Great service overall. The pricing is fair, and I appreciate the detailed ride receipts. The customer support team resolved my issue quickly when I had a question.',
    location: 'Portland, OR',
    metric: '2 years as member',
  },
  // Driver testimonials
  {
    id: '7',
    name: 'Marcus Williams',
    role: 'driver',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review:
      'Go Journy has been a game-changer for my income. The flexible scheduling lets me work around my family time, and the earnings are consistently good. The support team is always helpful when I need assistance.',
    location: 'San Francisco, CA',
    metric: 'Earning $2,400/week',
  },
  {
    id: '8',
    name: 'Lisa Park',
    role: 'driver',
    rating: 5,
    review:
      "I've been driving for Go Journy for over a year now, and it's been incredible. The platform treats drivers fairly, payments are always on time, and the rider quality is excellent. Highly recommend!",
    location: 'Seattle, WA',
    metric: '1,500+ completed rides',
  },
  {
    id: '9',
    name: 'James Anderson',
    role: 'driver',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 4,
    review:
      'Great platform for part-time driving. The surge pricing during peak hours really boosts my earnings, and the driver app is user-friendly. The community of drivers is supportive too.',
    location: 'Austin, TX',
    metric: '$1,800/week part-time',
  },
  {
    id: '10',
    name: 'Maria Gonzalez',
    role: 'driver',
    rating: 5,
    review:
      'As a single mom, Go Journy has given me the flexibility to earn good money while being available for my kids. The safety features and insurance coverage give me peace of mind.',
    location: 'Phoenix, AZ',
    metric: '4.95★ driver rating',
  },
  {
    id: '11',
    name: 'Ahmed Hassan',
    role: 'driver',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review:
      "The best driving platform I've used! The instant payment feature is amazing, and the rider feedback system helps me improve my service. I've made great connections with regular passengers.",
    location: 'Houston, TX',
    metric: '$3,200/month earnings',
  },
  {
    id: '12',
    name: 'Catherine Lee',
    role: 'driver',
    rating: 4,
    review:
      'Driving with Go Journy has been a positive experience. The app is reliable, the support team is responsive, and I appreciate the transparent fee structure. Great way to earn extra income!',
    location: 'Boston, MA',
    metric: '800+ rides completed',
  },
];

// Validate the testimonial data on module load
const validation = validateTestimonialData(testimonialsData);
if (!validation.isValid) {
  console.error('Testimonial data validation failed:', validation.errors);
}

// Export safe testimonial data with error handling
export const safeTestimonialsData = safeGetTestimonials(testimonialsData);
