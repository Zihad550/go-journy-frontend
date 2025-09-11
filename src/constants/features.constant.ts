import type { LucideIcon } from 'lucide-react';
import {
  MapPin,
  Clock,
  Shield,
  CreditCard,
  Star,
  Users,
  Car,
  DollarSign,
  Smartphone,
  Navigation,
  Bell,
  Lock,
  Headphones,
  TrendingUp,
  Zap,
  Award,
} from 'lucide-react';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'rider' | 'driver' | 'safety' | 'technology';
  highlighted?: boolean;
}


export const FEATURES_DATA: Feature[] = [
  // Rider Features
  {
    id: 'rider-1',
    title: 'Easy Booking',
    description:
      'Book rides in seconds with our intuitive interface. Just enter your destination and go.',
    icon: Smartphone,
    category: 'rider',
    highlighted: true,
  },
  {
    id: 'rider-2',
    title: 'Real-time Tracking',
    description:
      "Track your driver's location in real-time and get accurate arrival estimates.",
    icon: MapPin,
    category: 'rider',
    highlighted: true,
  },
  {
    id: 'rider-3',
    title: 'Multiple Payment Options',
    description:
      'Pay with credit cards, digital wallets, or cash - whatever works best for you.',
    icon: CreditCard,
    category: 'rider',
  },
  {
    id: 'rider-4',
    title: 'Ride History',
    description:
      'Access your complete ride history with receipts and trip details anytime.',
    icon: Clock,
    category: 'rider',
  },
  {
    id: 'rider-5',
    title: 'Driver Ratings',
    description:
      'Rate your drivers and read reviews to ensure quality service every time.',
    icon: Star,
    category: 'rider',
  },
  {
    id: 'rider-6',
    title: 'Fare Estimates',
    description:
      'Get upfront pricing with no surprises. Know your fare before you book.',
    icon: DollarSign,
    category: 'rider',
  },

  // Driver Features
  {
    id: 'driver-1',
    title: 'Flexible Earnings',
    description:
      'Drive when you want and earn competitive rates with transparent pricing.',
    icon: DollarSign,
    category: 'driver',
    highlighted: true,
  },
  {
    id: 'driver-2',
    title: 'Smart Navigation',
    description:
      'Get turn-by-turn directions and optimal routes to maximize your efficiency.',
    icon: Navigation,
    category: 'driver',
    highlighted: true,
  },
  {
    id: 'driver-3',
    title: 'Instant Notifications',
    description:
      'Receive ride requests instantly and accept the ones that work for you.',
    icon: Bell,
    category: 'driver',
  },
  {
    id: 'driver-4',
    title: 'Earnings Dashboard',
    description:
      'Track your daily, weekly, and monthly earnings with detailed analytics.',
    icon: TrendingUp,
    category: 'driver',
  },
  {
    id: 'driver-5',
    title: 'Driver Support',
    description:
      '24/7 dedicated driver support to help you with any issues or questions.',
    icon: Headphones,
    category: 'driver',
  },
  {
    id: 'driver-6',
    title: 'Quick Onboarding',
    description:
      'Get approved and start driving in as little as 24 hours with our streamlined process.',
    icon: Zap,
    category: 'driver',
  },

  // Safety Features
  {
    id: 'safety-1',
    title: 'Driver Verification',
    description:
      'All drivers undergo thorough background checks and vehicle inspections.',
    icon: Shield,
    category: 'safety',
    highlighted: true,
  },
  {
    id: 'safety-2',
    title: 'Emergency Support',
    description:
      '24/7 emergency support with one-tap access to help when you need it most.',
    icon: Headphones,
    category: 'safety',
    highlighted: true,
  },
  {
    id: 'safety-3',
    title: 'Secure Payments',
    description:
      'All transactions are encrypted and secure with industry-standard protection.',
    icon: Lock,
    category: 'safety',
  },
  {
    id: 'safety-4',
    title: 'Trip Sharing',
    description:
      'Share your trip details with friends and family for added peace of mind.',
    icon: Users,
    category: 'safety',
  },
  {
    id: 'safety-5',
    title: 'Insurance Coverage',
    description:
      'Comprehensive insurance coverage for all rides from pickup to drop-off.',
    icon: Shield,
    category: 'safety',
  },
  {
    id: 'safety-6',
    title: 'Identity Verification',
    description:
      'Both riders and drivers are verified to ensure a safe community.',
    icon: Award,
    category: 'safety',
  },

  // Technology Features
  {
    id: 'tech-1',
    title: 'Smart Matching',
    description:
      'Advanced algorithms match you with the best available drivers instantly.',
    icon: Zap,
    category: 'technology',
    highlighted: true,
  },
  {
    id: 'tech-2',
    title: 'Route Optimization',
    description:
      'AI-powered route optimization ensures the fastest and most efficient trips.',
    icon: Navigation,
    category: 'technology',
  },
  {
    id: 'tech-3',
    title: 'Real-time Updates',
    description:
      'Get live updates on traffic, weather, and estimated arrival times.',
    icon: Bell,
    category: 'technology',
  },
  {
    id: 'tech-4',
    title: 'Cross-platform App',
    description:
      'Available on iOS, Android, and web with seamless synchronization.',
    icon: Smartphone,
    category: 'technology',
  },
  {
    id: 'tech-5',
    title: 'Data Analytics',
    description:
      'Advanced analytics help optimize pricing and improve service quality.',
    icon: TrendingUp,
    category: 'technology',
  },
  {
    id: 'tech-6',
    title: 'Scalable Infrastructure',
    description:
      'Built on cloud infrastructure that scales to handle millions of rides.',
    icon: Car,
    category: 'technology',
  },
];

