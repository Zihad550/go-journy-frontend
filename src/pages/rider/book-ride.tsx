import { RiderHeroContent } from "@/components/modules/home/components/hero/rider-hero-content";
import { useState } from "react";
import { useLocation } from "react-router";

export default function BookRide() {
  const location = useLocation();
  const [state] = useState(location.state);

  const defaultFormValues = {
    pickupLat: state?.pickupLat || undefined,
    pickupLng: state?.pickupLng || undefined,
    destinationLat: state?.destinationLat || undefined,
    destinationLng: state?.destinationLng || undefined,
    price: state?.price || undefined,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <RiderHeroContent defaultFormValues={defaultFormValues} />
    </div>
  );
}
