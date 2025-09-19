import { useHomeAnimations } from '../../hooks/useHomeAnimations';
import { cn } from "@/lib/utils";
import { useUserInfoQuery } from "@/redux/features/user/user.api";
import { GradientBackground } from "@/components/ui/gradient-background";
import { HeaderSection, RiderCTA, DriverCTA, BottomCTA } from "./index";
import type { CTASectionProps } from "../../types";

export function CTASection({ isRider }: CTASectionProps) {
  const { data: userData } = useUserInfoQuery(undefined);
  const isAuthenticated = !!userData?.data;

  // Animation hooks
  const { ctaContainerAnimation } = useHomeAnimations();

  // Show CTA for unauthenticated users
  if (isRider) return null;

  return (
    <GradientBackground
      className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      role="region"
      aria-labelledby="cta-heading"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-chart-1/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <HeaderSection />

        <div
          ref={ctaContainerAnimation.ref as React.RefObject<HTMLDivElement>}
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-10 md:mb-12 px-2 sm:px-0 transition-all duration-600",
            ctaContainerAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6",
          )}
        >
          <RiderCTA />
          <DriverCTA isAuthenticated={isAuthenticated} />
        </div>

        <BottomCTA />
      </div>
    </GradientBackground>
  );
}