export const FEATURE_SECTIONS = [
  {
    title: 'For Riders',
    description: 'Everything you need for a seamless ride experience',
    category: 'rider',
    features: FEATURES_DATA.filter((feature) => feature.category === 'rider'),
  },
  {
    title: 'For Drivers',
    description: 'Tools and features to maximize your earning potential',
    category: 'driver',
    features: FEATURES_DATA.filter((feature) => feature.category === 'driver'),
  },
  {
    title: 'Safety First',
    description: 'Comprehensive safety features for peace of mind',
    category: 'safety',
    features: FEATURES_DATA.filter((feature) => feature.category === 'safety'),
  },
  {
    title: 'Advanced Technology',
    description: 'Cutting-edge technology powering your journey',
    category: 'technology',
    features: FEATURES_DATA.filter(
      (feature) => feature.category === 'technology'
    ),
  },
];

// Selector helpers for the Features page

// Convert the standard features into the format needed by the Features page
export const getFeaturesByCategory = (): Record<string, (Feature & { benefit?: string })[]> => {
  const categories = {
    riders: FEATURES_DATA.filter(feature => feature.category === 'rider').map(feature => ({
      ...feature,
      benefit: getFeatureBenefit(feature.id),
    })),
    drivers: FEATURES_DATA.filter(feature => feature.category === 'driver').map(feature => ({
      ...feature,
      benefit: getFeatureBenefit(feature.id),
    })),
    platform: FEATURES_DATA.filter(feature => feature.category === 'technology').map(feature => ({
      ...feature,
      benefit: getFeatureBenefit(feature.id),
    })),
    safety: FEATURES_DATA.filter(feature => feature.category === 'safety').map(feature => ({
      ...feature,
      benefit: getFeatureBenefit(feature.id),
    })),
  };
  
  return categories;
};

// Get only driver-specific features for DriverBenefitsSection
export const getDriverFeatures = (): Feature[] => {
  return FEATURES_DATA.filter(feature => feature.category === 'driver');
};

// Helper to map feature IDs to short benefit descriptions
const getFeatureBenefit = (id: string): string => {
  const benefitMap: Record<string, string> = {
    // Rider benefits
    'rider-1': 'Mobile booking',
    'rider-2': 'Live tracking',
    'rider-3': 'Payment options',
    'rider-4': 'Complete history',
    'rider-5': 'Driver ratings',
    'rider-6': 'Fare estimates',
    
    // Driver benefits
    'driver-1': 'Flexible earnings',
    'driver-2': 'Smart navigation',
    'driver-3': 'Instant alerts',
    'driver-4': 'Earnings insights',
    'driver-5': '24/7 support',
    'driver-6': 'Quick onboarding',
    
    // Safety benefits
    'safety-1': 'Verified drivers',
    'safety-2': 'Emergency help',
    'safety-3': 'Secure payments',
    'safety-4': 'Trip sharing',
    'safety-5': 'Full coverage',
    'safety-6': 'ID verification',
    
    // Technology benefits
    'tech-1': 'Instant matching',
    'tech-2': 'Optimal routes',
    'tech-3': 'Live updates',
    'tech-4': 'Cross-platform',
    'tech-5': 'Smart insights',
    'tech-6': 'Cloud-powered',
  };
  
  return benefitMap[id] || 'Feature';
};
