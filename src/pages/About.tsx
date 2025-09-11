import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GradientBackground } from '@/components/ui/gradient-background';
import {
  Heart,
  Shield,
  Users,
  Target,
  Award,
  CheckCircle,
  Star,
  Clock,
  MapPin,
  DollarSign,
} from 'lucide-react';

function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <GradientBackground className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Mission, Vision & Values Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Company Story Section */}
      <GradientBackground className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Safety & Reliability Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Safety & Reliability First
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your safety is our top priority. We've implemented comprehensive
              measures to ensure every ride is secure and reliable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Driver Verification</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive background checks and document verification for
                all drivers
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-chart-1" />
              <h3 className="font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Live GPS tracking and route monitoring for complete journey
                transparency
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 mx-auto mb-4 text-chart-2" />
              <h3 className="font-semibold mb-2">Emergency Support</h3>
              <p className="text-sm text-muted-foreground">
                24/7 emergency assistance and instant connection to local
                authorities
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-chart-3" />
              <h3 className="font-semibold mb-2">Insurance Coverage</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive insurance protection for all rides and
                participants
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <GradientBackground className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our Achievements
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Milestones that reflect our commitment to excellence and community
              impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold mb-2">500K+</div>
              <h3 className="font-semibold mb-2">Completed Rides</h3>
              <p className="text-sm text-muted-foreground">
                Successfully connecting riders and drivers across multiple
                cities
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-chart-1" />
              <div className="text-3xl font-bold mb-2">$2M+</div>
              <h3 className="font-semibold mb-2">Driver Earnings Paid</h3>
              <p className="text-sm text-muted-foreground">
                Empowering 2,500+ drivers with flexible income opportunities.
                Average $15-25/hour with instant payouts.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <Star className="h-12 w-12 mx-auto mb-4 text-chart-2" />
              <div className="text-3xl font-bold mb-2">99.2%</div>
              <h3 className="font-semibold mb-2">Safety Record</h3>
              <p className="text-sm text-muted-foreground">
                Maintaining the highest safety standards in the industry
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 mx-auto mb-4 text-chart-3" />
              <div className="text-3xl font-bold mb-2">5K+</div>
              <h3 className="font-semibold mb-2">Active Drivers</h3>
              <p className="text-sm text-muted-foreground">
                Growing community of verified and trusted drivers
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <Clock className="h-12 w-12 mx-auto mb-4 text-chart-4" />
              <div className="text-3xl font-bold mb-2">3 Min</div>
              <h3 className="font-semibold mb-2">Average Wait Time</h3>
              <p className="text-sm text-muted-foreground">
                Quick and efficient ride matching for better user experience
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-chart-5" />
              <div className="text-3xl font-bold mb-2">98%</div>
              <h3 className="font-semibold mb-2">Customer Satisfaction</h3>
              <p className="text-sm text-muted-foreground">
                Consistently exceeding user expectations and building trust
              </p>
            </Card>
          </div>
        </div>
      </GradientBackground>
    </div>
  );
}

export default About;
