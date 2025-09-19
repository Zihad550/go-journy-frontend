import { HeroOverlayManager, SectionRenderer } from "@/components/modules/Home";
import { HOME_LAYOUT_CONFIG } from "@/config/homeLayout.config";
import { Role } from "@/constants";
import { useSectionTransition } from "@/hooks/useScrollAnimation";
import { useUserInfoQuery } from "@/redux/features/user/user.api";
import { useMemo } from "react";

function Home() {
  const { data: userData } = useUserInfoQuery(undefined);

  // Memoize user state to prevent unnecessary re-renders
  const userState = useMemo(
    () => ({
      isAuthenticated: !!userData?.data,
      isRider: userData?.data?.role === Role.RIDER,
      isDriver: userData?.data?.role === Role.DRIVER,
    }),
    [userData],
  );

  // Create section refs statically to avoid calling hooks inside loops
  const heroRef = useSectionTransition() as React.RefObject<HTMLDivElement>;
  const howItWorksRef =
    useSectionTransition() as React.RefObject<HTMLDivElement>;
  const serviceHighlightsRef =
    useSectionTransition() as React.RefObject<HTMLDivElement>;
  const testimonialsRef =
    useSectionTransition() as React.RefObject<HTMLDivElement>;
  const ctaRef = useSectionTransition() as React.RefObject<HTMLDivElement>;

  // Map section IDs to their refs
  const sectionRefs = useMemo(
    () => ({
      hero: heroRef,
      "how-it-works": howItWorksRef,
      "service-highlights": serviceHighlightsRef,
      testimonials: testimonialsRef,
      cta: ctaRef,
    }),
    [heroRef, howItWorksRef, serviceHighlightsRef, testimonialsRef, ctaRef],
  );

  // const handleRideRequested = () => {
  //   // Handle any additional logic when a ride is requested
  // };

  // const handleRideCancelled = () => {
  //   // Handle any additional logic when a ride is cancelled
  // };

  // const handleRideAccepted = () => {
  //   // Handle any additional logic when a driver accepts a ride
  // };

  return (
    <main className="min-h-screen bg-background">
      {HOME_LAYOUT_CONFIG.sections.map((section) => {
        // Special handling for hero section with overlay
        if (section.id === "hero" && section.hasOverlay) {
          return (
            <div key={section.id}>
              <SectionRenderer
                sectionId={section.id}
                sectionRef={sectionRefs[section.id]}
                props={{ isAuthenticated: userState.isAuthenticated }}
              />
              <HeroOverlayManager
                isRider={userState.isRider}
                isDriver={userState.isDriver}
                // onRideRequested={handleRideRequested}
                // onRideCancelled={handleRideCancelled}
                // onRideAccepted={handleRideAccepted}
              />
            </div>
          );
        }

        // Standard section rendering
        const sectionProps: Record<string, any> = {
          isAuthenticated: userState.isAuthenticated,
        };

        // Add specific props based on section
        if (section.id === "cta") {
          sectionProps.isRider = userState.isRider;
        }

        return (
          <SectionRenderer
            key={section.id}
            sectionId={section.id}
            sectionRef={sectionRefs[section.id]}
            props={sectionProps}
          />
        );
      })}
    </main>
  );
}

export default Home;
