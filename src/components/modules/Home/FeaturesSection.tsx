import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Car, Users, MapPin, Star } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Us?
          </h2>
          <p className="text-xl text-muted-foreground">
            We provide the best ride experience with these amazing features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Car className="h-12 w-12 text-chart-1 mx-auto mb-4" />
              <CardTitle>Reliable Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Professional drivers with well-maintained vehicles for your
                safety and comfort.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <MapPin className="h-12 w-12 text-chart-2 mx-auto mb-4" />
              <CardTitle>Real-time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track your ride in real-time and know exactly when your driver
                will arrive.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-chart-3 mx-auto mb-4" />
              <CardTitle>Trusted Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Join thousands of satisfied riders and drivers in our trusted
                community.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Star className="h-12 w-12 text-chart-4 mx-auto mb-4" />
              <CardTitle>5-Star Service</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Rated 5 stars by our users for exceptional service and
                reliability.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
