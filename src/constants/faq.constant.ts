import type { LucideIcon } from 'lucide-react';
import { Users, Car, CreditCard, HelpCircle } from 'lucide-react';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'riders' | 'drivers' | 'payments' | 'general';
  popular?: boolean;
  tags: string[];
}

export interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  items: FAQItem[];
}

export const FAQ_CATEGORIES = {
  RIDERS: 'riders' as const,
  DRIVERS: 'drivers' as const,
  PAYMENTS: 'payments' as const,
  GENERAL: 'general' as const,
};

export const FAQ_DATA: FAQItem[] = [
  // Riders FAQ
  {
    id: 'rider-1',
    question: 'How do I book a ride?',
    answer:
      'To book a ride, simply open the app, enter your pickup and destination locations, select your preferred ride type, and confirm your booking. You can track your driver in real-time once your ride is accepted.',
    category: 'riders',
    popular: true,
    tags: ['booking', 'ride', 'request', 'pickup', 'destination'],
  },
  {
    id: 'rider-2',
    question: 'Can I cancel my ride?',
    answer:
      'Yes, you can cancel your ride at any time before or during the trip. However, cancellation fees may apply depending on the timing and circumstances of the cancellation.',
    category: 'riders',
    popular: true,
    tags: ['cancel', 'cancellation', 'fees', 'refund'],
  },
  {
    id: 'rider-3',
    question: 'How do I track my driver?',
    answer:
      "Once your ride is accepted, you can track your driver's location in real-time on the map. You'll also receive notifications about your driver's arrival time and trip progress.",
    category: 'riders',
    tags: ['tracking', 'driver', 'location', 'real-time', 'map'],
  },
  {
    id: 'rider-4',
    question: "What if my driver doesn't show up?",
    answer:
      "If your driver doesn't arrive within the expected time, you can contact them directly through the app or cancel the ride. Our support team is also available 24/7 to assist you.",
    category: 'riders',
    tags: ['no-show', 'driver', 'support', 'contact', 'help'],
  },
  {
    id: 'rider-5',
    question: 'Can I schedule a ride in advance?',
    answer:
      "Currently, we focus on on-demand rides for immediate pickup. However, we're working on adding scheduled ride functionality in future updates.",
    category: 'riders',
    tags: ['schedule', 'advance', 'future', 'booking', 'planned'],
  },

  // Drivers FAQ
  {
    id: 'driver-1',
    question: 'How do I become a driver?',
    answer:
      'To become a driver, you need to complete our registration process by providing your vehicle information, driving experience, and required documents. Once approved, you can start accepting rides.',
    category: 'drivers',
    popular: true,
    tags: ['registration', 'signup', 'requirements', 'approval', 'documents'],
  },
  {
    id: 'driver-2',
    question: 'How much can I earn as a driver?',
    answer:
      'Driver earnings vary based on factors like location, time of day, and number of rides completed. You keep the majority of each fare, with a small platform fee deducted for app services.',
    category: 'drivers',
    popular: true,
    tags: ['earnings', 'income', 'money', 'fare', 'commission'],
  },
  {
    id: 'driver-3',
    question: 'Can I choose which rides to accept?',
    answer:
      'Yes, you have full control over which rides you accept. You can view ride details including pickup location, destination, and estimated fare before deciding to accept.',
    category: 'drivers',
    tags: ['accept', 'decline', 'choice', 'rides', 'control'],
  },
  {
    id: 'driver-4',
    question: 'What are the vehicle requirements?',
    answer:
      'Your vehicle must be in good condition, have valid registration and insurance, and meet our safety standards. Specific requirements may vary by location.',
    category: 'drivers',
    tags: ['vehicle', 'requirements', 'car', 'insurance', 'registration'],
  },
  {
    id: 'driver-5',
    question: 'How do I go online/offline?',
    answer:
      "You can easily toggle your availability status in the app. When online, you'll receive ride requests. When offline, you won't receive any new requests.",
    category: 'drivers',
    tags: ['online', 'offline', 'availability', 'status', 'toggle'],
  },

  // Payments FAQ
  {
    id: 'payment-1',
    question: 'What payment methods do you accept?',
    answer:
      'We accept various payment methods including credit cards, debit cards, digital wallets, and cash payments. You can manage your payment methods in the app settings.',
    category: 'payments',
    popular: true,
    tags: ['payment', 'methods', 'credit', 'debit', 'cash', 'wallet'],
  },
  {
    id: 'payment-2',
    question: 'How is the fare calculated?',
    answer:
      "Fares are calculated based on distance, time, and current demand. You'll see the estimated fare before confirming your ride, and the final amount after completion.",
    category: 'payments',
    tags: ['fare', 'pricing', 'calculation', 'cost', 'estimate'],
  },
  {
    id: 'payment-3',
    question: 'Can I get a receipt for my ride?',
    answer:
      "Yes, you'll automatically receive a digital receipt via email after each completed ride. You can also view all your ride receipts in the app's trip history section.",
    category: 'payments',
    tags: ['receipt', 'invoice', 'email', 'history', 'record'],
  },
  {
    id: 'payment-4',
    question: "What if I'm charged incorrectly?",
    answer:
      "If you believe you've been charged incorrectly, please contact our support team with your trip details. We'll review the fare and issue a refund if necessary.",
    category: 'payments',
    tags: ['incorrect', 'charge', 'dispute', 'refund', 'support'],
  },

  // General FAQ
  {
    id: 'general-1',
    question: 'Is Go Journy available in my city?',
    answer:
      "Go Journy is currently available in over 50 cities and expanding rapidly. Check our website or app to see if we're available in your area.",
    category: 'general',
    popular: true,
    tags: ['availability', 'cities', 'location', 'coverage', 'expansion'],
  },
  {
    id: 'general-2',
    question: 'How do I contact customer support?',
    answer:
      "You can reach our 24/7 customer support through the app's help section, email us at jehadhossain008@gmail.com, or call our support hotline. We're here to help!",
    category: 'general',
    popular: true,
    tags: ['support', 'contact', 'help', 'customer', 'service'],
  },
  {
    id: 'general-3',
    question: 'Is my personal information safe?',
    answer:
      'Yes, we take your privacy and security seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your consent.',
    category: 'general',
    tags: ['privacy', 'security', 'data', 'safe', 'protection'],
  },
  {
    id: 'general-4',
    question: 'Can I use the app without creating an account?',
    answer:
      'To ensure safety and provide the best experience, you need to create an account to book rides. Registration is quick and only requires basic information.',
    category: 'general',
    tags: ['account', 'registration', 'signup', 'required', 'safety'],
  },
];

export const FAQ_CATEGORIES_DATA: FAQCategory[] = [
  {
    id: 'riders',
    name: 'For Riders',
    description: 'Common questions about booking and taking rides',
    icon: Users,
    items: FAQ_DATA.filter((item) => item.category === 'riders'),
  },
  {
    id: 'drivers',
    name: 'For Drivers',
    description: 'Information about driving and earning with Go Journy',
    icon: Car,
    items: FAQ_DATA.filter((item) => item.category === 'drivers'),
  },
  {
    id: 'payments',
    name: 'Payments & Billing',
    description: 'Questions about fares, payments, and receipts',
    icon: CreditCard,
    items: FAQ_DATA.filter((item) => item.category === 'payments'),
  },
  {
    id: 'general',
    name: 'General',
    description: 'General questions about Go Journy',
    icon: HelpCircle,
    items: FAQ_DATA.filter((item) => item.category === 'general'),
  },
];

export const POPULAR_FAQS = FAQ_DATA.filter((item) => item.popular);
