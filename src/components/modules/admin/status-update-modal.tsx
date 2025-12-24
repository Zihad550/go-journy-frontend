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
import { Clock, AlertTriangle } from 'lucide-react';
import { RideStatus } from '@/constants';
import { useUpdateAdminRideStatusMutation } from '@/redux/features/admin/admin.api';
import type { IAdminRide } from '@/types';
import { toast } from 'sonner';

interface StatusUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ride: IAdminRide | null;
  onSuccess?: () => void;
}

const StatusUpdateModal = ({ open, onOpenChange, ride, onSuccess }: StatusUpdateModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [reason, setReason] = useState('');

  const [updateStatus, { isLoading }] = useUpdateAdminRideStatusMutation();

  const statusOptions = [
    { value: RideStatus.REQUESTED, label: 'Requested', description: 'Ride is pending driver assignment' },
    { value: RideStatus.ACCEPTED, label: 'Accepted', description: 'Driver has been assigned and accepted' },
    { value: RideStatus.IN_TRANSIT, label: 'In Transit', description: 'Ride is currently in progress' },
    { value: RideStatus.COMPLETED, label: 'Completed', description: 'Ride has been completed successfully' },
    { value: RideStatus.CANCELLED, label: 'Cancelled', description: 'Ride has been cancelled' }
  ];

  const getCurrentStatusBadge = (status: string) => {
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

  const handleSubmit = async () => {
    if (!ride || !selectedStatus || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await updateStatus({
        id: ride._id,
        status: selectedStatus,
        reason: reason.trim()
      }).unwrap();
      
      toast.success('Ride status updated successfully');
      onSuccess?.();
      handleClose();
     } catch {
       toast.error('Failed to update ride status');
     }
  };

  const handleClose = () => {
    setSelectedStatus('');
    setReason('');
    onOpenChange(false);
  };

  if (!ride) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Update Ride Status</span>
          </DialogTitle>
          <DialogDescription>
            Change the status of ride {ride._id.slice(-8)} with admin intervention
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div>
            <Label className="text-sm font-medium">Current Status</Label>
            <div className="mt-2">
              {getCurrentStatusBadge(ride.status)}
            </div>
          </div>

          {/* New Status */}
          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              New Status <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem 
                    key={status.value} 
                    value={status.value}
                    disabled={status.value === ride.status}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{status.label}</span>
                      <span className="text-xs text-muted-foreground">{status.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reason */}
          <div>
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for Change <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this status change is necessary..."
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
              <p className="font-medium">Admin Override Warning</p>
              <p>This action will override the normal ride flow and create an audit trail.</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !selectedStatus || !reason.trim()}
          >
            {isLoading && <Spinner size="sm" className="mr-2" />}
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateModal;
