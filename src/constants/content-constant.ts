import {
  Award,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  Users,
} from 'lucide-react';

// Brand and messaging constants for consistent content across public pages

export const BRAND = {
  name: 'Go Journy',
  tagline: 'Your Journey, Our Priority',
  description:
    'The modern ride-sharing platform connecting riders and drivers for safe, reliable, and affordable transportation.',
  mission:
    'To revolutionize urban transportation by connecting communities through safe, reliable, and affordable ride-sharing.',
  vision:
    "To be the world's most trusted transportation platform, making mobility accessible to everyone.",
  values: [
    'Safety First',
    'Community Driven',
    'Innovation Focused',
    'Transparency Always',
  ],
};

export const HERO_MESSAGES = {
  home: {
    title: 'Your Journey Starts Here',
    subtitle:
      'Safe, reliable, and affordable rides at your fingertips. Join thousands of satisfied riders and drivers.',
    cta: {
      primary: 'Book a Ride',
      secondary: 'Drive with Us',
    },
  },
  rider: {
    title: 'Get Where You Need to Go',
    subtitle:
      'Book rides instantly with trusted drivers in your area. Safe, fast, and affordable.',
    cta: 'Book Your Ride',
  },
  driver: {
    title: 'Drive and Earn on Your Schedule',
    subtitle:
      'Join thousands of drivers earning flexible income with Go Journy. Start driving today.',
    cta: 'Start Driving',
  },
};

export const STATISTICS = {
  users: '10,000+',
  cities: '50+',
  rides: '500,000+',
  drivers: '5,000+',
  rating: '4.8',
  availability: '24/7',
  waitTime: '3 min',
  satisfaction: '98%',
  earnings: '$2M+',
  safetyRecord: '99.2%',
};

export const FEATURES_MESSAGING = {
  rider: {
    title: 'Built for Riders',
    subtitle: 'Everything you need for a seamless ride experience',
    benefits: [
      'Book rides in seconds',
      'Track your driver in real-time',
      'Multiple payment options',
      'Transparent pricing',
      'Rate and review drivers',
      'Trip history and receipts',
    ],
  },
  driver: {
    title: 'Built for Drivers',
    subtitle: 'Tools and features to maximize your earning potential',
    benefits: [
      'Flexible schedule',
      'Competitive earnings',
      'Instant ride notifications',
      'Smart navigation',
      'Weekly earnings reports',
      '24/7 driver support',
    ],
  },
  safety: {
    title: 'Safety First',
    subtitle: 'Comprehensive safety features for peace of mind',
    benefits: [
      'Background-checked drivers',
      'Real-time trip tracking',
      'Emergency support button',
      'Insurance coverage',
      'Secure payments',
      'Community ratings',
    ],
  },
};

export const ABOUT_CONTENT = {
  story: {
    title: 'Our Story',
    content:
      'Founded with a vision to transform urban transportation, Go Journy has grown from a simple idea to a thriving platform serving thousands of users daily. We believe that getting around should be safe, affordable, and convenient for everyone.',
  },
  mission: {
    title: 'Our Mission',
    content:
      'To revolutionize urban transportation by connecting communities through safe, reliable, and affordable ride-sharing solutions that benefit both riders and drivers.',
  },
  vision: {
    title: 'Our Vision',
    content:
      "To be the world's most trusted transportation platform, making mobility accessible to everyone while creating economic opportunities for drivers.",
  },
  values: {
    title: 'Our Values',
    items: [
      {
        title: 'Safety First',
        description:
          'Every decision we make prioritizes the safety and security of our community.',
      },
      {
        title: 'Community Driven',
        description:
          'We build features and policies based on feedback from our riders and drivers.',
      },
      {
        title: 'Innovation Focused',
        description:
          'We continuously innovate to improve the transportation experience for everyone.',
      },
    ],
  },
  achievements: [
    {
      metric: '500K+',
      label: 'Completed Rides',
      description:
        'Successfully connecting riders and drivers across multiple cities',
      icon: Award,
      colorClass: 'text-primary',
    },
    {
      metric: '$2M+',
      label: 'Driver Earnings Paid',
      description:
        'Empowering 2,500+ drivers with flexible income opportunities. Average $15-25/hour with instant payouts.',
      icon: DollarSign,
      colorClass: 'text-chart-1',
    },
    {
      metric: '99.2%',
      label: 'Safety Record',
      description:
        'Maintaining the highest safety standards in the industry',
      icon: Star,
      colorClass: 'text-chart-2',
    },
    {
      metric: '5K+',
      label: 'Active Drivers',
      description: 'Growing community of verified and trusted drivers',
      icon: Users,
      colorClass: 'text-chart-3',
    },
    {
      metric: '3 Min',
      label: 'Average Wait Time',
      description:
        'Quick and efficient ride matching for better user experience',
      icon: Clock,
      colorClass: 'text-chart-4',
    },
    {
      metric: '98%',
      label: 'Customer Satisfaction',
      description:
        'Consistently exceeding user expectations and building trust',
      icon: CheckCircle,
      colorClass: 'text-chart-5',
    },
  ],
};

