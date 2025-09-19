/**
 * Centralized TypeScript type definitions for Home module
 * This file consolidates all interfaces and types used across Home components
 */

import type { ReactNode } from "react";

// ============================================================================
// SHARED COMPONENT TYPES
// ============================================================================

export interface AnimatedIconProps {
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
  color?: string;
  bgColor?: string;
  className?: string;
}

export interface UrgencyBadgeProps {
  icon: ReactNode;
  text: ReactNode;
  variant?: "primary" | "chart2";
  className?: string;
}

export interface BenefitItem {
  icon: ReactNode;
  text: string;
}

export interface BenefitGridProps {
  items: BenefitItem[];
  className?: string;
  itemClassName?: string;
}

// ============================================================================
// STATISTICS AND DATA TYPES
// ============================================================================

export interface StatisticsData {
  users: string;
  cities: string;
  rides: string;
  drivers: string;
  rating: string;
  availability: string;
  waitTime: string;
  satisfaction: string;
  earnings: string;
  safetyRecord: string;
}

export interface StatItem {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface StatsGridProps {
  className?: string;
}

// ============================================================================
// HERO SECTION TYPES
// ============================================================================

export interface HeroSectionProps {
  isAuthenticated?: boolean;
}

export interface CTAButtonsProps {
  isAuthenticated?: boolean;
  className?: string;
}

export interface CTAButtonProps {
  type: 'rider' | 'driver';
  isAuthenticated?: boolean;
  className?: string;
}

export interface RiderHeroContentProps {
  isAuthenticated?: boolean;
}

export interface DriverHeroContentProps {
  isAuthenticated?: boolean;
}

export interface HeroOverlayManagerProps {
  isRider: boolean;
  isDriver: boolean;
  onRideRequested?: () => void;
  onRideCancelled?: () => void;
  onRideAccepted?: () => void;
}

// ============================================================================
// CTA SECTION TYPES
// ============================================================================

export interface CTASectionProps {
  isRider: boolean;
}

export interface DriverCTAProps {
  isAuthenticated: boolean;
}

export interface HeaderSectionProps {
  headerAnimation: {
    ref: React.RefObject<HTMLDivElement | null>;
    isVisible: boolean;
  };
  statsAnimation: {
    ref: React.RefObject<HTMLDivElement | null>;
    isVisible: boolean;
  };
}

// ============================================================================
// SECTIONS TYPES
// ============================================================================

export interface HowItWorksProps {
  className?: string;
}

export interface TabContentProps {
  type: 'rider' | 'driver';
  steps: any[]; // Import ProcessStep from constants
}

export interface ProcessStepCardProps {
  step: any; // Import ProcessStep from constants
  index: number;
  isRider: boolean;
}

export interface ProcessFlowProps {
  type: 'rider' | 'driver';
  steps: any[]; // Import ProcessStep from constants
}

export interface StatisticsDisplayProps {
  statistics: StatItem[];
  className?: string;
}

export interface ServiceHighlightsProps {
  className?: string;
}

export interface AnimatedCounterProps {
  value: string;
  label: string;
  duration?: number;
}

export interface HighlightCardProps {
  highlight: any; // Import ServiceHighlight from constants
  index: number;
}

export interface TestimonialsProps {
  className?: string;
}

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
}

export interface TestimonialCardProps {
  testimonial: any; // Import Testimonial from constants
  index: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface SectionRendererProps {
  sectionId: string;
  sectionRef: React.RefObject<HTMLDivElement>;
  props?: Record<string, any>;
}

export interface RideRequestCardProps {
  ride: any; // Import IRide from types
  onAccept: (rideId: string) => void;
  onDecline: (rideId: string) => void;
}

// ============================================================================
// ANIMATION TYPES
// ============================================================================

export interface AnimationConfig {
  animationType?: 'fade' | 'slide' | 'scale' | 'slideUp' | 'slideDown';
  duration?: number;
  threshold?: number;
}

export interface HoverConfig {
  scale?: number;
  duration?: number;
}

// ============================================================================
// RE-EXPORTS
// ============================================================================

// Re-export types from external modules for convenience
export type { ReactNode } from "react";