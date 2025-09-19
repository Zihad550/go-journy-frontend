import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonSpinner } from '@/components/ui/spinner';
import { useUpdateRideStatusMutation } from '@/redux/features/ride/ride.api';
import { RideStatus } from '@/constants';
import { toast } from 'sonner';
import { Play, Settings } from 'lucide-react';
import type { IRide } from '@/types';

interface DriverActionPanelProps {
  ride: IRide;
  onRideStatusChanged: (newStatus: string) => void;
}

export function DriverActionPanel({
  ride,
  onRideStatusChanged,
}: DriverActionPanelProps) {
  const [updateRideStatus, { isLoading: isUpdatingStatus }] =
    useUpdateRideStatusMutation();

  const handleStartTrip = async () => {
    try {
      const result = await updateRideStatus({
        id: ride._id,
        status: { status: RideStatus.IN_TRANSIT },
      }).unwrap();

      toast.success('🚗 Trip started successfully!', {
        description: 'You can now navigate to the destination.',
      });

      if (result.data) {
        onRideStatusChanged(result.data.status);
      }
    } catch {
      toast.error('Failed to start trip', {
        description:
          'Please try again or contact support if the issue persists.',
      });
    }
  };

  // Note: Drivers cannot complete rides - only riders can complete rides
  // Note: Drivers cannot cancel rides - cancellation functionality removed

  const getActionButtons = () => {
    const buttons = [];

    // Start Trip button for accepted rides
    if (ride.status === RideStatus.ACCEPTED) {
      buttons.push(
        <Button
          key="start-trip"
          onClick={handleStartTrip}
          disabled={isUpdatingStatus}
          className="flex-1 h-12 sm:h-14 md:h-16 text-sm sm:text-base font-semibold rounded-xl bg-chart-1 hover:bg-chart-1/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
        >
          {isUpdatingStatus ? (
            <ButtonSpinner variant="white" />
          ) : (
            <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
          )}
          <span className="truncate">
            {isUpdatingStatus ? 'Starting Trip...' : 'Start Trip'}
          </span>
        </Button>
      );
    }

    // Note: Drivers cannot complete rides - only riders can complete rides
    // Note: Drivers cannot cancel rides - no cancellation functionality for drivers
    // No action buttons for in-transit rides as drivers wait for rider to complete

    return buttons;
  };

  const actionButtons = getActionButtons();

  // Don't render if no actions are available
  if (actionButtons.length === 0) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden border shadow-xl bg-card/95 backdrop-blur-sm rounded-2xl">
      <CardHeader className="border-b relative overflow-hidden p-3 sm:p-4 md:p-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <CardTitle className="relative flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl font-bold">
          <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div>Driver Actions</div>
            <div className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">
              Manage your ride
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        {/* Status-specific guidance message */}
        {ride.status === RideStatus.ACCEPTED && (
          <div className="bg-chart-1/10 border border-chart-1/20 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-chart-1 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="font-bold text-chart-1 text-sm sm:text-base">
                Ready to Start
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Once you've reached the pickup location and collected your rider,
              tap "Start Trip" to begin the journey.
            </p>
          </div>
        )}

        {ride.status === RideStatus.IN_TRANSIT && (
          <div className="bg-chart-2/10 border border-chart-2/20 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-chart-2 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="font-bold text-chart-2 text-sm sm:text-base">
                Trip in Progress
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Navigate safely to the destination. The rider will complete the
              trip when you arrive.
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
          {actionButtons}
        </div>
      </CardContent>
    </Card>
  );
}
