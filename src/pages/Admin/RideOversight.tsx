import { useState, useMemo } from 'react';
import {
  useGetAdminRideOverviewQuery,
  useGetActiveRidesQuery,
  useGetRideIssuesQuery,
  useGetAdminRideAnalyticsQuery
} from '@/redux/features/admin/admin.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CardLoader } from '@/components/ui/card-loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Route,
  MapPin,
  Clock,
  DollarSign,
  User,
  Car,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { RideStatus } from '@/constants';
import type { IAdminRide, IRideOverviewParams, IRideAnalyticsParams, IDriver } from '@/types';

// Import admin modal components
import Pagination from '@/components/modules/Admin/Pagination';
import RideDetailsModal from '@/components/modules/Admin/RideDetailsModal';
import StatusUpdateModal from '@/components/modules/Admin/StatusUpdateModal';
import DeleteConfirmModal from '@/components/modules/Admin/DeleteConfirmModal';
import DriverHistoryModal from '@/components/modules/Admin/DriverHistoryModal';

interface RideStats {
  total: number;
  requested: number;
  accepted: number;
  in_transit: number;
  completed: number;
  cancelled: number;
}

const RideOversight = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRide, setSelectedRide] = useState<IAdminRide | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Driver History Modal State
  const [showDriverHistory, setShowDriverHistory] = useState(false);
  const [selectedDriverForHistory, setSelectedDriverForHistory] = useState<IDriver | null>(null);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'active' | 'issues' | 'analytics'>('overview');
  
  // Analytics state
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [analyticsStartDate, setAnalyticsStartDate] = useState<string>('');
  const [analyticsEndDate, setAnalyticsEndDate] = useState<string>('');
  
  const analyticsParams: IRideAnalyticsParams = {
    period: analyticsPeriod,
    ...(analyticsStartDate && { startDate: analyticsStartDate }),
    ...(analyticsEndDate && { endDate: analyticsEndDate })
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Admin ride overview with pagination and filtering
  const rideParams: IRideOverviewParams = {
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(searchTerm && { riderId: searchTerm }), // This would need backend adjustment for proper search
    page: currentPage,
    limit: 20,
    sortBy,
    sortOrder,
  };
  
  const { data: ridesData, isLoading, error, refetch } = useGetAdminRideOverviewQuery(rideParams);
  const { data: activeRidesData, isLoading: isActiveLoading } = useGetActiveRidesQuery();
  const { data: rideIssuesData, isLoading: isIssuesLoading } = useGetRideIssuesQuery({});
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetAdminRideAnalyticsQuery(analyticsParams);
  
  // Loading state based on active tab
  const isCurrentTabLoading = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return isActiveLoading;
      case 'issues':
        return isIssuesLoading;
      case 'analytics':
        return isAnalyticsLoading;
      default:
        return isLoading;
    }
  }, [activeTab, isLoading, isActiveLoading, isIssuesLoading, isAnalyticsLoading]);
  
  // Note: Mutations and form states are now handled inside individual modal components

  // Get current data based on active tab
  const currentRidesData = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return activeRidesData?.data || [];
      case 'issues':
        return rideIssuesData?.data?.issues || [];
      default:
        return ridesData?.data?.rides || [];
    }
  }, [activeTab, ridesData, activeRidesData, rideIssuesData]);

  // Calculate ride statistics from overview data
  const rideStats: RideStats = useMemo(() => {
    if (!ridesData?.data?.rides) {
      return { total: 0, requested: 0, accepted: 0, in_transit: 0, completed: 0, cancelled: 0 };
    }
    
    const rides = ridesData.data.rides;
    return {
      total: ridesData.data.pagination.total,
      requested: rides.filter(ride => ride.status === RideStatus.REQUESTED).length,
      accepted: rides.filter(ride => ride.status === RideStatus.ACCEPTED).length,
      in_transit: rides.filter(ride => ride.status === RideStatus.IN_TRANSIT).length,
      completed: rides.filter(ride => ride.status === RideStatus.COMPLETED).length,
      cancelled: rides.filter(ride => ride.status === RideStatus.CANCELLED).length,
    };
  }, [ridesData]);



  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case RideStatus.REQUESTED:
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Requested</Badge>;
      case RideStatus.ACCEPTED:
        return <Badge variant="outline" className="text-green-600 border-green-200">Accepted</Badge>;
      case RideStatus.IN_TRANSIT:
        return <Badge variant="outline" className="text-purple-600 border-purple-200">In Transit</Badge>;
      case RideStatus.COMPLETED:
        return <Badge variant="outline" className="text-emerald-600 border-emerald-200">Completed</Badge>;
      case RideStatus.CANCELLED:
        return <Badge variant="outline" className="text-red-600 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Note: Handler functions moved to individual modal components

  // Format location for display
  const formatLocation = (location: { lat: string; lng: string }) => {
    return `${parseFloat(location.lat).toFixed(4)}, ${parseFloat(location.lng).toFixed(4)}`;
  };

  // Get rider name
  const getRiderName = (rider: string | { name: string; email: string }) => {
    return typeof rider === 'object' ? rider.name : 'Unknown';
  };

  // Get driver name
  const getDriverName = (driver?: string | { user: string | { name: string; email: string } }) => {
    if (!driver) return 'Not Assigned';
    if (typeof driver === 'object' && driver.user) {
      return typeof driver.user === 'object' ? driver.user.name : 'Unknown';
    }
    return 'Unknown';
  };

  // Handle viewing driver history
  const handleViewDriverHistory = (driver: IDriver) => {
    setSelectedDriverForHistory(driver);
    setShowDriverHistory(true);
  };

  // Reset all modal states
  // Handle modal actions
  const handleModalSuccess = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get current pagination info
  const currentPagination = useMemo(() => {
    switch (activeTab) {
      case 'issues':
        return rideIssuesData?.data?.pagination;
      default:
        return ridesData?.data?.pagination;
    }
  }, [activeTab, ridesData, rideIssuesData]);


  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Ride Oversight</h1>
          <p className="text-muted-foreground">
            Advanced ride management with admin controls, analytics, and issue tracking
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Route className="w-4 h-4 mr-2 inline" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Activity className="w-4 h-4 mr-2 inline" />
            Active Rides ({activeRidesData?.data?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'issues'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <AlertTriangle className="w-4 h-4 mr-2 inline" />
            Issues ({rideIssuesData?.data?.pagination?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2 inline" />
            Analytics
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Route className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Rides</span>
            </div>
            <div className="text-2xl font-bold mt-2">{rideStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Requested</span>
            </div>
            <div className="text-2xl font-bold mt-2">{rideStats.requested}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Accepted</span>
            </div>
            <div className="text-2xl font-bold mt-2">{rideStats.accepted}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Car className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">In Transit</span>
            </div>
            <div className="text-2xl font-bold mt-2">{rideStats.in_transit}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold mt-2">{rideStats.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Cancelled</span>
            </div>
            <div className="text-2xl font-bold mt-2">{rideStats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search rides by rider, driver, ID, or price..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Statuses</option>
                <option value={RideStatus.REQUESTED}>Requested</option>
                <option value={RideStatus.ACCEPTED}>Accepted</option>
                <option value={RideStatus.IN_TRANSIT}>In Transit</option>
                <option value={RideStatus.COMPLETED}>Completed</option>
                <option value={RideStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
            
            {/* Sort By */}
            <div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="status-asc">Status A-Z</option>
                <option value="updatedAt-desc">Recently Updated</option>
              </select>
            </div>
            
            {/* Refresh Button */}
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="default"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {activeTab === 'analytics' ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Ride Analytics</span>
                  </CardTitle>
                  <CardDescription>
                    Comprehensive insights into ride patterns and performance
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  {/* Period Selection */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Period:</label>
                    <select
                      value={analyticsPeriod}
                      onChange={(e) => setAnalyticsPeriod(e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly')}
                      className="px-3 py-1 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  
                  {/* Date Range Inputs */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">From:</label>
                    <input
                      type="date"
                      value={analyticsStartDate}
                      onChange={(e) => setAnalyticsStartDate(e.target.value)}
                      className="px-3 py-1 border border-input bg-background rounded-md text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">To:</label>
                    <input
                      type="date"
                      value={analyticsEndDate}
                      onChange={(e) => setAnalyticsEndDate(e.target.value)}
                      className="px-3 py-1 border border-input bg-background rounded-md text-sm"
                    />
                  </div>
                  
                  {/* Clear Dates Button */}
                  {(analyticsStartDate || analyticsEndDate) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAnalyticsStartDate('');
                        setAnalyticsEndDate('');
                      }}
                    >
                      Clear Dates
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isAnalyticsLoading ? (
                <CardLoader message="Loading analytics..." />
              ) : analyticsData ? (
                <div className="space-y-6">
                  {/* Revenue Analytics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-medium">Total Revenue</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          ${analyticsData.data?.revenueAnalytics?.totalRevenue?.toFixed(2) || '0.00'}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Route className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Total Rides</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {analyticsData.data?.revenueAnalytics?.totalRides || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">Average Price</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          ${analyticsData.data?.revenueAnalytics?.averageRidePrice?.toFixed(2) || '0.00'}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Status Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {analyticsData.data?.statusDistribution?.map((status) => (
                          <div key={status._id} className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{status.count}</div>
                            <div className="text-sm text-muted-foreground capitalize">{status._id}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Top Drivers */}
                  {analyticsData.data?.topDrivers && analyticsData.data.topDrivers.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Performing Drivers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-4 font-medium">Driver</th>
                                <th className="text-left p-4 font-medium">Total Rides</th>
                                <th className="text-left p-4 font-medium">Completed</th>
                                <th className="text-left p-4 font-medium">Completion Rate</th>
                                <th className="text-left p-4 font-medium">Earnings</th>
                                <th className="text-left p-4 font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analyticsData.data.topDrivers.map((driver) => (
                                <tr key={driver._id} className="border-b hover:bg-muted/50">
                                  <td className="p-4">
                                    <div className="flex items-center space-x-2">
                                      <Car className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <div className="font-medium">{driver.driverName}</div>
                                        <div className="text-sm text-muted-foreground">{driver.driverEmail}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4">{driver.totalRides}</td>
                                  <td className="p-4">{driver.completedRides}</td>
                                  <td className="p-4">{driver.completionRate.toFixed(1)}%</td>
                                  <td className="p-4">${driver.totalEarnings.toFixed(2)}</td>
                                  <td className="p-4">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        // Create a mock driver object for the history modal
                                        const mockDriver = {
                                          _id: driver._id,
                                          user: {
                                            _id: driver._id,
                                            name: driver.driverName,
                                            email: driver.driverEmail,
                                            role: 'DRIVER' as const,
                                            isActive: 'ACTIVE' as const,
                                            isDeleted: false,
                                            isVerified: true,
                                            auths: [],
                                            address: '',
                                            bookings: [],
                                            guides: [],
                                            phone: ''
                                          },
                                          vehicle: { name: 'Unknown', model: 'Unknown' },
                                          experience: 0,
                                          driverStatus: 'approved' as const,
                                          availability: 'online' as const,
                                          createdAt: new Date(),
                                          updatedAt: new Date()
                                        };
                                        handleViewDriverHistory(mockDriver);
                                      }}
                                    >
                                      <User className="h-4 w-4 mr-1" />
                                      History
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No analytics data available</h3>
                  <p className="text-muted-foreground">Analytics data will appear as rides are completed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Rides Table */
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === 'active' && 'Active Rides'}
              {activeTab === 'issues' && 'Ride Issues'}
              {activeTab === 'overview' && 'All Rides'}
              ({currentRidesData.length})
            </CardTitle>
            <CardDescription>
              {activeTab === 'active' && 'Currently ongoing rides (requested, accepted, in transit)'}
              {activeTab === 'issues' && 'Rides requiring admin attention and review'}
              {activeTab === 'overview' && 'Complete overview of all ride requests and their current status'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isCurrentTabLoading ? (
              <CardLoader message="Loading rides..." />
            ) : error ? (
              <div className="text-red-500 text-center py-8">
                Error loading rides. Please try again.
              </div>
            ) : currentRidesData.length === 0 ? (
              <div className="text-center py-12">
                <Route className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No rides found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : activeTab === 'active' 
                      ? 'No active rides at the moment'
                      : activeTab === 'issues'
                        ? 'No ride issues found'
                        : 'No rides have been created yet'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Ride ID</th>
                      <th className="text-left p-4 font-medium">Rider</th>
                      <th className="text-left p-4 font-medium">Driver</th>
                      <th className="text-left p-4 font-medium">Pickup</th>
                      <th className="text-left p-4 font-medium">Destination</th>
                      <th className="text-left p-4 font-medium">Price</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Created</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRidesData.map((ride) => (
                      <tr key={ride._id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {ride._id.slice(-8)}
                          </code>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{getRiderName(ride.rider)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{getDriverName(ride.driver)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-mono">
                              {formatLocation(ride.pickupLocation)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-red-500" />
                            <span className="text-xs font-mono">
                              {formatLocation(ride.destination)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                            <span className="font-medium">${ride.price.toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(ride.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(ride.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedRide(ride);
                                setShowDetails(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            


                            {/* Driver History Button */}
                            {typeof ride.driver === 'object' && ride.driver && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDriverHistory(ride.driver as IDriver)}
                                title="View Driver History"
                              >
                                <User className="h-4 w-4 mr-1" />
                                History
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {currentPagination && currentPagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  page={currentPagination.page}
                  totalPages={currentPagination.totalPages}
                  total={currentPagination.total}
                  limit={currentPagination.limit}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <RideDetailsModal
        open={showDetails}
        onOpenChange={setShowDetails}
        ride={selectedRide}
        onStatusUpdate={() => {
          setShowDetails(false);
          setShowStatusUpdate(true);
        }}
        onDelete={() => {
          setShowDetails(false);
          setShowDeleteConfirm(true);
        }}
      />
      
      <StatusUpdateModal
        open={showStatusUpdate}
        onOpenChange={setShowStatusUpdate}
        ride={selectedRide}
        onSuccess={handleModalSuccess}
      />
      


      <DeleteConfirmModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        ride={selectedRide}
        onSuccess={handleModalSuccess}
      />
      
      {/* Driver History Modal */}
      <DriverHistoryModal
        open={showDriverHistory}
        driver={selectedDriverForHistory}
        onOpenChange={setShowDriverHistory}
      />
    </div>
  );
};

export default RideOversight;
