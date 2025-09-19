import type { LucideIcon } from 'lucide-react';
import {
  CreditCard,
  Car,
  CheckCircle,
  DollarSign,
  UserCheck,
  HandHeart,
} from 'lucide-react';

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface HowItWorksData {
  rider: ProcessStep[];
  driver: ProcessStep[];
}

export const HOW_IT_WORKS_DATA: HowItWorksData = {
  rider: [
    {
      step: 1,
      title: 'Request & Pay',
      description:
        'Enter your pickup and destination, then secure your ride with upfront payment. This ensures your trip is guaranteed and helps drivers plan their day effectively.',
      icon: CreditCard,
    },
    {
      step: 2,
      title: 'Choose Your Driver',
      description:
        'Multiple drivers will show interest in your ride. Review their profiles, ratings, and estimated arrival times, then select the driver that best fits your preferences.',
      icon: UserCheck,
    },
    {
      step: 3,
      title: 'Enjoy Your Ride',
      description:
        'Meet your chosen driver and enjoy a safe, comfortable journey. After completion, your payment is automatically transferred to the driver with full trip transparency.',
      icon: Car,
    },
  ],
  driver: [
    {
      step: 1,
      title: 'Go Online',
      description:
        'Set your status to online and browse available ride requests in your area. See trip details, pickup locations, and estimated earnings before expressing interest.',
      icon: CheckCircle,
    },
    {
      step: 2,
      title: 'Show Interest',
      description:
        'Express interest in rides that match your schedule and location. Compete with other drivers by showcasing your rating, vehicle details, and estimated arrival time.',
      icon: HandHeart,
    },
    {
      step: 3,
      title: 'Get Selected & Earn',
      description:
        'When riders choose you, complete the trip safely and professionally. Receive instant payment after ride completion with transparent earnings and 5-star ratings.',
      icon: DollarSign,
    },
  ],
};

export const PROCESS_STEPS = {
  RIDER: HOW_IT_WORKS_DATA.rider,
  DRIVER: HOW_IT_WORKS_DATA.driver,
} as const;
