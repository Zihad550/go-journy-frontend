import { Card } from '@/components/ui/card';
import { GradientBackground } from '@/components/ui/gradient-background';
import {
  Award,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  Users,
} from 'lucide-react';

function AchievementsSection() {
  return (
    <GradientBackground className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
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
  );
}

export default AchievementsSection;