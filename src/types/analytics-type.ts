// Analytics-related TypeScript interfaces

export interface IRiderAnalyticsOverview {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalSpent: number;
  averageRideCost: number;
  completionRate: number;
}

export interface ISpendingTrend {
  _id: { year: number; month: number };
  totalSpent: number;
  rideCount: number;
  averageCost: number;
}

export interface IFavoriteLocation {
  location: { lat: string; lng: string };
  count: number;
}

export interface IDriverRating {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
  recentReviews: Array<{
    driverName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

export interface IRiderAnalytics {
  overview: IRiderAnalyticsOverview;
  spendingTrends: ISpendingTrend[];
  favoriteLocations: {
    pickupLocations: IFavoriteLocation[];
    destinationLocations: IFavoriteLocation[];
  };
  driverRatings: IDriverRating;
  rideHistory: Array<{
    _id: string;
    status: string;
    price: number;
    pickupLocation: { lat: string; lng: string };
    destination: { lat: string; lng: string };
    driverName: string;
    createdAt: string;
    completedAt?: string;
  }>;
}

export interface IRiderAnalyticsParams {
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}
// Driver Analytics Types

export interface IDriverAnalyticsOverview {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalEarnings: number;
  averageRideEarnings: number;
  completionRate: number;
}

export interface IEarningsTrend {
  _id: { year: number; month: number };
  totalEarnings: number;
  rideCount: number;
  averageEarnings: number;
}

export interface IRiderRating {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
  recentReviews: Array<{
    riderName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

export interface IDriverAnalytics {
  overview: IDriverAnalyticsOverview;
  earningsTrends: IEarningsTrend[];
  riderRatings: IRiderRating;
  rideHistory: Array<{
    _id: string;
    status: string;
    price: number;
    pickupLocation: { lat: string; lng: string };
    destination: { lat: string; lng: string };
    riderName: string;
    createdAt: string;
    completedAt?: string;
  }>;
}

export interface IDriverAnalyticsParams {
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}
