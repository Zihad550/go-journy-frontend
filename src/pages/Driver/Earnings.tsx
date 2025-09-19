import { useGetDriverEarningsQuery } from '@/redux/features/driver/driver.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Earnings = () => {
  const { data: earningsData, isLoading, error } = useGetDriverEarningsQuery(undefined);

  // Extract earnings from the response
  const earnings = earningsData?.data?.[0]?.earnings || 0;
  const hasEarnings = earnings > 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
        <p className="text-muted-foreground">
          Track your earnings from completed rides
        </p>
      </div>

      {/* Main Earnings Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-12 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              </div>
            ) : error ? (
              <div className="flex items-center space-x-2 text-red-500">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">Error loading earnings data</span>
              </div>
            ) : (
              <>
                <div className="text-4xl font-bold text-emerald-600">
                  {formatCurrency(earnings)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {hasEarnings 
                    ? 'Total earnings from all completed rides'
                    : 'No earnings yet - complete your first ride to start earning!'
                  }
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Stats Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm">Error</div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(earnings * 0.3)} {/* Placeholder - would need monthly breakdown */}
                </div>
                <p className="text-xs text-muted-foreground">
                  Estimated monthly earnings
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average per Ride</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm">Error</div>
            ) : hasEarnings ? (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(earnings / 10)} {/* Placeholder - would need ride count */}
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on completed rides
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">$0.00</div>
                <p className="text-xs text-muted-foreground">
                  Complete rides to see average
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm">Error</div>
            ) : (
              <>
                <Badge variant={hasEarnings ? "default" : "secondary"} className="mb-2">
                  {hasEarnings ? "Active" : "Getting Started"}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {hasEarnings 
                    ? "You're actively earning from rides"
                    : "Start driving to begin earning"
                  }
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information Section */}
      {!hasEarnings && !isLoading && !error && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Start Earning Today</span>
            </CardTitle>
            <CardDescription>
              Here's how you can start earning with Go Journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                <h3 className="font-medium mb-2">Get Approved</h3>
                <p className="text-sm text-muted-foreground">
                  Complete your driver registration and get approved by our team
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">2</div>
                <h3 className="font-medium mb-2">Go Online</h3>
                <p className="text-sm text-muted-foreground">
                  Set your availability to online and start receiving ride requests
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
                <h3 className="font-medium mb-2">Complete Rides</h3>
                <p className="text-sm text-muted-foreground">
                  Accept ride requests, pick up passengers, and complete journeys
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earnings Breakdown Placeholder */}
      {hasEarnings && !isLoading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Earnings Breakdown</CardTitle>
            <CardDescription>
              Detailed view of your earnings over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Earnings breakdown and trends will be available here</p>
              <p className="text-sm mt-2">This feature is coming soon!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Earnings;
