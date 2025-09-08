import { DriverAvailability, Role } from '@/constants';
import {
  useGetDriverProfileQuery,
  useUpdateDriverAvailabilityMutation,
} from '@/redux/features/driver/driver.api';
import { useUserInfoQuery } from '@/redux/features/user/user.api';
import { Car, CircleSlash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Switch } from './switch';

export function DriverAvailabilityControl() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const { data: driverProfile } = useGetDriverProfileQuery(undefined, {
    skip: userInfo?.data?.role !== Role.DRIVER,
  });
  const [updateAvailability, { isLoading }] =
    useUpdateDriverAvailabilityMutation();

  const [isOnline, setIsOnline] = useState(false);

  // Sync local state with driver profile data
  useEffect(() => {
    if (driverProfile?.data?.availability) {
      setIsOnline(
        driverProfile.data.availability === DriverAvailability.ONLINE
      );
    }
  }, [driverProfile?.data?.availability]);

  // Don't render if user is not a driver
  if (userInfo?.data?.role !== Role.DRIVER) {
    return null;
  }

  const handleAvailabilityToggle = async (checked: boolean) => {
    try {
      setIsOnline(checked);

      await updateAvailability({
        availability: checked
          ? DriverAvailability.ONLINE
          : DriverAvailability.OFFLINE,
      }).unwrap();

      toast.success(
        checked
          ? 'You are now online and available for rides'
          : 'You are now offline and unavailable for rides'
      );
    } catch (error) {
      // Revert local state on error
      setIsOnline(!checked);
      toast.error('Failed to update availability. Please try again.');
      console.error('Failed to update driver availability:', error);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <div className="flex items-center gap-1.5">
        {isOnline ? (
          <Car className="h-4 w-4 text-green-600" />
        ) : (
          <CircleSlash className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-sm font-medium">
          <span
            className={isOnline ? 'text-green-600' : 'text-muted-foreground'}
          >
            {isOnline ? 'Online' : 'Offline'}
          </span>
          {isLoading && (
            <span className="text-xs text-muted-foreground ml-1">
              (updating...)
            </span>
          )}
        </span>
      </div>
      <Switch
        checked={isOnline}
        onCheckedChange={handleAvailabilityToggle}
        disabled={isLoading}
        aria-label="Toggle driver availability"
      />
    </div>
  );
}
