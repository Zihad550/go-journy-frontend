import { Badge } from "@/components/ui/badge";
import { PageSpinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HOW_IT_WORKS_DATA } from "@/constants/how-it-works.constant";
import { useSectionAnimations } from "@/hooks/use-section-animations";
import { useTabAccessibility } from "@/hooks/use-tab-accessibility";
import { cn } from "@/lib/utils";
import { useUserInfoQuery } from "@/redux/features/user/user-api";
import { Car, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { TRUST_INDICATORS } from "../../constants/how-it-works-section-constants";
import { CTAButton } from "../hero/c-t-a-button";
import { TabContent } from "./tab-content";

interface HowItWorksProps {
  className?: string;
}

export function HowItWorksSection({ className }: HowItWorksProps) {
  const { data, isLoading } = useUserInfoQuery(undefined);
  const [activeTab, setActiveTab] = useState("rider");

  // Custom hooks for animations and accessibility
  const { createTabChangeHandler } = useTabAccessibility();
  const { headerAnimation, tabsAnimation } = useSectionAnimations();

  // Create tab change handler with setActiveTab
  const handleTabChange = createTabChangeHandler(setActiveTab);

  // Memoize dynamic content based on active tab
  const dynamicContent = useMemo(
    () => ({
      header:
        activeTab === "rider"
          ? "Ready to Experience Premium Rides?"
          : "Ready to Start Your Earning Journey?",
      description:
        activeTab === "rider"
          ? "Join millions of satisfied riders who choose Go Journy for their daily commute and special trips."
          : "Join our community of successful drivers and start earning with flexible schedules and great support.",
    }),
    [activeTab],
  );

  const currentUser = data?.data;
  if (isLoading) return <PageSpinner message="Loading user..." />;

  return (
    <section
      className={cn("relative overflow-hidden", className)}
      aria-labelledby="how-it-works-heading"
      role="region"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-chart-1/10 rounded-full blur-3xl" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          ref={headerAnimation.ref}
          className={cn(
            "text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-800",
            headerAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6",
          )}
        >
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 text-sm font-medium"
          >
            How It Works
          </Badge>

          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            Simple Steps to
            <span className="block text-primary">Get Started</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Whether you're looking for a ride or want to start earning as a
            driver, getting started with Go Journy is quick and easy.
          </p>
        </div>

        {/* Tabbed Interface */}
        <div
          ref={tabsAnimation.ref}
          className={cn(
            "w-full transition-all duration-600",
            tabsAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4",
          )}
        >
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            {/* Enhanced Tab Navigation with Modern Design */}
            <div className="flex justify-center mb-12 sm:mb-16">
              <div className="relative">
                {/* Background Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-chart-1/20 to-chart-2/20 rounded-2xl blur-xl opacity-60 animate-pulse" />

                {/* Tab Container */}
                <TabsList
                  className="relative grid w-full max-w-sm sm:max-w-lg grid-cols-2 h-16 sm:h-18 p-2 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl"
                  aria-label="Choose user type to see how it works"
                >
                  {/* Rider Tab */}
                  <TabsTrigger
                    value="rider"
                    className={cn(
                      "group relative flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 ease-out",
                      "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90",
                      "data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg",
                      "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground",
                      "data-[state=inactive]:hover:bg-muted/50",
                      "px-4 sm:px-6 py-3",
                    )}
                    aria-label="View how it works for riders"
                  >
                    {/* Icon with Animation */}
                    <div className="relative">
                      <Users
                        className={cn(
                          "w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300",
                          "group-data-[state=active]:scale-110 group-data-[state=active]:drop-shadow-sm",
                          "group-hover:scale-105",
                        )}
                        aria-hidden="true"
                      />
                      {/* Active Indicator Pulse */}
                      <div className="absolute inset-0 bg-primary-foreground/20 rounded-full group-data-[state=active]:animate-ping group-data-[state=inactive]:hidden" />
                    </div>

                    {/* Text with Responsive Display */}
                    <span className="hidden xs:inline font-semibold">
                      For Riders
                    </span>
                    <span
                      className="xs:hidden text-lg"
                      role="img"
                      aria-hidden="true"
                    >
                      👥
                    </span>

                    {/* Active State Indicator */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-foreground rounded-full group-data-[state=active]:opacity-100 group-data-[state=inactive]:opacity-0 transition-opacity duration-300" />
                  </TabsTrigger>

                  {/* Driver Tab */}
                  <TabsTrigger
                    value="driver"
                    className={cn(
                      "group relative flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 ease-out",
                      "data-[state=active]:bg-gradient-to-r data-[state=active]:from-chart-1 data-[state=active]:to-chart-2",
                      "data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg",
                      "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground",
                      "data-[state=inactive]:hover:bg-muted/50",
                      "px-4 sm:px-6 py-3",
                    )}
                    aria-label="View how it works for drivers"
                  >
                    {/* Icon with Animation */}
                    <div className="relative">
                      <Car
                        className={cn(
                          "w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300",
                          "group-data-[state=active]:scale-110 group-data-[state=active]:drop-shadow-sm",
                          "group-hover:scale-105",
                        )}
                        aria-hidden="true"
                      />
                      {/* Active Indicator Pulse */}
                      <div className="absolute inset-0 bg-primary-foreground/20 rounded-full group-data-[state=active]:animate-ping group-data-[state=inactive]:hidden" />
                    </div>

                    {/* Text with Responsive Display */}
                    <span className="hidden xs:inline font-semibold">
                      For Drivers
                    </span>
                    <span
                      className="xs:hidden text-lg"
                      role="img"
                      aria-hidden="true"
                    >
                      🚗
                    </span>

                    {/* Active State Indicator */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-foreground rounded-full group-data-[state=active]:opacity-100 group-data-[state=inactive]:opacity-0 transition-opacity duration-300" />
                  </TabsTrigger>
                </TabsList>

                {/* Floating Tab Statistics */}
                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4">
                  <div className="bg-gradient-to-r from-primary to-chart-1 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                    {activeTab === "rider" ? "3 Steps" : "3 Steps"}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Tab Content with Smooth Transitions */}
            <TabsContent value="rider">
              <TabContent type="rider" steps={HOW_IT_WORKS_DATA.rider} />
            </TabsContent>

            <TabsContent value="driver">
              <TabContent type="driver" steps={HOW_IT_WORKS_DATA.driver} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Call-to-Action Section */}
        {!currentUser && (
          <div className="text-center mt-12 sm:mt-16 md:mt-20 px-4 sm:px-0">
            <div className="relative">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-chart-1/5 rounded-3xl blur-3xl" />

              <div className="relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-8 sm:p-12 shadow-2xl">
                {/* Dynamic Header */}
                <div className="mb-8">
                  <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                    {dynamicContent.header}
                  </h4>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {dynamicContent.description}
                  </p>
                </div>

                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                  {activeTab === "rider" ? (
                    <>
                      <CTAButton
                        type="rider"
                        aria-describedby="rider-cta-description"
                      >
                        Book Your First Ride
                      </CTAButton>
                      <span id="rider-cta-description" className="sr-only">
                        Start your journey as a rider by booking your first ride
                      </span>

                      <CTAButton
                        type="rider"
                        variant="outline"
                        aria-describedby="rider-learn-more-description"
                      >
                        Learn More
                      </CTAButton>
                      <span
                        id="rider-learn-more-description"
                        className="sr-only"
                      >
                        Learn more about our rider services and features
                      </span>
                    </>
                  ) : (
                    <>
                      <CTAButton
                        type="driver"
                        aria-describedby="driver-cta-description"
                      >
                        Start Driving Today
                      </CTAButton>
                      <span id="driver-cta-description" className="sr-only">
                        Begin your journey as a driver and start earning money
                        today
                      </span>

                      <CTAButton
                        type="driver"
                        variant="outline"
                        aria-describedby="driver-requirements-description"
                      >
                        Driver Requirements
                      </CTAButton>
                      <span
                        id="driver-requirements-description"
                        className="sr-only"
                      >
                        View the requirements and qualifications needed to
                        become a driver
                      </span>
                    </>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 pt-6 border-t border-border/30">
                  <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
                    {TRUST_INDICATORS.map((indicator, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 bg-${indicator.color}-500 rounded-full animate-pulse`}
                        />
                        <span>{indicator.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
