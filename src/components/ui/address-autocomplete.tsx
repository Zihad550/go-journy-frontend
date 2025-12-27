import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useGeocodeQuery,
  useReverseGeocodeQuery,
  type IGeocodeResult,
} from "@/redux/features/location/location-api";
import { Loader2, MapPin, Navigation, X } from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Type definitions
type Suggestion = IGeocodeResult;

interface AddressAutocompleteProps {
  value?: string;
  placeholder?: string;
  onSelect: (location: {
    address: string;
    coordinates: { lat: number; lng: number };
  }) => void;
  onClear?: () => void;
  className?: string;
  disabled?: boolean;
  showCurrentLocation?: boolean;
  currentLocation?: { lat: number; lng: number };
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value = "",
  placeholder = "Enter address",
  onSelect,
  onClear,
  className,
  disabled = false,
  showCurrentLocation = false,
  currentLocation,
}) => {
  const [input_value, set_input_value] = useState(value);
  const [is_open, set_is_open] = useState(false);
  const [selected_index, set_selected_index] = useState(-1);
  const [is_getting_location, set_is_getting_location] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [suggestions, set_suggestions] = useState<Suggestion[]>([]);

  // Geocoding query
  const {
    data: geocodeData,
    isLoading: isGeocoding,
    error: geocodeError,
  } = useGeocodeQuery(
    {
      query: input_value,
      limit: 5,
    },
    {
      skip: input_value.length < 3,
    },
  );

  // Reverse geocoding for current location
  const { data: reverseGeocodeData } = useReverseGeocodeQuery(
    currentLocation
      ? { lat: currentLocation.lat, lng: currentLocation.lng }
      : { lat: 0, lng: 0 },
    {
      skip: !currentLocation,
    },
  );

  // Update suggestions when geocode data changes
  useEffect(() => {
    const results = geocodeData?.data?.results;
    if (results) {
      set_suggestions(results as Suggestion[]);
    } else {
      set_suggestions([]);
    }
  }, [geocodeData?.data?.results]);

  // Update input value when prop changes
  useEffect(() => {
    set_input_value(value);
  }, [value]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      set_input_value(newValue);
      set_is_open(newValue.length >= 3);
      set_selected_index(-1);
    },
    [],
  );

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    (suggestion: Suggestion) => {
      const location = {
        address: suggestion.placeName,
        coordinates: suggestion.coordinates,
      };

      set_input_value(suggestion.placeName);
      set_is_open(false);
      set_selected_index(-1);
      onSelect(location);
    },
    [onSelect],
  );

  // Handle current location selection
  const handleCurrentLocationSelect = useCallback(async () => {
    if (!navigator.geolocation) {
      return;
    }

    set_is_getting_location(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        },
      );

      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Use reverse geocoding to get address
      if (reverseGeocodeData?.data) {
        const location = {
          address: reverseGeocodeData.data.address.placeName,
          coordinates: coords,
        };
        set_input_value(reverseGeocodeData.data.address.placeName);
        onSelect(location);
      } else {
        // Fallback to coordinates only
        const location = {
          address: `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
          coordinates: coords,
        };
        set_input_value(location.address);
        onSelect(location);
      }
    } catch {
      toast.error("Failed to get current location");
    } finally {
      set_is_getting_location(false);
    }
  }, [reverseGeocodeData, onSelect]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!is_open || !suggestions.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          set_selected_index((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          set_selected_index((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selected_index >= 0 && selected_index < suggestions.length) {
            handleSuggestionSelect(suggestions[selected_index]);
          }
          break;
        case "Escape":
          set_is_open(false);
          set_selected_index(-1);
          break;
      }
    },
    [is_open, suggestions, selected_index, handleSuggestionSelect],
  );

  // Handle clear
  const handleClear = useCallback(() => {
    set_input_value("");
    set_is_open(false);
    set_selected_index(-1);
    onClear?.();
  }, [onClear]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        set_is_open(false);
        set_selected_index(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <React.Fragment>
      <div className={cn("relative", className)}>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={input_value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => input_value.length >= 3 && set_is_open(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="pr-20"
          />

          {/* Action buttons */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {input_value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}

            {showCurrentLocation && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCurrentLocationSelect}
                disabled={is_getting_location}
                className="h-6 w-6 p-0"
              >
                {is_getting_location ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Navigation className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Loading indicator */}
        {isGeocoding && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {suggestions.length > 0 && is_open && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.coordinates.lat}-${suggestion.coordinates.lng}`}
                type="button"
                onClick={() => handleSuggestionSelect(suggestion)}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0",
                  selected_index === index && "bg-gray-50",
                )}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {suggestion.placeName}
                    </div>
                    {suggestion.address && (
                      <div className="text-xs text-gray-500 mt-1">
                        {[
                          suggestion.address.street,
                          suggestion.address.city,
                          suggestion.address.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Error state */}
        {geocodeError ? (
          <div className="absolute z-50 w-full mt-1">
            <Card className="border-destructive">
              <CardContent className="p-3">
                <div className="text-sm text-destructive">
                  Failed to load address suggestions. Please try again.
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* No results */}
        {is_open &&
        !isGeocoding &&
        suggestions.length === 0 &&
        input_value.length >= 3 ? (
          <Card className="absolute z-50 w-full mt-1">
            <CardContent className="p-3">
              <div className="text-sm text-muted-foreground">
                No addresses found for "{input_value}"
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default AddressAutocomplete;
