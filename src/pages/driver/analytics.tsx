import BarChart from "@/components/charts/bar-chart";
import PieChart from "@/components/charts/pie-chart";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardLoader } from "@/components/ui/card-loader";
import { useGetDriverAnalyticsQuery } from "@/redux/features/analytics/analytics-api";
import {
  Calendar,
  Car,
  CheckCircle,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { formatPeriodDateLabel } from "@/utils/date-utils";

const Analytics = () => {
  const [period, setPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");

  const {
    data: analyticsData,
    isLoading,
    error,
  } = useGetDriverAnalyticsQuery({ period });

  // Overview stats cards data
  const overviewCards = [
    {
      title: "Total Rides",
      value: analyticsData?.data?.overview?.totalRides || 0,
      icon: Car,
      description: "Total rides completed",
      color: "text-blue-600",
    },
    {
      title: "Completed Rides",
      value: analyticsData?.data?.overview?.completedRides || 0,
      icon: CheckCircle,
      description: "Successfully completed rides",
      color: "text-green-600",
    },
    {
      title: "Cancelled Rides",
      value: analyticsData?.data?.overview?.cancelledRides || 0,
      icon: XCircle,
      description: "Cancelled rides",
      color: "text-red-600",
    },
    {
      title: "Total Earnings",
      value: `$${analyticsData?.data?.overview?.totalEarnings?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      description: "Total earnings from rides",
      color: "text-emerald-600",
    },
    {
      title: "Average Earnings",
      value: `$${analyticsData?.data?.overview?.averageRideEarnings?.toFixed(2) || "0.00"}`,
      icon: TrendingUp,
      description: "Average earnings per ride",
      color: "text-purple-600",
    },
    {
      title: "Completion Rate",
      value: `${analyticsData?.data?.overview?.completionRate?.toFixed(1) || "0.0"}%`,
      icon: CheckCircle,
      description: "Ride completion percentage",
      color: "text-indigo-600",
    },
  ];

  // Prepare earnings trend data for chart
  const earningsTrendData =
    analyticsData?.data?.earningsTrends?.map((trend) => ({
      label: formatPeriodDateLabel(trend._id.year, trend._id.month, period),
      value: trend.totalEarnings,
    })) || [];

  // Prepare rating distribution data for pie chart
  const ratingDistributionData = analyticsData?.data?.riderRatings
    ?.ratingDistribution
    ? Object.entries(analyticsData.data.riderRatings.ratingDistribution).map(
        ([rating, count]) => ({
          label: `${rating} Star${rating !== "1" ? "s" : ""}`,
          value: count as number,
          color:
            rating === "5"
              ? "#3b82f6" // blue-500
              : rating === "4"
                ? "#10b981" // emerald-500
                : rating === "3"
                  ? "#8b5cf6" // violet-500
                  : rating === "2"
                    ? "#f59e0b" // amber-500
                    : "#ef4444", // red-500
        }),
      )
    : [];

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      case "in_transit":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Driver Analytics</h1>
        <p className="text-muted-foreground">
          Track your performance, earnings, and rider feedback
        </p>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-8 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  </div>
                ) : error ? (
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Trend Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Earnings Trend</CardTitle>
              <CardDescription>Your earnings over time</CardDescription>
            </div>
            <div className="flex space-x-2">
              {["monthly", "weekly", "daily"].map((periodOption) => (
                <button
                  key={periodOption}
                  onClick={() =>
                    setPeriod(
                      periodOption as "daily" | "weekly" | "monthly" | "yearly",
                    )
                  }
                  className={`px-3 py-1 rounded-md text-sm capitalize ${
                    period === periodOption
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {periodOption}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <CardLoader message="Loading earnings data..." />
            ) : error ? (
              <div className="text-red-500 text-center py-8">
                Error loading earnings trend
              </div>
            ) : (
              <BarChart
                data={earningsTrendData}
                height={250}
                showLabels={true}
              />
            )}
          </CardContent>
        </Card>

        {/* Rating Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Rider Ratings</CardTitle>
            <CardDescription>Distribution of ratings received</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <CardLoader message="Loading ratings..." />
            ) : error ? (
              <div className="text-red-500 text-center py-8">
                Error loading ratings
              </div>
            ) : analyticsData?.data?.riderRatings ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">
                    {analyticsData.data.riderRatings.averageRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({analyticsData.data.riderRatings.totalReviews} reviews)
                  </span>
                </div>
                <PieChart data={ratingDistributionData} size={200} />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No ratings available yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews Section */}
      {analyticsData?.data?.riderRatings?.recentReviews &&
        analyticsData.data.riderRatings.recentReviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>
                Latest feedback from your riders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <CardLoader message="Loading reviews..." />
              ) : (
                <div className="space-y-4">
                  {analyticsData.data.riderRatings.recentReviews
                    .slice(0, 5)
                    .map((review, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 border rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                            {review.riderName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {review.riderName}
                              </span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, starIndex) => (
                                  <Star
                                    key={starIndex}
                                    className={`h-4 w-4 ${
                                      starIndex < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-muted-foreground">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

      {/* Recent Rides Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Rides</CardTitle>
          <CardDescription>Your latest ride history</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <CardLoader message="Loading ride history..." />
          ) : error ? (
            <div className="text-red-500 text-center py-8">
              Error loading ride history
            </div>
          ) : analyticsData?.data?.rideHistory &&
            analyticsData.data.rideHistory.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.data.rideHistory.slice(0, 10).map((ride) => (
                <div
                  key={ride._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Badge variant={getStatusBadgeVariant(ride.status)}>
                        {ride.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{ride.riderName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(ride.createdAt).toLocaleDateString()} at{" "}
                          {new Date(ride.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${ride.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No rides available yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
