// Animation durations and thresholds
export const ANIMATION_CONFIG = {
  header: {
    duration: 800,
    threshold: 0.1,
  },
  tabs: {
    duration: 600,
    threshold: 0.2,
  },
  stepCard: {
    duration: 600,
    threshold: 0.2,
    staggerDelay: 200,
  },
  hover: {
    scale: 1.02,
    duration: 200,
  },
} as const;

// Screen reader announcement delay
export const ACCESSIBILITY_CONFIG = {
  announcementDelay: 1000,
} as const;

// Tab statistics data
export const TAB_STATISTICS = {
  rider: [
    { value: '2M+', label: 'Happy Riders' },
    { value: '4.8★', label: 'Average Rating' },
    { value: '<5min', label: 'Average Wait' },
  ],
  driver: [
    { value: '$25+', label: 'Per Hour' },
    { value: '50K+', label: 'Active Drivers' },
    { value: '24/7', label: 'Support' },
  ],
} as const;

// Tab content data
export const TAB_CONTENT = {
  rider: {
    title: 'Book Your Perfect Ride',
    description: 'Get from point A to point B safely and comfortably with our verified, professional drivers who prioritize your comfort and safety.',
  },
  driver: {
    title: 'Start Earning Today',
    description: 'Join thousands of drivers earning flexible income on their own schedule. Drive when you want, where you want, and keep more of what you earn.',
  },
} as const;

// Trust indicators
export const TRUST_INDICATORS = [
  { text: 'Available 24/7', color: 'green' },
  { text: 'Instant Support', color: 'blue' },
  { text: 'No Hidden Fees', color: 'purple' },
] as const;