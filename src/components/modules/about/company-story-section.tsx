import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { GradientBackground } from '@/components/ui/gradient-background';
import {
  Clock,
  MapPin,
  Star,
  Users,
} from 'lucide-react';

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
                create a ride-sharing platform that truly serves its
                community. We recognized that transportation is more than just
                getting from point A to point B—it's about connecting people,
                enabling opportunities, and building trust.
              </p>
              <p className="text-lg leading-relaxed">
                Our team of passionate technologists and transportation
                experts came together to address the real challenges faced by
                both riders and drivers in the current market. We believe that
                technology should empower everyone involved in the journey.
              </p>
              <p className="text-lg leading-relaxed">
                Today, we're proud to serve thousands of users while
                maintaining our commitment to safety, reliability, and
                community impact. Every ride on our platform is a step toward
                a more connected and accessible world.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-muted-foreground">
                Active Users
              </div>
            </Card>
            <Card className="p-6 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-3 text-chart-1" />
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-muted-foreground">
                Cities Served
              </div>
            </Card>
            <Card className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-chart-2" />
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </Card>
            <Card className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-3 text-chart-3" />
              <div className="text-2xl font-bold">4.8</div>
              <div className="text-sm text-muted-foreground">
                Average Rating
              </div>
            </Card>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
}

export default CompanyStorySection;