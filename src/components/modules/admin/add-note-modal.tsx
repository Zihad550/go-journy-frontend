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
import { FileText, Info } from 'lucide-react';
import { useAddAdminNoteMutation } from '@/redux/features/admin/admin-api';
import type { IAdminRide } from '@/types';
import { toast } from 'sonner';

interface AddNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ride: IAdminRide | null;
  onSuccess?: () => void;
}

const AddNoteModal = ({ open, onOpenChange, ride, onSuccess }: AddNoteModalProps) => {
  const [note, setNote] = useState('');

  const [addNote, { isLoading }] = useAddAdminNoteMutation();

  const handleSubmit = async () => {
    if (!ride || !note.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      await addNote({
        id: ride._id,
        note: note.trim()
      }).unwrap();
      
      toast.success('Admin note added successfully');
      onSuccess?.();
      handleClose();
     } catch {
       toast.error('Failed to add admin note');
     }
  };

  const handleClose = () => {
    setNote('');
    onOpenChange(false);
  };

  if (!ride) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Add Admin Note</span>
          </DialogTitle>
          <DialogDescription>
            Add an internal note to ride {ride._id.slice(-8)} for admin tracking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info */}
          <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Internal Note</p>
              <p>This note will only be visible to administrators and will be logged with your details.</p>
            </div>
          </div>

          {/* Note Input */}
          <div>
            <Label htmlFor="note" className="text-sm font-medium">
              Note <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter details about this ride, customer interactions, issues resolved, etc..."
              className="mt-2"
              rows={5}
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {note.length}/1000 characters
            </div>
          </div>

          {/* Examples */}
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Example notes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Customer called regarding pickup location clarification</li>
              <li>Driver reported traffic issues causing delay</li>
              <li>Payment issue resolved after manual review</li>
              <li>Ride completed successfully after technical support</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !note.trim()}
          >
            {isLoading && <Spinner size="sm" className="mr-2" />}
            Add Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteModal;
