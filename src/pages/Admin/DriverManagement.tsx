import React, { useState, useMemo } from 'react';
import {
  useGetDriversQuery,
  useManageDriverRegistrationMutation,
} from '@/redux/features/driver/driver.api';
import { DriverStatus } from '@/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CardLoader } from '@/components/ui/card-loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GradientBackground } from '@/components/ui/gradient-background';
import { ButtonSpinner } from '@/components/ui/spinner';
import {
  User,
  Car,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import type { IDriver } from '@/types';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function DriverManagement() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [loadingDrivers, setLoadingDrivers] = useState<Record<string, boolean>>(
    {}
  );

  const {
    data: driversResponse,
    isLoading,
    error,
  } = useGetDriversQuery(undefined);
  const [manageDriverRegistration] = useManageDriverRegistrationMutation();

  const drivers = useMemo(
    () => driversResponse?.data || [],
    [driversResponse?.data]
  );

  // Filter drivers based on status
  const filteredDrivers = useMemo(() => {
    if (statusFilter === 'all') return drivers;
    return drivers.filter((driver) => driver.driverStatus === statusFilter);
  }, [drivers, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = drivers.length;
    const pending = drivers.filter(
      (d) => d.driverStatus === DriverStatus.PENDING
    ).length;
    const approved = drivers.filter(
      (d) => d.driverStatus === DriverStatus.APPROVED
    ).length;
    const rejected = drivers.filter(
      (d) => d.driverStatus === DriverStatus.REJECTED
    ).length;

    return { total, pending, approved, rejected };
  }, [drivers]);

  const handleStatusUpdate = async (
    driverId: string,
    newStatus: 'approved' | 'rejected'
  ) => {
    try {
      setLoadingDrivers((prev) => ({ ...prev, [driverId]: true }));

      await manageDriverRegistration({
        id: driverId,
        status: { driverStatus: newStatus },
      }).unwrap();

      toast.success(`Driver ${newStatus} successfully`);
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'data' in error
          ? (error.data as { message?: string })?.message ||
            `Failed to ${newStatus} driver`
          : `Failed to ${newStatus} driver`;
      toast.error(message);
    } finally {
      setLoadingDrivers((prev) => ({ ...prev, [driverId]: false }));
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case DriverStatus.APPROVED:
        return 'default';
      case DriverStatus.PENDING:
        return 'secondary';
      case DriverStatus.REJECTED:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case DriverStatus.APPROVED:
        return <CheckCircle className="w-4 h-4" />;
      case DriverStatus.PENDING:
        return <Clock className="w-4 h-4" />;
      case DriverStatus.REJECTED:
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatUserName = (user: string | { name?: string }) => {
    if (typeof user === 'string') return 'N/A';
    return user?.name || 'N/A';
  };

  const formatUserEmail = (user: string | { email?: string }) => {
    if (typeof user === 'string') return 'N/A';
    return user?.email || 'N/A';
  };

  if (isLoading) {
    return (
      <GradientBackground>
        <div className="container mx-auto px-4 py-8">
          <CardLoader message="Loading driver registrations..." />
        </div>
      </GradientBackground>
    );
  }

  if (error) {
    return (
      <GradientBackground>
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="w-5 h-5" />
                <span>Failed to load driver registrations</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Driver Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Review and manage driver registration requests
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Drivers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-4/10 rounded-lg">
                  <Clock className="w-5 h-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">
                    Pending Review
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-1/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by status:</span>
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value: StatusFilter) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Driver Cards */}
        <div className="space-y-6">
          {filteredDrivers.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {statusFilter === 'all'
                      ? 'No driver registrations found'
                      : `No ${statusFilter} drivers found`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredDrivers.map((driver) => (
              <DriverCard
                key={driver._id}
                driver={driver}
                onStatusUpdate={handleStatusUpdate}
                isLoading={loadingDrivers[driver._id] || false}
                getStatusBadgeVariant={getStatusBadgeVariant}
                getStatusIcon={getStatusIcon}
                formatUserName={formatUserName}
                formatUserEmail={formatUserEmail}
              />
            ))
          )}
        </div>
      </div>
    </GradientBackground>
  );
}

// Separate component for individual driver cards
interface DriverCardProps {
  driver: IDriver;
  onStatusUpdate: (
    driverId: string,
    status: 'approved' | 'rejected'
  ) => Promise<void>;
  isLoading: boolean;
  getStatusBadgeVariant: (
    status: string
  ) => 'default' | 'secondary' | 'destructive' | 'outline';
  getStatusIcon: (status: string) => React.ReactElement;
  formatUserName: (user: string | { name?: string }) => string;
  formatUserEmail: (user: string | { email?: string }) => string;
}

function DriverCard({
  driver,
  onStatusUpdate,
  isLoading,
  getStatusBadgeVariant,
  getStatusIcon,
  formatUserName,
  formatUserEmail,
}: DriverCardProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {formatUserName(driver.user)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatUserEmail(driver.user)}
            </p>
          </div>
          <Badge
            variant={getStatusBadgeVariant(driver.driverStatus)}
            className="flex items-center gap-1"
          >
            {getStatusIcon(driver.driverStatus)}
            {driver.driverStatus.charAt(0).toUpperCase() +
              driver.driverStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Vehicle Information */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Car className="w-4 h-4 text-chart-2" />
            Vehicle Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <div>
              <p className="text-sm text-muted-foreground">Vehicle Name</p>
              <p className="font-medium">{driver.vehicle?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Model</p>
              <p className="font-medium">{driver.vehicle?.model || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Seat Count</p>
              <p className="font-medium">
                {driver.vehicle?.seatCount || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-chart-3" />
            Experience
          </h4>
          <div className="pl-6">
            <p className="font-medium">
              {driver.experience} {driver.experience === 1 ? 'year' : 'years'}{' '}
              of driving experience
            </p>
          </div>
        </div>

        {/* Registration Date */}
        <div className="space-y-3">
          <div className="pl-6">
            <p className="text-sm text-muted-foreground">
              Registered on{' '}
              {new Date(driver.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {driver.driverStatus === DriverStatus.PENDING && (
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => onStatusUpdate(driver._id, 'approved')}
              disabled={isLoading}
              className="flex-1"
              variant="default"
            >
              {isLoading ? (
                <ButtonSpinner />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Approve
            </Button>
            <Button
              onClick={() => onStatusUpdate(driver._id, 'rejected')}
              disabled={isLoading}
              className="flex-1"
              variant="destructive"
            >
              {isLoading ? (
                <ButtonSpinner />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
