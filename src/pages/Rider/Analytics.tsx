import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardLoader } from "@/components/ui/card-loader";
import { GradientBackground } from "@/components/ui/gradient-background";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetRiderAnalyticsQuery } from "@/redux/features/analytics/analytics.api";
import {
  BarChart3,
  Calendar,
  DollarSign,
  MapPin,
  RefreshCw,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type PeriodType = "daily" | "weekly" | "monthly" | "yearly";

export default function Analytics() {
  const [period, setPeriod] = useState<PeriodType>("monthly");

  const {
    data: analyticsResponse,
    isLoading,
    error,
    refetch,
  } = useGetRiderAnalyticsQuery({ period });

  const analytics = useMemo(
    () => analyticsResponse?.data,
    [analyticsResponse?.data],
  );

  // Prepare chart data
  const spendingChartData = useMemo(() => {
    if (!analytics?.spendingTrends) return [];

    return analytics.spendingTrends.map((trend) => ({
      label: `${trend._id.year}-${String(trend._id.month).padStart(2, "0")}`,
      value: trend.totalSpent,
      color: `hsl(var(--chart-1))`,
    }));
  }, [analytics?.spendingTrends]);

  const rideStatusData = useMemo(() => {
    if (!analytics?.overview) return [];

    return [
      {
        label: "Completed",
        value: analytics.overview.completedRides,
        color: `hsl(var(--chart-1))`,
      },
      {
        label: "Cancelled",
        value: analytics.overview.cancelledRides,
        color: `hsl(var(--destructive))`,
      },
      {
        label: "Total",
        value: analytics.overview.totalRides,
        color: `hsl(var(--chart-2))`,
      },
    ];
  }, [analytics?.overview]);

  const ratingDistributionData = useMemo(() => {
    if (!analytics?.driverRatings?.ratingDistribution) return [];

    return Object.entries(analytics.driverRatings.ratingDistribution).map(
      ([rating, count]) => ({
        label: `${rating} Star${rating !== "1" ? "s" : ""}`,
        value: count as number,
        color: `hsl(var(--chart-${rating}))`,
      }),
    );
  }, [analytics?.driverRatings?.ratingDistribution]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <GradientBackground className="rounded-3xl">
          <Card className="bg-card/95 backdrop-blur-sm border shadow-2xl rounded-3xl">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-destructive/10 rounded-full">
                  <X className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Failed to Load Analytics
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't load your analytics data. Please try again.
                  </p>
                  <Button onClick={() => refetch()} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </GradientBackground>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <GradientBackground className="rounded-3xl">
        <Card className="bg-card/95 backdrop-blur-sm border shadow-2xl rounded-3xl">
          <CardHeader className="border-b relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative flex items-center justify-between">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold">
                <div className="relative p-3 bg-card rounded-2xl shadow-lg border">
                  <BarChart3 className="h-7 w-7 text-primary" />
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-sm" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Analytics Dashboard</div>
                  <div className="text-sm font-normal text-muted-foreground mt-1">
                    Track your riding patterns and spending insights
                  </div>
                </div>
              </CardTitle>
              <div className="flex items-center gap-4">
                <Select
                  value={period}
                  onValueChange={(value) => setPeriod(value as PeriodType)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Overview Stats */}
          <CardContent className="p-8">
            {isLoading ? (
              <CardLoader message="Loading your analytics..." />
            ) : analytics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-muted/50 rounded-2xl p-6 border backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold">Total Rides</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {analytics.overview.totalRides}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {analytics.overview.completionRate}% completion rate
                  </div>
                </div>

                <div className="bg-muted/50 rounded-2xl p-6 border backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-chart-1/10 rounded-xl">
                      <DollarSign className="h-5 w-5 text-chart-1" />
                    </div>
                    <span className="font-semibold">Total Spent</span>
                  </div>
                  <div className="text-3xl font-bold text-chart-1">
                    ${analytics.overview.totalSpent.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Avg: ${analytics.overview.averageRideCost.toFixed(2)}/ride
                  </div>
                </div>

                <div className="bg-muted/50 rounded-2xl p-6 border backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-chart-2/10 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-chart-2" />
                    </div>
                    <span className="font-semibold">Completed</span>
                  </div>
                  <div className="text-3xl font-bold text-chart-2">
                    {analytics.overview.completedRides}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {analytics.overview.cancelledRides} cancelled
                  </div>
                </div>

                <div className="bg-muted/50 rounded-2xl p-6 border backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-chart-3/10 rounded-xl">
                      <Star className="h-5 w-5 text-chart-3" />
                    </div>
                    <span className="font-semibold">Avg Rating</span>
                  </div>
                  <div className="text-3xl font-bold text-chart-3">
                    {analytics.driverRatings.averageRating.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {analytics.driverRatings.totalReviews} reviews
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </GradientBackground>

      {/* Charts Section */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spending Trends */}
          <Card className="bg-card/95 backdrop-blur-sm border shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Spending Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={spendingChartData}
                height={300}
                showLabels={true}
                // showValues={true}
              />
            </CardContent>
          </Card>

          {/* Ride Status Distribution */}
          <Card className="bg-card/95 backdrop-blur-sm border shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Ride Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={rideStatusData} size={250} showLabels={true} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Driver Ratings */}
          <Card className="bg-card/95 backdrop-blur-sm border shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Driver Ratings Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={ratingDistributionData}
                height={250}
                showLabels={true}
                showValues={true}
              />
            </CardContent>
          </Card>

          {/* Favorite Locations */}
          <Card className="bg-card/95 backdrop-blur-sm border shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Favorite Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Top Pickup Locations</h4>
                <div className="space-y-2">
                  {analytics.favoriteLocations.pickupLocations
                    .slice(0, 3)
                    .map((location, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            {location.location.lat}, {location.location.lng}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {location.count} rides
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Top Destinations</h4>
                <div className="space-y-2">
                  {analytics.favoriteLocations.destinationLocations
                    .slice(0, 3)
                    .map((location, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-destructive" />
                          <span className="text-sm">
                            {location.location.lat}, {location.location.lng}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {location.count} rides
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Reviews */}
      {analytics?.driverRatings?.recentReviews &&
        analytics.driverRatings.recentReviews.length > 0 && (
          <Card className="bg-card/95 backdrop-blur-sm border shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Recent Driver Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.driverRatings.recentReviews.map((review, index) => (
                  <div
                    key={index}
                    className="p-4 bg-muted/50 rounded-xl border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{review.driverName}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {review.comment}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Recent Ride History */}
      {analytics?.rideHistory && analytics.rideHistory.length > 0 && (
        <Card className="bg-card/95 backdrop-blur-sm border shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Rides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.rideHistory.slice(0, 5).map((ride) => (
                <div
                  key={ride._id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">
                        Ride #{ride._id.slice(-8)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {ride.driverName} •{" "}
                        {new Date(ride.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${ride.price}</div>
                    <Badge
                      className={cn(
                        "text-xs",
                        ride.status === "completed"
                          ? "bg-chart-1 text-primary-foreground"
                          : ride.status === "cancelled"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-chart-2 text-primary-foreground",
                      )}
                    >
                      {ride.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
