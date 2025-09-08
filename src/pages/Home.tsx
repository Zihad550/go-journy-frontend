import {
  HeroSection,
  RiderHeroContent,
  FeaturesSection,
  CTASection,
} from '@/components/modules/Home';
import { useUserInfoQuery } from '@/redux/features/user/user.api';
import { Role } from '@/constants';
import type { IRide } from '@/types';

function Home() {
  const { data: userData } = useUserInfoQuery(undefined);

  const isAuthenticated = !!userData?.data;
  const isRider = userData?.data?.role === Role.RIDER;

  const handleRideRequested = (ride: IRide) => {
    // Handle any additional logic when a ride is requested
    console.log('Ride requested:', ride);
  };

  const handleRideCancelled = () => {
    // Handle any additional logic when a ride is cancelled
    console.log('Ride cancelled');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        <HeroSection isAuthenticated={isAuthenticated} />

        {/* Rider-specific content overlay */}
        {isRider && (
          <div className="relative -mt-16 px-4 z-20">
            <RiderHeroContent
              onRideRequested={handleRideRequested}
              onRideCancelled={handleRideCancelled}
            />
          </div>
        )}
      </div>

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection isRider={isRider} />
    </div>
  );
}

export default Home;
