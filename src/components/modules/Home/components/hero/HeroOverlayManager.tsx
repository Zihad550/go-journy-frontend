import React from "react";
import { DriverHeroContent } from "./DriverHeroContent";
import { RiderHeroContent } from "./RiderHeroContent";

interface HeroOverlayManagerProps {
  isRider: boolean;
  isDriver: boolean;
  onRideRequested?: () => void;
  onRideCancelled?: () => void;
  onRideAccepted?: () => void;
}

export const HeroOverlayManager: React.FC<HeroOverlayManagerProps> = ({
  isRider,
  isDriver,
  onRideRequested,
  onRideCancelled,
  onRideAccepted,
}) => {
  return (
    <>
      {isRider && (
        <div className="relative -mt-6 sm:-mt-8 md:-mt-12 px-4 sm:px-6 lg:px-8 z-20">
          <RiderHeroContent
            onRideRequested={onRideRequested}
            onRideCancelled={onRideCancelled}
          />
        </div>
      )}

      {isDriver && (
        <div className="relative -mt-6 sm:-mt-8 md:-mt-12 px-4 sm:px-6 lg:px-8 z-20">
          <DriverHeroContent onRideAccepted={onRideAccepted} />
        </div>
      )}
    </>
  );
};
