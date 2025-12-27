import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CardLoader } from '@/components/ui/card-loader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MapPin,
  DollarSign,
  Calendar,
  User,
  Car,
  Route,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { RideStatus } from '@/constants';
import { useGetDriverHistoryQuery } from '@/redux/features/admin/admin-api';
import type { IDriver } from '@/types';
import Pagination from './pagination';

interface DriverHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: IDriver | null;
}

const DriverHistoryModal = ({ open, onOpenChange, driver }: DriverHistoryModalProps) => {
  const [current_page, set_current_page] = useState(1);
  const [status_filter, set_status_filter] = useState<string>('all');

  const { data: historyData, isLoading } = useGetDriverHistoryQuery(
    { 
      driverId: driver?._id || '', 
      page: current_page,
      limit: 10,
      ...(status_filter !== 'all' && { status: status_filter })
    },
    { skip: !driver?._id || !open }
  );

  const getDriverName = () => {
    if (!driver) return 'Unknown Driver';
    if (typeof driver.user === 'object') {
      return driver.user.name;
    }
    return 'Unknown Driver';
  };

  const getDriverEmail = () => {
    if (!driver) return '';
    if (typeof driver.user === 'object') {
      return driver.user.email;
    }
    return '';
  };

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

  const formatLocation = (location: { lat: string; lng: string }) => {
    return `${parseFloat(location.lat).toFixed(4)}, ${parseFloat(location.lng).toFixed(4)}`;
  };

  const handlePageChange = (page: number) => {
    set_current_page(page);
  };

  if (!driver) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <span>Driver History - {getDriverName()}</span>
          </DialogTitle>
          <DialogDescription>
            Complete ride history and performance statistics for this driver
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Driver Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Driver Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="font-medium">{getDriverName()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{getDriverEmail()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vehicle</label>
                  <p className="text-sm">{driver.vehicle?.name} ({driver.vehicle?.model})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experience</label>
                  <p className="text-sm">{driver.experience} years</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          {historyData?.data?.stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Route className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Total Rides</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{historyData.data.stats.totalRides}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{historyData.data.stats.completedRides}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Cancelled</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{historyData.data.stats.cancelledRides}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium">Total Earnings</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">${historyData.data.stats.totalEarnings.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ride History</CardTitle>
              <CardDescription>
                Complete ride history with filtering options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <label className="text-sm font-medium">Filter by Status</label>
                  <select
                    value={status_filter}
                    onChange={(e) => {
                      set_status_filter(e.target.value);
                      set_current_page(1); // Reset to first page when filtering
                    }}
                    className="ml-2 px-3 py-1 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value={RideStatus.COMPLETED}>Completed</option>
                    <option value={RideStatus.CANCELLED}>Cancelled</option>
                    <option value={RideStatus.IN_TRANSIT}>In Transit</option>
                    <option value={RideStatus.ACCEPTED}>Accepted</option>
                  </select>
                </div>
              </div>

              {/* Ride History Table */}
              {isLoading ? (
                <CardLoader message="Loading driver history..." />
              ) : historyData?.data?.rides && historyData.data.rides.length > 0 ? (
                <div className="space-y-4">
                  <ScrollArea className="h-96">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">Ride ID</th>
                            <th className="text-left p-3 font-medium">Rider</th>
                            <th className="text-left p-3 font-medium">Pickup</th>
                            <th className="text-left p-3 font-medium">Destination</th>
                            <th className="text-left p-3 font-medium">Price</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            <th className="text-left p-3 font-medium">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historyData.data.rides.map((ride) => (
                            <tr key={ride._id} className="border-b hover:bg-muted/50">
                              <td className="p-3">
                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                  {ride._id.slice(-8)}
                                </code>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center space-x-2">
                                  <User className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">
                                    {typeof ride.rider === 'object' ? ride.rider.name : 'Unknown'}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3 text-green-500" />
                                  <span className="text-xs font-mono">
                                    {formatLocation(ride.pickupLocation)}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3 text-red-500" />
                                  <span className="text-xs font-mono">
                                    {formatLocation(ride.destination)}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-3 w-3 text-emerald-500" />
                                  <span className="text-sm font-medium">
                                    ${ride.price.toFixed(2)}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">{getStatusBadge(ride.status)}</td>
                              <td className="p-3">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs">
                                    {new Date(ride.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                  
                  {/* Pagination */}
                  {historyData.data.pagination && historyData.data.pagination.totalPages > 1 && (
                    <Pagination
                      page={historyData.data.pagination.page}
                      totalPages={historyData.data.pagination.totalPages}
                      total={historyData.data.pagination.total}
                      limit={historyData.data.pagination.limit}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Route className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No ride history</h3>
                  <p className="text-muted-foreground">
                    {status_filter !== 'all' 
                      ? `No ${status_filter} rides found for this driver`
                      : 'This driver has no completed rides yet'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriverHistoryModal;
