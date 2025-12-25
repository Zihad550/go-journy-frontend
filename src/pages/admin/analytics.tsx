import BarChart from "@/components/charts/bar-chart";
import PieChart from "@/components/charts/pie-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAdminDriverAnalyticsQuery,
  useGetOverviewStatsQuery,
  useGetRevenueTrendQuery,
  useGetRideAnalyticsQuery,
} from "@/redux/features/admin/admin-api";
import {
  Car,
  CheckCircle,
  Clock,
  DollarSign,
  Route,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const Analytics = () => {
  const [revenuePeriod, setRevenuePeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    error: overviewError,
  } = useGetOverviewStatsQuery();
  const {
    data: driverData,
    isLoading: isDriverLoading,
    error: driverError,
  } = useGetAdminDriverAnalyticsQuery();
  const {
    data: rideData,
    isLoading: isRideLoading,
    error: rideError,
  } = useGetRideAnalyticsQuery();
  const {
    data: revenueData,
    isLoading: isRevenueLoading,
    error: revenueError,
  } = useGetRevenueTrendQuery({ period: revenuePeriod, days: 30 });

  // Overview stats cards data
  const overviewCards = [
    {
      title: "Total Users",
      value: overviewData?.data?.totalUsers || 0,
      icon: Users,
      description: "Registered users on platform",
      color: "text-blue-600",
    },
    {
      title: "Total Drivers",
      value: overviewData?.data?.totalDrivers || 0,
      icon: Car,
      description: "Registered drivers",
      color: "text-green-600",
    },
    {
      title: "Total Rides",
      value: overviewData?.data?.totalRides || 0,
      icon: Route,
      description: "All time rides",
      color: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: `$${overviewData?.data?.totalRevenue?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      description: "Total platform revenue",
      color: "text-emerald-600",
    },
    {
      title: "Active Drivers",
      value: overviewData?.data?.activeDrivers || 0,
      icon: UserCheck,
      description: "Currently online drivers",
      color: "text-blue-500",
    },
    {
      title: "Completed Rides",
      value: overviewData?.data?.completedRides || 0,
      icon: CheckCircle,
      description: "Successfully completed rides",
      color: "text-green-500",
    },
    {
      title: "Pending Rides",
      value: overviewData?.data?.pendingRides || 0,
      icon: Clock,
      description: "Rides awaiting assignment",
      color: "text-yellow-500",
    },
    {
      title: "Cancelled Rides",
      value: overviewData?.data?.cancelledRides || 0,
      icon: XCircle,
      description: "Cancelled rides",
      color: "text-red-500",
    },
  ];

  // Prepare driver status chart data
  const driverStatusData = driverData?.data?.driversByStatus
    ? [
        {
          label: "Pending",
          value: driverData.data.driversByStatus.pending,
          color: "hsl(var(--chart-1))",
        },
        {
          label: "Approved",
          value: driverData.data.driversByStatus.approved,
          color: "hsl(var(--chart-2))",
        },
        {
          label: "Rejected",
          value: driverData.data.driversByStatus.rejected,
          color: "hsl(var(--chart-3))",
        },
      ]
    : [];

  // Prepare driver availability chart data
  const driverAvailabilityData = driverData?.data?.driversByAvailability
    ? [
        {
          label: "Online",
          value: driverData.data.driversByAvailability.online,
        },
        {
          label: "Offline",
          value: driverData.data.driversByAvailability.offline,
        },
      ]
    : [];

  // Prepare ride status chart data
  const rideStatusData = rideData?.data?.ridesByStatus
    ? [
        {
          label: "Requested",
          value: rideData.data.ridesByStatus.requested,
          color: "hsl(var(--chart-1))",
        },
        {
          label: "Accepted",
          value: rideData.data.ridesByStatus.accepted,
          color: "hsl(var(--chart-2))",
        },
        {
          label: "In Transit",
          value: rideData.data.ridesByStatus.in_transit,
          color: "hsl(var(--chart-3))",
        },
        {
          label: "Completed",
          value: rideData.data.ridesByStatus.completed,
          color: "hsl(var(--chart-4))",
        },
        {
          label: "Cancelled",
          value: rideData.data.ridesByStatus.cancelled,
          color: "hsl(45, 93%, 47%)",
        },
      ]
    : [];

  // Prepare rides by time of day chart data
  const ridesByTimeData =
    rideData?.data?.ridesByTimeOfDay?.map((item) => ({
      label: `${item.hour}:00`,
      value: item.count,
    })) || [];

  // Prepare revenue trend data for simple line visualization
  const revenueTrendData =
    revenueData?.data?.[revenuePeriod]?.map((item) => ({
      label: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: item.value,
    })) || [];

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Comprehensive overview of platform performance and statistics
        </p>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <IconComponent className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                {isOverviewLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ) : overviewError ? (
                  <div className="text-red-500 text-sm">Error loading data</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Driver Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Drivers by Status</CardTitle>
            <CardDescription>
              Distribution of driver approval status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isDriverLoading ? (
              <Skeleton className="h-[250px] w-full rounded-lg" />
            ) : driverError ? (
              <div className="text-red-500 text-center py-8">
                Error loading driver analytics
              </div>
            ) : (
              <PieChart data={driverStatusData} size={250} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Driver Availability</CardTitle>
            <CardDescription>Online vs offline drivers</CardDescription>
          </CardHeader>
          <CardContent>
            {isDriverLoading ? (
              <Skeleton className="h-[250px] w-full rounded-lg" />
            ) : driverError ? (
              <div className="text-red-500 text-center py-8">
                Error loading availability data
              </div>
            ) : (
              <BarChart data={driverAvailabilityData} height={250} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Drivers Section */}
      {driverData?.data?.topDriversByRides && (
        <Card>
          <CardHeader>
            <CardTitle>Top Drivers by Rides</CardTitle>
            <CardDescription>
              Most active drivers on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isDriverLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-4 w-20 ml-auto" />
                      <Skeleton className="h-3 w-16 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {driverData.data.topDriversByRides
                  .slice(0, 5)
                  .map((driver, index) => (
                    <div
                      key={driver.driverId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{driver.driverName}</p>
                          <p className="text-sm text-muted-foreground">
                            {driver.totalRides} rides
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${driver.earnings.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">earned</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ride Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rides by Status</CardTitle>
            <CardDescription>
              Current distribution of ride statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRideLoading ? (
              <Skeleton className="h-[250px] w-full rounded-lg" />
            ) : rideError ? (
              <div className="text-red-500 text-center py-8">
                Error loading ride analytics
              </div>
            ) : (
              <PieChart data={rideStatusData} size={250} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rides by Time of Day</CardTitle>
            <CardDescription>Peak hours for ride requests</CardDescription>
          </CardHeader>
          <CardContent>
            {isRideLoading ? (
              <Skeleton className="h-[250px] w-full rounded-lg" />
            ) : rideError ? (
              <div className="text-red-500 text-center py-8">
                Error loading time data
              </div>
            ) : (
              <BarChart
                data={ridesByTimeData}
                height={250}
                showLabels={false}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Ride Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Average Ride Price</CardTitle>
            <CardDescription>Mean price per ride on platform</CardDescription>
          </CardHeader>
          <CardContent>
            {isRideLoading ? (
              <div className="h-8 bg-muted animate-pulse rounded" />
            ) : rideError ? (
              <div className="text-red-500">Error loading data</div>
            ) : (
              <div className="text-3xl font-bold text-emerald-600">
                ${rideData?.data?.averageRidePrice?.toFixed(2) || "0.00"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Distance</CardTitle>
            <CardDescription>Cumulative distance traveled</CardDescription>
          </CardHeader>
          <CardContent>
            {isRideLoading ? (
              <div className="h-8 bg-muted animate-pulse rounded" />
            ) : rideError ? (
              <div className="text-red-500">Error loading data</div>
            ) : (
              <div className="text-3xl font-bold text-blue-600">
                {rideData?.data?.totalDistance?.toLocaleString() || "0"} km
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Revenue over time</CardDescription>
          </div>
          <div className="flex space-x-2">
            {["daily", "weekly", "monthly"].map((period) => (
              <button
                key={period}
                onClick={() =>
                  setRevenuePeriod(period as "daily" | "weekly" | "monthly")
                }
                className={`px-3 py-1 rounded-md text-sm capitalize ${
                  revenuePeriod === period
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {isRevenueLoading ? (
            <Skeleton className="h-[300px] w-full rounded-lg" />
          ) : revenueError ? (
            <div className="text-red-500 text-center py-8">
              Error loading revenue data
            </div>
          ) : (
            <BarChart data={revenueTrendData} height={300} showLabels={false} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
