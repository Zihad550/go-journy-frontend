import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { PageSpinner } from "@/components/ui/spinner";
import { HOME_LAYOUT_CONFIG } from "@/config/homeLayout.config";
import { useUserInfoQuery } from "@/redux/features/user/user.api";
import React from "react";
import { CTASection } from "./components/cta/CTASection";
import { HeroSection } from "./components/hero/HeroSection";
import { HowItWorksSection } from "./components/sections/HowItWorksSection";
import { ServiceHighlightsSection } from "./components/sections/ServiceHighlightsSection";
import { TestimonialsSection } from "./components/sections/TestimonialsSection";

// Component map for dynamic rendering
const componentMap = {
  HeroSection,
  HowItWorksSection,
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

  const currentUser = data?.data;
  if (isLoading) return <PageSpinner message="Loading user..." />;

  const section = HOME_LAYOUT_CONFIG.sections.find((s) => s.id === sectionId);
  if (!section) return null;

  if (section.component === "CTASection" && currentUser) return;
  const Component = componentMap[
    section.component as keyof typeof componentMap
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
