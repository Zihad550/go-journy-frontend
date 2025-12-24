import { Badge } from '@/components/ui/badge';
import { GradientBackground } from '@/components/ui/gradient-background';

function HeroSection() {
  return (
    <GradientBackground className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            About Go Journy
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Connecting Communities Through
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              {' '}
              Safe Rides
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're revolutionizing transportation by creating a platform that
            prioritizes safety, reliability, and community connection for both
            riders and drivers.
          </p>
        </div>
      </div>
    </GradientBackground>
  );
}

export default HeroSection;