import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapboxLocationPicker } from "@/components/ui/mapbox-location-picker";
import { Separator } from "@/components/ui/separator";
import { ButtonSpinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useRequestRideMutation } from "@/redux/features/ride/ride-api";
import type { IRide } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Car,
  DollarSign,
  Info,
  Locate,
  Map,
  MapPin,
  Route,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const requestRideSchema = z.object({
  pickupLat: z.string().min(1, "Pickup latitude is required"),
  pickupLng: z.string().min(1, "Pickup longitude is required"),
  destinationLat: z.string().min(1, "Destination latitude is required"),
  destinationLng: z.string().min(1, "Destination longitude is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a valid positive number",
    }),
});

type FormData = z.infer<typeof requestRideSchema>;

interface RequestRideFormProps {
  className?: string;
  onRideRequested: (ride: IRide) => void;
}

export function RequestRideForm({
  className,
  onRideRequested,
}: RequestRideFormProps) {
  const [requestRide, { isLoading }] = useRequestRideMutation();
  const [locationLoading, setLocationLoading] = useState<
    "pickup" | "destination" | null
  >(null);
  const [mapOpen, setMapOpen] = useState<"pickup" | "destination" | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(requestRideSchema),
    defaultValues: {
      pickupLat: "",
      pickupLng: "",
      destinationLat: "",
      destinationLng: "",
      price: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const rideRequest = {
      pickupLocation: {
        lat: data.pickupLat,
        lng: data.pickupLng,
      },
      destination: {
        lat: data.destinationLat,
        lng: data.destinationLng,
      },
      price: Number(data.price),
    };

    try {
      const response = await requestRide(rideRequest).unwrap();
      if (response.data) {
        toast.success("🚗 Ride requested successfully!");
        onRideRequested(response.data);
        form.reset();
      }
    } catch {
      toast.error("❌ Failed to request ride. Please try again.");
    }
  };

  const getCurrentLocation = (field: "pickup" | "destination") => {
    if (navigator.geolocation) {
      setLocationLoading(field);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (field === "pickup") {
            form.setValue("pickupLat", latitude.toString());
            form.setValue("pickupLng", longitude.toString());
          } else {
            form.setValue("destinationLat", latitude.toString());
            form.setValue("destinationLng", longitude.toString());
          }
          toast.success(
            `📍 ${field === "pickup" ? "Pickup" : "Destination"} location set!`,
          );
          setLocationLoading(null);
        },
        () => {
          toast.error("❌ Unable to get your location. Please enter manually.");
          setLocationLoading(null);
        },
      );
    } else {
      toast.error("❌ Geolocation is not supported by this browser.");
    }
  };

  const handleLocationSelect = (
    field: "pickup" | "destination",
    location: { lat: number; lng: number },
  ) => {
    if (field === "pickup") {
      form.setValue("pickupLat", location.lat.toString());
      form.setValue("pickupLng", location.lng.toString());
    } else {
      form.setValue("destinationLat", location.lat.toString());
      form.setValue("destinationLng", location.lng.toString());
    }
    toast.success(
      `📍 ${
        field === "pickup" ? "Pickup" : "Destination"
      } location selected from map!`,
    );
  };

  const getLocationFromForm = (field: "pickup" | "destination") => {
    if (field === "pickup") {
      const lat = form.getValues("pickupLat");
      const lng = form.getValues("pickupLng");
      return lat && lng
        ? { lat: parseFloat(lat), lng: parseFloat(lng) }
        : undefined;
    } else {
      const lat = form.getValues("destinationLat");
      const lng = form.getValues("destinationLng");
      return lat && lng
        ? { lat: parseFloat(lat), lng: parseFloat(lng) }
        : undefined;
    }
  };

  // Check if pickup location is selected
  const isPickupSelected = () => {
    const pickupLat = form.getValues("pickupLat");
    const pickupLng = form.getValues("pickupLng");
    return pickupLat && pickupLng;
  };

  // Watch pickup fields and clear destination if pickup is cleared
  const watchPickupLat = form.watch("pickupLat");
  const watchPickupLng = form.watch("pickupLng");

  useEffect(() => {
    // If pickup is cleared, also clear destination
    if (!watchPickupLat || !watchPickupLng) {
      form.setValue("destinationLat", "");
      form.setValue("destinationLng", "");
    }
  }, [watchPickupLat, watchPickupLng, form]);

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="text-center text-foreground">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
            <div className="p-2 bg-primary-foreground/20 rounded-full">
              <Car className="h-6 w-6" />
            </div>
            Request Your Ride
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base mt-2">
            Enter your journey details and we'll find the perfect ride for you
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Journey Overview */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-chart-2 rounded-full animate-pulse"></div>
                    <span className="font-medium">Pickup</span>
                  </div>
                  <Route className="h-4 w-4" />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-chart-1 rounded-full animate-pulse"></div>
                    <span className="font-medium">Destination</span>
                  </div>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="relative">
                <div className="bg-card border rounded-lg p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-chart-2/10 rounded-full">
                        <MapPin className="h-4 w-4 text-chart-2" />
                      </div>
                      <h3 className="text-lg font-semibold text-card-foreground">
                        Pickup Location
                      </h3>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMapOpen("pickup")}
                        className="flex-1 sm:flex-none"
                      >
                        <Map className="h-4 w-4" />
                        Select on Map
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => getCurrentLocation("pickup")}
                        disabled={locationLoading === "pickup"}
                        className="flex-1 sm:flex-none"
                      >
                        {locationLoading === "pickup" ? (
                          <ButtonSpinner size="xs" />
                        ) : (
                          <Locate className="h-4 w-4" />
                        )}
                        {locationLoading === "pickup"
                          ? "Getting..."
                          : "Current"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pickupLat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 23.8103" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pickupLng"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 90.4125" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Journey Arrow */}
              <div className="flex justify-center py-2">
                <div className="p-2 bg-primary rounded-full">
                  <ArrowRight className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>

              {/* Destination Location */}
              <div className="relative">
                <div
                  className={cn(
                    "bg-card border rounded-lg p-4 space-y-4 transition-opacity",
                    !isPickupSelected() && "opacity-50",
                  )}
                >
                  {!isPickupSelected() && (
                    <div className="absolute inset-0 bg-muted/20 rounded-lg flex items-center justify-center z-10">
                      <div className="bg-background/90 backdrop-blur-sm border rounded-lg px-4 py-2 text-sm text-muted-foreground">
                        Please select pickup location first
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-chart-1/10 rounded-full">
                        <MapPin className="h-4 w-4 text-chart-1" />
                      </div>
                      <h3 className="text-lg font-semibold text-card-foreground">
                        Destination
                      </h3>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMapOpen("destination")}
                        disabled={!isPickupSelected()}
                        className="flex-1 sm:flex-none"
                      >
                        <Map className="h-4 w-4" />
                        Select on Map
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => getCurrentLocation("destination")}
                        disabled={
                          locationLoading === "destination" ||
                          !isPickupSelected()
                        }
                        className="flex-1 sm:flex-none"
                      >
                        {locationLoading === "destination" ? (
                          <ButtonSpinner size="xs" />
                        ) : (
                          <Locate className="h-4 w-4" />
                        )}
                        {locationLoading === "destination"
                          ? "Getting..."
                          : "Current"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="destinationLat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 23.7515"
                              disabled={!isPickupSelected()}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="destinationLng"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 90.3753"
                              disabled={!isPickupSelected()}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-card border rounded-lg p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-3 text-lg font-semibold">
                        <div className="p-2 bg-chart-4/10 rounded-full">
                          <DollarSign className="h-4 w-4 text-chart-4" />
                        </div>
                        Estimated Price
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="25.00"
                            type="number"
                            min="1"
                            step="0.01"
                            className="pl-10 text-base font-medium"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Set a competitive price to attract drivers faster
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-2" />

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <ButtonSpinner />
                      Requesting Your Ride...
                    </>
                  ) : (
                    <>
                      <Car className="h-4 w-4" />
                      Request Ride Now
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              {/* Info Section */}
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-start gap-3">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-2 text-foreground">
                      What happens next?
                    </p>
                    <ul className="space-y-1">
                      <li>
                        • We'll notify nearby drivers about your ride request
                      </li>
                      <li>
                        • You'll receive a confirmation once a driver accepts
                      </li>
                      <li>• Track your driver's arrival in real-time</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Location Picker Modals */}
      <MapboxLocationPicker
        isOpen={mapOpen === "pickup"}
        onClose={() => setMapOpen(null)}
        onLocationSelect={(location) =>
          handleLocationSelect("pickup", location)
        }
        title="Select Pickup Location"
        type="pickup"
        initialLocation={getLocationFromForm("pickup")}
      />

      <MapboxLocationPicker
        isOpen={mapOpen === "destination"}
        onClose={() => setMapOpen(null)}
        onLocationSelect={(location) =>
          handleLocationSelect("destination", location)
        }
        title="Select Destination"
        type="destination"
        initialLocation={getLocationFromForm("destination")}
        pickupLocation={getLocationFromForm("pickup")}
      />
    </div>
  );
}
