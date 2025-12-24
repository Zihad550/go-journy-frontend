import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Heart,
  Star,
  Target,
} from 'lucide-react';

function MissionVisionValuesSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Our Foundation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built on principles that guide every decision we make and every
            feature we develop.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Mission */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-primary/10 text-primary rounded-full w-fit">
                <Target className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                To provide safe, reliable, and affordable transportation
                solutions that connect communities while empowering drivers to
                earn a sustainable income.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-chart-1/10 text-chart-1 rounded-full w-fit">
                <Star className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                To become the most trusted ride-sharing platform globally,
                setting new standards for safety, user experience, and
                community impact.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Values */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-chart-2/10 text-chart-2 rounded-full w-fit">
                <Heart className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Safety first, community-driven innovation, transparency in all
                interactions, and unwavering commitment to user satisfaction.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default MissionVisionValuesSection;