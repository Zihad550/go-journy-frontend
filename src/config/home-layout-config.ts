export interface SectionConfig {
  id: string;
  component: string;
  spacing: 'compact' | 'normal' | 'generous';
  zIndex: number;
  hasOverlay?: boolean;
  className?: string;
}

export const HOME_LAYOUT_CONFIG = {
  sections: [
    {
      id: 'hero',
      component: 'HeroSection',
      spacing: 'normal' as const,
      zIndex: 10,
      hasOverlay: true,
      className: 'min-h-[65vh] pt-6 sm:pt-8 md:pt-12 pb-2 sm:pb-4 md:pb-6'
    },
    {
      id: 'how-it-works',
      component: 'HowItWorksSection',
      spacing: 'normal' as const,
      zIndex: 0
    },
    {
      id: 'service-highlights',
      component: 'ServiceHighlightsSection',
      spacing: 'normal' as const,
      zIndex: 0
    },
    {
      id: 'testimonials',
      component: 'TestimonialsSection',
      spacing: 'normal' as const,
      zIndex: 0
    },
    {
      id: 'newsletter',
      component: 'NewsletterSection',
      spacing: 'normal' as const,
      zIndex: 0
    },
    {
      id: 'cta',
      component: 'CTASection',
      spacing: 'generous' as const,
      zIndex: 0,
      className: 'pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 md:pb-12'
    }
  ] as const
};