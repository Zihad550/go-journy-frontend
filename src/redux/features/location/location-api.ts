import { baseApi } from '@/redux/base-api';
import type { IApiResponse } from '@/types';

// Location types
export interface ILocation {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp?: string;
  address?: string;
}

export interface ILocationUpdate {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
}

export interface IRouteData {
  rideId: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  duration: number;
  distance: number;
  instructions?: Array<{
    text: string;
    distance: number;
    duration: number;
    type: string;
  }>;
  waypoints: ILocation[];
  route?: {
    geometry: {
      type: string;
      coordinates: number[][];
    };
    duration: number;
    distance: number;
  };
}

export interface IRouteRequest {
  profile?: 'driving' | 'driving-traffic' | 'walking' | 'cycling';
  alternatives?: boolean;
  steps?: boolean;
}

export interface IETAData {
  rideId: string;
  eta: string;
  duration: number;
  distance: number;
  trafficDelay: number;
  route: IRouteData['route'];
}

export interface ILocationHistory {
  rideId: string;
  driverId: string;
  locations: ILocation[];
  total: number;
  timeRange: {
    start: string;
    end: string;
  };
}

export interface IGeocodeResult {
  placeName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: {
    street?: string;
    city?: string;
    country?: string;
    postcode?: string;
  };
  relevance: number;
}

export interface IReverseGeocodeResult {
  coordinates: {
    lat: number;
    lng: number;
  };
  address: {
    placeName: string;
    street?: string;
    city?: string;
    district?: string;
    country?: string;
    postcode?: string;
  };
}

export interface IPOIResult {
  id: string;
  name: string;
  type: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  distance: number;
  rating?: number;
}

export interface IPOISearchResult {
  center: {
    lat: number;
    lng: number;
  };
  places: IPOIResult[];
}

export const locationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Driver location management
    updateDriverLocation: builder.mutation<
      IApiResponse<{ driverId: string; location: ILocation; broadcasted: boolean }>,
      ILocationUpdate
    >({
      query: (locationData) => ({
        url: '/location/drivers/location',
        method: 'POST',
        data: locationData,
      }),
      invalidatesTags: ['RIDE'],
    }),

    getDriverLocation: builder.query<
      IApiResponse<{ driverId: string; location: ILocation; isOnline: boolean; lastUpdated: string }>,
      string
    >({
      query: (driverId) => ({
        url: `/location/drivers/location/${driverId}`,
        method: 'GET',
      }),
      providesTags: ['RIDE'],
    }),

    // Location history
    getLocationHistory: builder.query<
      IApiResponse<ILocationHistory>,
      { rideId: string; startTime?: string; endTime?: string; limit?: number }
    >({
      query: ({ rideId, startTime, endTime, limit }) => {
        const params = new URLSearchParams();
        if (startTime) params.append('startTime', startTime);
        if (endTime) params.append('endTime', endTime);
        if (limit) params.append('limit', limit.toString());

        return {
          url: `/location/rides/${rideId}/location-history?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['RIDE'],
    }),

    // Route management
    calculateRoute: builder.mutation<
      IApiResponse<IRouteData>,
      { rideId: string; profile?: string; alternatives?: boolean; steps?: boolean }
    >({
      query: ({ rideId, ...params }) => ({
        url: `/location/rides/${rideId}/route`,
        method: 'POST',
        data: params,
      }),
      invalidatesTags: ['RIDE'],
    }),

    getRoute: builder.query<IApiResponse<IRouteData>, string>({
      query: (rideId) => ({
        url: `/location/rides/${rideId}/route`,
        method: 'GET',
      }),
      providesTags: ['RIDE'],
    }),

    // ETA calculation
    calculateETA: builder.mutation<
      IApiResponse<IETAData>,
      { rideId: string; currentLocation: { lat: number; lng: number } }
    >({
      query: ({ rideId, currentLocation }) => ({
        url: `/location/rides/${rideId}/eta`,
        method: 'POST',
        data: { currentLocation },
      }),
    }),

    // Geocoding services
    geocode: builder.query<
      IApiResponse<{ query: string; results: IGeocodeResult[] }>,
      { query: string; limit?: number; country?: string; bbox?: string }
    >({
      query: ({ query, limit, country, bbox }) => {
        const params = new URLSearchParams({ query });
        if (limit) params.append('limit', limit.toString());
        if (country) params.append('country', country);
        if (bbox) params.append('bbox', bbox);

        return {
          url: `/location/geocode?${params.toString()}`,
          method: 'GET',
        };
      },
    }),

    reverseGeocode: builder.query<
      IApiResponse<IReverseGeocodeResult>,
      { lat: number; lng: number }
    >({
      query: ({ lat, lng }) => ({
        url: `/location/reverse-geocode?lat=${lat}&lng=${lng}`,
        method: 'GET',
      }),
    }),

    // POI search
    searchPOI: builder.query<
      IApiResponse<IPOISearchResult>,
      { lat: number; lng: number; type?: string; radius?: number; limit?: number }
    >({
      query: ({ lat, lng, type, radius, limit }) => {
        const params = new URLSearchParams();
        params.append('lat', lat.toString());
        params.append('lng', lng.toString());
        if (type) params.append('type', type);
        if (radius) params.append('radius', radius.toString());
        if (limit) params.append('limit', limit.toString());

        return {
          url: `/location/places?${params.toString()}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useUpdateDriverLocationMutation,
  useGetDriverLocationQuery,
  useGetLocationHistoryQuery,
  useCalculateRouteMutation,
  useGetRouteQuery,
  useCalculateETAMutation,
  useGeocodeQuery,
  useReverseGeocodeQuery,
  useSearchPOIQuery,
  useLazyGeocodeQuery,
  useLazyReverseGeocodeQuery,
  useLazySearchPOIQuery,
} = locationApi;