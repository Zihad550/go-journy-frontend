import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardLoader } from "@/components/ui/card-loader";
import { DriverAvailabilityControl } from "@/components/ui/driver-availability-control";
import { NotFound } from "@/components/ui/not-found";
import { DriverStatus } from "@/constants/driver.constant";
import { useGetDriverProfileQuery } from "@/redux/features/driver/driver.api";
import { Calendar, Car, CheckCircle, Clock, User, XCircle } from "lucide-react";
import { Link } from "react-router";

export function DriverProfile() {
  const {
    data: driverProfile,
    isLoading,
    error,
    refetch,
  } = useGetDriverProfileQuery(undefined);

  if (isLoading) {
    return (
      <CardLoader
        message="Loading driver profile..."
        className="min-h-[400px]"
      />
    );
  }

  if (error || !driverProfile?.data) {
    return (
      <div className="space-y-4">
        <NotFound
          variant="info"
          title="No Driver Profile Found"
          message="You haven't registered as a driver yet. Complete your driver registration to access driver features."
          showRetry={true}
          showGoBack={false}
          onRetry={refetch}
        />
        <div className="text-center">
          <Button asChild>
            <Link to="/driver-registration">
              <Car className="h-4 w-4 mr-2" />
              Register as Driver
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const driver = driverProfile.data;
  const user = typeof driver.user === "object" ? driver.user : null;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case DriverStatus.APPROVED:
        return {
          icon: CheckCircle,
          color: "bg-chart-1 text-chart-1-foreground",
          label: "Approved",
          description:
            "Your driver application has been approved. You can now accept ride requests.",
        };
      case DriverStatus.PENDING:
        return {
          icon: Clock,
          color: "bg-chart-4 text-chart-4-foreground",
          label: "Pending Review",
          description:
            "Your driver application is under review. We'll notify you once it's processed.",
        };
      case DriverStatus.REJECTED:
        return {
          icon: XCircle,
          color: "bg-destructive text-destructive-foreground",
          label: "Rejected",
          description:
            "Your driver application was rejected. You can reapply with updated information.",
        };
      default:
        return {
          icon: Clock,
          color: "bg-muted text-muted-foreground",
          label: "Unknown",
          description: "Status information unavailable.",
        };
    }
  };

  const statusInfo = getStatusInfo(driver.driverStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Driver Status Section */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Driver Status</h3>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={statusInfo.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {statusInfo.description}
            </p>
          </div>

          {/* Driver Availability Control - Only show for approved drivers */}
          {driver.driverStatus === DriverStatus.APPROVED && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-2">Availability</p>
              <DriverAvailabilityControl
                currentAvailability={driver.availability}
                driverId={driver._id}
              />
            </div>
          )}
        </div>

        {/* Registration Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Registered on {new Date(driver.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Driver Information */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Personal Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <p className="text-sm">{user?.name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="text-sm">{user?.email || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Phone
              </label>
              <p className="text-sm">{user?.phone || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Driving Experience
              </label>
              <p className="text-sm">
                {driver.experience} {driver.experience === 1 ? "year" : "years"}
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Car className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Vehicle Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Vehicle Name
              </label>
              <p className="text-sm">{driver.vehicle?.name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Model
              </label>
              <p className="text-sm">{driver.vehicle?.model || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Seat Count
              </label>
              <p className="text-sm">
                {driver.vehicle?.seatCount || "N/A"} passengers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {driver.driverStatus === DriverStatus.APPROVED && (
          <Button asChild>
            <Link to="/driver">
              <CheckCircle className="h-4 w-4 mr-2" />
              Go to Driver Dashboard
            </Link>
          </Button>
        )}

        {driver.driverStatus === DriverStatus.REJECTED && (
          <Button asChild variant="outline">
            <Link to="/driver-registration">
              <Car className="h-4 w-4 mr-2" />
              Reapply as Driver
            </Link>
          </Button>
        )}

        <Button asChild variant="outline">
          <Link to="/driver-registration">
            <User className="h-4 w-4 mr-2" />
            Update Driver Information
          </Link>
        </Button>
      </div>
    </div>
  );
}
