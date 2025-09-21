import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { UserPlus, AlertTriangle, Car } from 'lucide-react';
import { useAssignDriverToRideMutation } from '@/redux/features/admin/admin.api';
import type { IAdminRide, IDriver } from '@/types';
import { toast } from 'sonner';

interface AssignDriverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ride: IAdminRide | null;
  availableDrivers: IDriver[];
  onSuccess?: () => void;
}

const AssignDriverModal = ({ 
  open, 
  onOpenChange, 
  ride, 
  availableDrivers, 
  onSuccess 
}: AssignDriverModalProps) => {
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [reason, setReason] = useState('');

  const [assignDriver, { isLoading }] = useAssignDriverToRideMutation();

  const handleSubmit = async () => {
    if (!ride || !selectedDriverId || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await assignDriver({
        id: ride._id,
        driverId: selectedDriverId,
        reason: reason.trim()
      }).unwrap();
      
      toast.success('Driver assigned successfully');
      onSuccess?.();
      handleClose();
     } catch {
       toast.error('Failed to assign driver');
     }
  };

  const handleClose = () => {
    setSelectedDriverId('');
    setReason('');
    onOpenChange(false);
  };

  const selectedDriver = availableDrivers.find(driver => driver._id === selectedDriverId);

  if (!ride) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Assign Driver</span>
          </DialogTitle>
          <DialogDescription>
            Manually assign an available driver to ride {ride._id.slice(-8)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Available Drivers Count */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Car className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {availableDrivers.length} available drivers online
              </span>
            </div>
          </div>

          {/* Driver Selection */}
          <div>
            <Label htmlFor="driver" className="text-sm font-medium">
              Select Driver <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a driver to assign" />
              </SelectTrigger>
              <SelectContent>
                {availableDrivers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No drivers available
                  </div>
                ) : (
                  availableDrivers.map((driver) => (
                    <SelectItem key={driver._id} value={driver._id}>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {typeof driver.user === 'object' ? driver.user.name : 'Unknown'}
                          </span>
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                            Online
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {driver.vehicle?.name} ({driver.vehicle?.model}) • {driver.experience}y exp
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Driver Details */}
          {selectedDriver && (
            <div className="p-3 border rounded-lg bg-green-50 border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Selected Driver</h4>
              <div className="text-sm space-y-1">
                <div>
                  <span className="font-medium">Name:</span> {typeof selectedDriver.user === 'object' ? selectedDriver.user.name : 'Unknown'}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {typeof selectedDriver.user === 'object' ? selectedDriver.user.email : 'Unknown'}
                </div>
                <div>
                  <span className="font-medium">Vehicle:</span> {selectedDriver.vehicle?.name} ({selectedDriver.vehicle?.model})
                </div>
                <div>
                  <span className="font-medium">Experience:</span> {selectedDriver.experience} years
                </div>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <Label htmlFor="reason" className="text-sm font-medium">
              Assignment Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this manual assignment is necessary..."
              className="mt-2"
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {reason.length}/500 characters
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Manual Assignment</p>
              <p>This will bypass the normal interest system and directly assign the driver.</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !selectedDriverId || !reason.trim()}
          >
            {isLoading && <Spinner size="sm" className="mr-2" />}
            Assign Driver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDriverModal;
