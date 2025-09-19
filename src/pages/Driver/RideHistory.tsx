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
import { useGetRidesQuery } from "@/redux/features/ride/ride.api";
import type { IRide } from "@/types";
import {
  Calendar,
  Car,
  CheckCircle,
  Clock,
  Filter,
  Route,
  Search,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type SortOption = "date-desc" | "date-asc" | "price-desc" | "price-asc";
type FilterOption =
  | "all"
  | "requested"
  | "accepted"
  | "in_transit"
  | "completed"
  | "cancelled";

export default function RideHistory() {
  const {
    data: ridesResponse,
    isLoading,
    error,
    refetch,
  } = useGetRidesQuery(undefined);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const rides = useMemo(() => ridesResponse?.data || [], [ridesResponse?.data]);

  // Filter and sort rides
  const filteredAndSortedRides = useMemo(() => {
    let filtered = rides;

    // Apply status filter
    if (filterBy !== "all") {
      filtered = filtered.filter((ride) => ride.status === filterBy);
    }

    // Apply search filter (search in ride ID, price, or status)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ride) =>
          ride._id.toLowerCase().includes(searchLower) ||
          ride.status.toLowerCase().includes(searchLower) ||
          ride.price.toString().includes(searchLower),
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-desc": {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          // Handle invalid dates
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0;
          }
          return dateB.getTime() - dateA.getTime();
        }
        case "date-asc": {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          // Handle invalid dates
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0;
          }
          return dateA.getTime() - dateB.getTime();
        }
        case "price-desc": {
          const priceA = Number(a.price);
          const priceB = Number(b.price);
          return priceB - priceA;
        }
        case "price-asc": {
          const priceA = Number(a.price);
          const priceB = Number(b.price);
          return priceA - priceB;
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [rides, filterBy, searchTerm, sortBy]);

  const stats = useMemo(
    () => ({
      total: rides.length,
      completed: rides.filter((r) => r.status === "completed").length,
      cancelled: rides.filter((r) => r.status === "cancelled").length,
      inProgress: rides.filter((r) =>
        ["requested", "accepted", "in_transit"].includes(r.status),
      ).length,
    }),
    [rides],
  );

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
                    Failed to Load Rides
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't load your ride history. Please try again.
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
                  <Car className="h-7 w-7 text-primary" />
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-sm" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Driving History</div>
                  <div className="text-sm font-normal text-muted-foreground mt-1">
                    Track all rides you've driven
                  </div>
                </div>
              </CardTitle>
            </div>
          </CardHeader>

          {/* Stats Cards */}
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-muted/50 rounded-2xl p-6 border backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Route className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold">Total Rides</span>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {stats.total}
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 border backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-chart-1/10 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-chart-1" />
                  </div>
                  <span className="font-semibold">Completed</span>
                </div>
                <div className="text-3xl font-bold text-chart-1">
                  {stats.completed}
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 border backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-chart-2/10 rounded-xl">
                    <Car className="h-5 w-5 text-chart-2" />
                  </div>
                  <span className="font-semibold">In Progress</span>
                </div>
                <div className="text-3xl font-bold text-chart-2">
                  {stats.inProgress}
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 border backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-destructive/10 rounded-xl">
                    <X className="h-5 w-5 text-destructive" />
                  </div>
                  <span className="font-semibold">Cancelled</span>
                </div>
                <div className="text-3xl font-bold text-destructive">
                  {stats.cancelled}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </GradientBackground>

      {/* Filters and Search */}
      <Card className="bg-card/95 backdrop-blur-sm border shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search rides by ID, status, or price..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filterBy}
                onValueChange={(value) => setFilterBy(value as FilterOption)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rides</SelectItem>
                  <SelectItem value="requested">Requested</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              {sortBy.includes("desc") ? (
                <SortDesc className="h-4 w-4 text-muted-foreground" />
              ) : (
                <SortAsc className="h-4 w-4 text-muted-foreground" />
              )}
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="price-desc">Highest Price</SelectItem>
                  <SelectItem value="price-asc">Lowest Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rides List */}
      {isLoading ? (
        <CardLoader message="Loading your driving history..." />
      ) : filteredAndSortedRides.length === 0 ? (
        <GradientBackground className="rounded-3xl">
          <Card className="bg-card/95 backdrop-blur-sm border shadow-2xl rounded-3xl">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-muted/50 rounded-full">
                  <Route className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">No Rides Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterBy !== "all"
                      ? "No rides match your current filters. Try adjusting your search or filter criteria."
                      : "You haven't driven any rides yet. Start accepting rides to build your history!"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </GradientBackground>
      ) : (
        <div className="space-y-6">
          {filteredAndSortedRides.map((ride) => (
            <RideHistoryCard key={ride._id} ride={ride} />
          ))}
        </div>
      )}
    </div>
  );
}

interface RideHistoryCardProps {
  ride: IRide;
}

function RideHistoryCard({ ride }: RideHistoryCardProps) {
  const statusConfig = {
    requested: {
      color: "bg-chart-4 text-primary-foreground shadow-lg shadow-chart-4/25",
      icon: <Clock className="h-4 w-4" />,
    },
    accepted: {
      color: "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    in_transit: {
      color: "bg-chart-2 text-primary-foreground shadow-lg shadow-chart-2/25",
      icon: <Car className="h-4 w-4" />,
    },
    completed: {
      color: "bg-chart-1 text-primary-foreground shadow-lg shadow-chart-1/25",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    cancelled: {
      color:
        "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25",
      icon: <X className="h-4 w-4" />,
    },
  };

  const config =
    statusConfig[ride.status as keyof typeof statusConfig] ||
    statusConfig.requested;

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDate(ride.createdAt);

  return (
    <Card className="bg-card/95 backdrop-blur-sm border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Left: Route Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Route className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">
                    Ride #{ride._id.slice(-8)}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {date} at {time}
                  </div>
                </div>
              </div>
              <Badge
                className={cn(
                  "px-3 py-1 text-sm font-semibold rounded-xl border-0",
                  config.color,
                )}
              >
                {config.icon}
                <span className="ml-2">
                  {ride.status.charAt(0).toUpperCase() +
                    ride.status.slice(1).replace("_", " ")}
                </span>
              </Badge>
            </div>

            {/* Route Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Pickup</div>
                  <div className="font-mono text-sm">
                    {ride.pickupLocation?.lat}, {ride.pickupLocation?.lng}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">
                    Destination
                  </div>
                  <div className="font-mono text-sm">
                    {ride.destination?.lat}, {ride.destination?.lng}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Price and Actions */}
          <div className="flex flex-col items-end gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                ${ride.price}
              </div>
              <div className="text-sm text-muted-foreground">Total fare</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
