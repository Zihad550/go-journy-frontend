import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MapPin,
  User,
  Car,
  Clock,
  FileText,
  History,
  Settings,
  UserPlus,
  Trash2
} from 'lucide-react';
import { RideStatus } from '@/constants';
import type { IAdminRide } from '@/types';

interface RideDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ride: IAdminRide | null;
  onStatusUpdate?: () => void;
  onAssignDriver?: () => void;
  onDelete?: () => void;
}

const RideDetailsModal = ({
  open,
  onOpenChange,
  ride,
  onStatusUpdate,
  onAssignDriver,
  onDelete
}: RideDetailsModalProps) => {
  if (!ride) return null;

  const formatLocation = (location: { lat: string; lng: string }) => {
    return `${parseFloat(location.lat).toFixed(4)}, ${parseFloat(location.lng).toFixed(4)}`;
  };

  const getRiderName = (rider: string | { name: string; email: string }) => {
    return typeof rider === 'object' ? rider.name : 'Unknown';
  };

  const getRiderEmail = (rider: string | { name: string; email: string }) => {
    return typeof rider === 'object' ? rider.email : '';
  };

  const getDriverName = (driver?: string | { user: string | { name: string; email: string } }) => {
    if (!driver) return 'Not Assigned';
    if (typeof driver === 'object' && driver.user) {
      return typeof driver.user === 'object' ? driver.user.name : 'Unknown';
    }
    return 'Unknown';
  };

  const getDriverEmail = (driver?: string | { user: string | { name: string; email: string } }) => {
    if (!driver || typeof driver !== 'object') return '';
    if (driver.user && typeof driver.user === 'object') {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <span>Ride Details</span>
            {getStatusBadge(ride.status)}
          </DialogTitle>
          <DialogDescription>
            Comprehensive ride information and admin controls
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 <div>
                   <label className="text-sm font-medium text-muted-foreground">Ride ID</label>
                   <p className="font-mono text-sm mt-1 break-all">{ride._id}</p>
                 </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(ride.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Price</label>
                  <p className="text-lg font-semibold text-emerald-600 mt-1">${ride.price.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                  <p className="mt-1">{new Date(ride.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="mt-1">{new Date(ride.updatedAt).toLocaleString()}</p>
                </div>
                {ride.pickupTime && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Pickup Time</label>
                    <p className="mt-1">{new Date(ride.pickupTime).toLocaleString()}</p>
                  </div>
                )}
                {ride.dropoffTime && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dropoff Time</label>
                    <p className="mt-1">{new Date(ride.dropoffTime).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium flex items-center space-x-2 mb-3">
                    <User className="h-4 w-4" />
                    <span>Rider Information</span>
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p>{getRiderName(ride.rider)}</p>
                    </div>
                    {getRiderEmail(ride.rider) && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p>{getRiderEmail(ride.rider)}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center space-x-2 mb-3">
                    <Car className="h-4 w-4" />
                    <span>Driver Information</span>
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p>{getDriverName(ride.driver)}</p>
                    </div>
                    {getDriverEmail(ride.driver) && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p>{getDriverEmail(ride.driver)}</p>
                      </div>
                    )}
                    {typeof ride.driver === 'object' && ride.driver?.vehicle && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Vehicle</label>
                        <p>{ride.driver.vehicle.name} ({ride.driver.vehicle.model})</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Route Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium flex items-center space-x-2 mb-3">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span>Pickup Location</span>
                  </h4>
                  <p className="font-mono text-sm">{formatLocation(ride.pickupLocation)}</p>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center space-x-2 mb-3">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span>Destination</span>
                  </h4>
                  <p className="font-mono text-sm">{formatLocation(ride.destination)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interested Drivers */}
          {ride.interestedDrivers && ride.interestedDrivers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interested Drivers</CardTitle>
                <CardDescription>
                  {ride.interestedDrivers.length} driver(s) showed interest in this ride
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {ride.interestedDrivers.length} drivers expressed interest in this ride
                </p>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          {ride.adminNotes && ride.adminNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Admin Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <div className="space-y-4">
                    {ride.adminNotes.map((note, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{note.createdBy.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{note.note}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Status History */}
          {ride.statusHistory && ride.statusHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <History className="h-4 w-4" />
                  <span>Status History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <div className="space-y-4">
                    {ride.statusHistory.map((entry, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(entry.status)}
                            <span className="text-sm font-medium">{entry.changedBy.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(entry.changedAt).toLocaleString()}
                          </p>
                          {entry.reason && (
                            <p className="text-sm mt-2">{entry.reason}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Admin Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {onStatusUpdate && ride.status !== RideStatus.COMPLETED && (
                  <Button onClick={onStatusUpdate} variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Update Status
                  </Button>
                )}
                 {onAssignDriver && ride.status === RideStatus.REQUESTED && (
                   <Button onClick={onAssignDriver} variant="outline">
                     <UserPlus className="h-4 w-4 mr-2" />
                     Assign Driver
                   </Button>
                 )}
                 {onDelete && (
                  <Button onClick={onDelete} variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Force Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RideDetailsModal;
