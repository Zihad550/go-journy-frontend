import type { LucideIcon } from 'lucide-react';
import {
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Star,
  MapPin,
  DollarSign,
} from 'lucide-react';

export interface ServiceHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
  metric: string;
  color: string;
}

export const serviceHighlights: ServiceHighlight[] = [
  {
    icon: Zap,
    title: 'Lightning Fast Booking',
    description:
      'Smart location detection and AI-powered driver matching gets you a ride in under 15 seconds. No more waiting around.',
    metric: '< 15s',
    color: 'chart-1',
  },
  {
    icon: Shield,
    title: 'Unmatched Safety',
    description:
      'Comprehensive 7-point driver verification, real-time ride tracking, and instant emergency response for complete peace of mind.',
    metric: '99.8%',
    color: 'chart-2',
  },
  {
    icon: Users,
    title: 'Trusted Community',
    description:
      'Join over 2 million satisfied riders and 50,000 verified drivers in our growing transportation network.',
    metric: '2M+',
    color: 'chart-3',
  },
  {
    icon: DollarSign,
    title: 'Best Value Promise',
    description:
      'Transparent pricing with no surge fees, loyalty rewards, and up to 40% savings compared to traditional ride services.',
    metric: '40% Off',
    color: 'chart-4',
  },
];

// Additional service highlights for enhanced content variety
export const extendedServiceHighlights: ServiceHighlight[] = [
  ...serviceHighlights,
  {
    icon: Star,
    title: 'Premium Experience',
    description:
      'Consistently rated 4.9 stars with professional drivers, clean vehicles, and exceptional customer service.',
    metric: '4.9★',
    color: 'chart-1',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description:
      'Round-the-clock service with drivers available 24/7 across 100+ cities worldwide for your convenience.',
    metric: '24/7',
    color: 'chart-2',
  },
  {
    icon: MapPin,
    title: 'Wide Coverage',
    description:
      'Extensive network coverage spanning major cities and suburban areas with reliable service everywhere you go.',
    metric: '100+',
    color: 'chart-3',
  },
  {
    icon: TrendingUp,
    title: 'Growing Network',
    description:
      'Rapidly expanding platform with 300% year-over-year growth and continuous service improvements.',
    metric: '300%',
    color: 'chart-4',
  },
];

// Performance metrics and competitive advantages
export const platformMetrics = {
  totalRiders: '2M+',
  activeDrivers: '50K+',
  citiesCovered: '100+',
  averageRating: '4.9★',
  safetyScore: '99.8%',
  bookingSpeed: '< 15s',
  costSavings: '40%',
  availability: '24/7',
  growthRate: '300%',
  responseTime: '< 2min',
};

// Competitive advantages for marketing content
export const competitiveAdvantages = [
  {
    feature: 'Booking Speed',
    goJourny: '< 15 seconds',
    competitor: '45-60 seconds',
    advantage: '75% faster',
  },
  {
    feature: 'Safety Score',
    goJourny: '99.8%',
    competitor: '96.2%',
    advantage: '3.6% higher',
  },
  {
    feature: 'Cost Savings',
    goJourny: 'Up to 40% less',
    competitor: 'Standard pricing',
    advantage: '40% savings',
  },
  {
    feature: 'Driver Verification',
    goJourny: '7-point check',
    competitor: '3-point check',
    advantage: '133% more thorough',
  },
  {
    feature: 'Response Time',
    goJourny: '< 2 minutes',
    competitor: '5-10 minutes',
    advantage: '75% faster support',
  },
  {
    feature: 'Network Coverage',
    goJourny: '100+ cities',
    competitor: '50-75 cities',
    advantage: '33% more coverage',
  },
];
