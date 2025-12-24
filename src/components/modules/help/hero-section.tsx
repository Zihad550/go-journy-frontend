import { GradientBackground } from "@/components/ui/gradient-background";
import { SectionWrapper } from "@/components/layout/section-wrapper";

function HeroSection() {
  return (
    <GradientBackground>
      <SectionWrapper spacing="normal">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              Need Help?
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Find answers to common questions, get in touch with our support team, or explore
            resources to make your ride experience better.
          </p>
        </div>
      </SectionWrapper>
    </GradientBackground>
  );
}

export default HeroSection;