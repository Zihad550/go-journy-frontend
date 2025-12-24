import { Card } from '@/components/ui/card';
import {
  CheckCircle,
  MapPin,
  Shield,
  Users,
} from 'lucide-react';

function SafetyReliabilitySection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
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
  );
}

export default SafetyReliabilitySection;