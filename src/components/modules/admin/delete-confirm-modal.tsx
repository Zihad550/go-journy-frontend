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
import { Trash2, AlertTriangle, Shield } from 'lucide-react';
import { useForceDeleteRideMutation } from '@/redux/features/admin/admin-api';
import type { IAdminRide } from '@/types';
import { toast } from 'sonner';

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ride: IAdminRide | null;
  onSuccess?: () => void;
}

const DeleteConfirmModal = ({ open, onOpenChange, ride, onSuccess }: DeleteConfirmModalProps) => {
  const [reason, set_reason] = useState('');
  const [confirm_text, set_confirm_text] = useState('');

  const [deleteRide, { isLoading }] = useForceDeleteRideMutation();

  const confirmationPhrase = 'DELETE RIDE';

  const handleSubmit = async () => {
    if (!ride || !reason.trim() || confirm_text !== confirmationPhrase) {
      if (confirm_text !== confirmationPhrase) {
        toast.error('Please type the confirmation phrase exactly');
      } else {
        toast.error('Please provide a reason for deletion');
      }
      return;
    }

    try {
      await deleteRide({
        id: ride._id,
        reason: reason.trim()
      }).unwrap();
      
      toast.success('Ride permanently deleted');
      onSuccess?.();
      handleClose();
     } catch {
       toast.error('Failed to delete ride');
     }
  };

  const handleClose = () => {
    set_reason('');
    set_confirm_text('');
    onOpenChange(false);
  };

  if (!ride) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Force Delete Ride</span>
          </DialogTitle>
          <DialogDescription>
            Permanently delete ride {ride._id.slice(-8)} from the system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Danger Warning */}
          <div className="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-bold mb-2">⚠️ IRREVERSIBLE ACTION</p>
              <ul className="space-y-1 text-xs">
                <li>• This will permanently delete the ride from the database</li>
                <li>• All associated data will be lost forever</li>
                <li>• This action cannot be undone</li>
                <li>• Use only for legal/privacy compliance reasons</li>
              </ul>
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <Label htmlFor="reason" className="text-sm font-medium">
              Deletion Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => set_reason(e.target.value)}
              placeholder="e.g., Data privacy request - customer account deletion, Legal compliance requirement, etc."
              className="mt-2"
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {reason.length}/500 characters
            </div>
          </div>

          {/* Confirmation Input */}
          <div>
            <Label htmlFor="confirm" className="text-sm font-medium">
              Type "{confirmationPhrase}" to confirm <span className="text-red-500">*</span>
            </Label>
            <input
              id="confirm"
              type="text"
              value={confirm_text}
              onChange={(e) => set_confirm_text(e.target.value)}
              placeholder={confirmationPhrase}
              className="mt-2 w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          {/* Legal Notice */}
          <div className="flex items-start space-x-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <Shield className="h-4 w-4 text-gray-600 mt-0.5" />
            <div className="text-xs text-gray-700">
              <p className="font-medium">Legal Notice</p>
              <p>This deletion will be logged for audit purposes. Only use for legitimate legal or privacy compliance requirements.</p>
            </div>
          </div>

          {/* Ride Summary */}
          <div className="p-3 border rounded-lg bg-muted/50">
            <h4 className="font-medium text-sm mb-2">Ride to Delete:</h4>
            <div className="text-xs space-y-1">
              <div><span className="font-medium">ID:</span> {ride._id}</div>
              <div><span className="font-medium">Status:</span> {ride.status}</div>
              <div><span className="font-medium">Created:</span> {new Date(ride.createdAt).toLocaleString()}</div>
              <div><span className="font-medium">Price:</span> ${ride.price.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !reason.trim() || confirm_text !== confirmationPhrase}
            variant="destructive"
          >
            {isLoading && <Spinner size="sm" className="mr-2" />}
            DELETE RIDE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
