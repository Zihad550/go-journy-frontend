import type { IRide } from './ride.type';

// Admin note interface
export interface IAdminNote {
  note: string;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

// Status history interface
export interface IStatusHistory {
  status: string;
  changedBy: {
    name: string;
    email: string;
  };
  changedAt: string;
  reason: string;
}

// Extended ride interface with admin-specific fields
export interface IAdminRide extends IRide {
  adminNotes?: IAdminNote[];
  statusHistory?: IStatusHistory[];
}

// Admin ride overview response
export interface IAdminRideOverview {
  rides: IAdminRide[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Admin ride analytics response
export interface IAdminRideAnalytics {
  statusDistribution: Array<{ _id: string; count: number }>;
  revenueAnalytics: {
    totalRevenue: number;
    totalRides: number;
    averageRidePrice: number;
  };
  trendData: Array<{
    _id: { year: number; month: number };
    totalRides: number;
    completedRides: number;
    cancelledRides: number;
    totalRevenue: number;
  }>;
  topDrivers: Array<{
    _id: string;
    totalRides: number;
    completedRides: number;
    totalEarnings: number;
    completionRate: number;
    driverName: string;
    driverEmail: string;
  }>;
}

// Ride issues response
export interface IRideIssues {
  issues: IAdminRide[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Driver history response
export interface IDriverHistory {
  rides: IRide[];
  stats: {
    totalRides: number;
    completedRides: number;
    cancelledRides: number;
    totalEarnings: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query parameters for admin ride overview
export interface IRideOverviewParams {
  status?: string;
  driverId?: string;
  riderId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Query parameters for admin ride analytics
export interface IRideAnalyticsParams {
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

// Query parameters for ride issues
export interface IRideIssuesParams {
  issueType?: 'cancelled' | 'long_duration' | 'no_driver' | 'disputed';
  page?: number;
  limit?: number;
}

// Query parameters for driver history
export interface IDriverHistoryParams {
  page?: number;
  limit?: number;
  status?: string;
}

// Payload for status updates
export interface IStatusUpdatePayload {
  status: string;
  reason: string;
}

// Payload for driver assignment
export interface IAssignDriverPayload {
  driverId: string;
  reason: string;
}

// Payload for adding admin notes
export interface IAddNotePayload {
  note: string;
}

// Payload for force deletion
export interface IForceDeletePayload {
  reason: string;
}
