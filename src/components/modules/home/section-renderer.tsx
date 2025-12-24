import { SectionWrapper } from "@/components/layout/section-wrapper";
import { PageSpinner } from "@/components/ui/spinner";
import { HOME_LAYOUT_CONFIG } from "@/config/home-layout-config";
import { useUserInfoQuery } from "@/redux/features/user/user-api";
import React from "react";
import { CTASection } from "./components/cta/c-t-a-section";
import { HeroSection } from "./components/hero/hero-section";
import { HowItWorksSection } from "./components/sections/how-it-works-section";
import { NewsletterSection } from "./components/sections/newsletter-section";
import { ServiceHighlightsSection } from "./components/sections/service-highlights-section";
import { TestimonialsSection } from "./components/sections/testimonials-section";

// Component map for dynamic rendering
const component_map = {
  HeroSection,
  HowItWorksSection,
  NewsletterSection,
  ServiceHighlightsSection,
  TestimonialsSection,
  CTASection,
} as const;

interface SectionRendererProps {
  sectionId: string;
  sectionRef: React.RefObject<HTMLDivElement>;
  props?: Record<string, any>;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  sectionId,
  sectionRef,
  props = {},
}) => {
  const { data, isLoading } = useUserInfoQuery(undefined);

   const current_user = data?.data;
   if (isLoading) return <PageSpinner message="Loading user..." />;

   const section = HOME_LAYOUT_CONFIG.sections.find((s) => s.id === sectionId);
   if (!section) return null;

   if (section.component === "CTASection" && current_user) return;
  const Component = component_map[
    section.component as keyof typeof component_map
  ] as React.ComponentType<any>;

  return (
    <SectionWrapper
      ref={sectionRef}
      spacing={section.spacing}
      zIndex={section.zIndex}
      className={(section as any).className}
    >
      <Component {...props} />
    </SectionWrapper>
  );
};