export const CONTACT_MESSAGING = {
  title: 'Get in Touch',
  subtitle: "Have questions? We're here to help. Reach out to us anytime.",
  supportPromise:
    "We're committed to providing excellent customer support. Our team is available 24/7 for urgent matters and during business hours for general inquiries.",
  responseTime:
    'Most inquiries are answered within 2-4 hours during business hours.',
};

export const FAQ_MESSAGING = {
  title: 'Frequently Asked Questions',
  subtitle: 'Find answers to common questions about Go Journy',
  searchPlaceholder: 'Search for answers...',
  noResults: 'No questions found matching your search.',
  contactFallback:
    "Can't find what you're looking for? Contact our support team for personalized help.",
};

export const CTA_MESSAGES = {
  rider: {
    title: 'Ready to Ride?',
    subtitle: 'Join thousands of satisfied riders',
    button: 'Book Your First Ride',
  },
  driver: {
    title: 'Start Earning Today',
    subtitle: 'Drive on your schedule, earn on your terms',
    button: 'Apply to Drive',
  },
  general: {
    title: 'Join the Go Journy Community',
    subtitle: "Whether you need a ride or want to drive, we've got you covered",
    buttons: {
      rider: 'Find a Ride',
      driver: 'Start Driving',
    },
  },
};

export const FOOTER_CONTENT = {
  description:
    'Go Journy is the modern ride-sharing platform connecting riders and drivers for safe, reliable, and affordable transportation.',
  quickLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'Features', href: '/features' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
  support: [
    { label: 'Help Center', href: '/faq' },
    { label: 'Contact Support', href: '/contact' },
    { label: 'Safety', href: '/safety' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
  social: [
    { label: 'Twitter', href: 'https://twitter.com/gojourny' },
    { label: 'Facebook', href: 'https://facebook.com/gojourny' },
    { label: 'Instagram', href: 'https://instagram.com/gojourny' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/gojourny' },
  ],
  copyright: `© ${new Date().getFullYear()} Go Journy. All rights reserved.`,
};

export const ERROR_MESSAGES = {
  general: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection and try again.',
  validation: 'Please check your input and try again.',
  notFound: "The page you're looking for doesn't exist.",
  unauthorized: 'You need to be logged in to access this page.',
  forbidden: "You don't have permission to access this resource.",
};

export const SUCCESS_MESSAGES = {
  contactForm: "Thank you for your message! We'll get back to you soon.",
  registration: 'Registration successful! Welcome to Go Journy.',
  booking: 'Your ride has been booked successfully!',
  general: 'Success! Your request has been processed.',
};

export const LOADING_MESSAGES = {
  general: 'Loading...',
  booking: 'Booking your ride...',
  searching: 'Finding drivers...',
  submitting: 'Submitting...',
  processing: 'Processing your request...',
};
