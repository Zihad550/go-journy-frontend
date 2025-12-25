import { Badge } from "@/components/ui/badge";
import { GradientBackground } from "@/components/ui/gradient-background";
import { StatsGrid } from "../home/components/hero";

function CompanyStorySection() {
  return (
    <GradientBackground className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="secondary" className="mb-4">
              Our Story
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Born from a Simple Idea
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Go Journy was founded with a simple yet powerful vision: to
                create a ride-sharing platform that truly serves its community.
                We recognized that transportation is more than just getting from
                point A to point B—it's about connecting people, enabling
                opportunities, and building trust.
              </p>
              <p className="text-lg leading-relaxed">
                Our team of passionate technologists and transportation experts
                came together to address the real challenges faced by both
                riders and drivers in the current market. We believe that
                technology should empower everyone involved in the journey.
              </p>
              <p className="text-lg leading-relaxed">
                Today, we're proud to serve thousands of users while maintaining
                our commitment to safety, reliability, and community impact.
                Every ride on our platform is a step toward a more connected and
                accessible world.
              </p>
            </div>
          </div>

          <StatsGrid className="w-full h-full my-auto flex items-center  py-10" />
        </div>
      </div>
    </GradientBackground>
  );
}

export default CompanyStorySection;
