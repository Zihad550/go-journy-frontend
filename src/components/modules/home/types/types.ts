/**
 * TypeScript interfaces for CTA Section components
 */

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

import type { ReactNode } from "react";

export interface BenefitItem {
  icon: ReactNode;
  text: string;
}

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

export interface BenefitGridProps {
  items: BenefitItem[];
  className?: string;
  itemClassName?: string;
}