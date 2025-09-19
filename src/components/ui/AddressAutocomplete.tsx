// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useGeocodeQuery, useReverseGeocodeQuery } from '@/redux/features/location/location.api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MapPin, Navigation, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Type definitions
interface Address {
  street?: string;
  city?: string;
  country?: string;
  postcode?: string;
}

interface Suggestion {
  placeName: string;
  coordinates: { lat: number; lng: number };
  address?: Address;
  relevance: number;
}

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

interface Suggestion {
  placeName: string;
  coordinates: { lat: number; lng: number };
  address?: Address;
  relevance: number;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value = '',
  placeholder = 'Enter address',
  onSelect,
  onClear,
  className,
  disabled = false,
  showCurrentLocation = false,
  currentLocation
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Geocoding query
  const { data: geocodeData, isLoading: isGeocoding, error: geocodeError } = useGeocodeQuery(
    {
      query: inputValue,
      limit: 5,
    },
    {
      skip: inputValue.length < 3,
    }
  );

  // Reverse geocoding for current location
  const { data: reverseGeocodeData } = useReverseGeocodeQuery(
    currentLocation ? { lat: currentLocation.lat, lng: currentLocation.lng } : { lat: 0, lng: 0 },
    {
      skip: !currentLocation,
    }
  );

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(newValue.length >= 3);
    setSelectedIndex(-1);
  }, []);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: Suggestion) => {
    const location = {
      address: suggestion.placeName,
      coordinates: suggestion.coordinates,
    };

    setInputValue(suggestion.placeName);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelect(location);
  }, [onSelect]);

  // Handle current location selection
  const handleCurrentLocationSelect = useCallback(async () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      return;
    }

    setIsGettingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

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
        setInputValue(reverseGeocodeData.data.address.placeName);
        onSelect(location);
      } else {
        // Fallback to coordinates only
        const location = {
          address: `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
          coordinates: coords,
        };
        setInputValue(location.address);
        onSelect(location);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsGettingLocation(false);
    }
  }, [reverseGeocodeData, onSelect]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || !geocodeData?.data?.results) return;

    const suggestions = geocodeData.data.results;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, geocodeData, selectedIndex, handleSuggestionSelect]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInputValue('');
    setIsOpen(false);
    setSelectedIndex(-1);
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
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get suggestions from geocode data
  const suggestions = useMemo(() => {
    return (geocodeData?.data?.results || []) as Suggestion[];
  }, [geocodeData?.data?.results]);

  return (
    <React.Fragment>
      <div className={cn("relative", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.length >= 3 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-20"
        />

        {/* Action buttons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
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
              disabled={isGettingLocation}
              className="h-6 w-6 p-0"
            >
              {isGettingLocation ? (
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

      {/* Suggestions dropdown */}
      {isOpen && (suggestions as Suggestion[]).length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* @ts-ignore RTK Query typing issue */}
          {(suggestions as Suggestion[]).map((suggestion: Suggestion, index: number) => (
            <button
              key={`${suggestion.coordinates.lat}-${suggestion.coordinates.lng}`}
              type="button"
              onClick={() => handleSuggestionSelect(suggestion)}
              className={cn(
                "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0",
                selectedIndex === index && "bg-gray-50"
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
                      {[suggestion.address.street, suggestion.address.city, suggestion.address.country]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Error state */}
      {geocodeError && (
        <div className="absolute z-50 w-full mt-1">
          <Card className="border-destructive">
            <CardContent className="p-3">
              <div className="text-sm text-destructive">
                Failed to load address suggestions. Please try again.
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No results */}
      {isOpen && !isGeocoding && suggestions.length === 0 && inputValue.length >= 3 && (
        <Card className="absolute z-50 w-full mt-1">
          <CardContent className="p-3">
            <div className="text-sm text-muted-foreground">
              No addresses found for "{inputValue}"
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </React.Fragment>
  );
};

export default AddressAutocomplete;