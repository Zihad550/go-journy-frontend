import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ButtonSpinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReviewMutation } from "@/redux/features/review/review-api";
import type { IDriver, IRide } from "@/types";
import { Car, CheckCircle, DollarSign, MapPin, Star, User } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: IRide;
  driver: IDriver;
}

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readonly = false,
}) => {
  const [hover_rating, set_hover_rating] = useState(0);

  const handleClick = (starValue: number) => {
    if (!readonly) {
      onRatingChange(starValue);
    }
  };

  const handleMouseEnter = (starValue: number) => {
    if (!readonly) {
      set_hover_rating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      set_hover_rating(0);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          className={`p-1 rounded-full transition-colors ${
            readonly ? "cursor-default" : "cursor-pointer hover:bg-primary/10"
          }`}
          disabled={readonly}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              star <= (hover_rating || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export function ReviewModal({
  isOpen,
  onClose,
  ride,
  driver,
}: ReviewModalProps) {
  const [rating, set_rating] = useState(0);
  const [comment, set_comment] = useState("");
  const [createReview, { isLoading }] = useCreateReviewMutation();

  // Get driver information safely
  const driverName =
    typeof driver?.user === "object" && driver?.user?.name
      ? driver.user.name
      : "Driver";
  const vehicleName = driver?.vehicle?.name || "Vehicle";
  const vehicleModel = driver?.vehicle?.model || "";

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.length > 500) {
      toast.error("Comment must be less than 500 characters");
      return;
    }

    try {
      await createReview({
        ride: ride._id,
        rating,
        comment: comment.trim() || undefined,
      }).unwrap();

      toast.success(
        "Review submitted successfully! Thank you for your feedback.",
      );
      onClose();
      // Reset form
      set_rating(0);
      set_comment("");
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to submit review. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset form when closing
      set_rating(0);
      set_comment("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Rate Your Ride
          </DialogTitle>
          <DialogDescription>
            Share your experience with this driver to help improve our service.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Driver Information */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Your Driver</h3>
                <p className="text-sm text-muted-foreground">
                  Review your recent ride
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-foreground">{driverName}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Car className="w-4 h-4" />
                  <span>
                    {vehicleName} {vehicleModel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ride Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Ride Summary</h3>
                <p className="text-sm text-muted-foreground">
                  Your completed journey
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-muted-foreground">From:</span>
                <span className="font-medium">
                  {ride.pickupLocation?.lat?.toString().slice(0, 7)},{" "}
                  {ride.pickupLocation?.lng?.toString().slice(0, 7)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-600" />
                <span className="text-muted-foreground">To:</span>
                <span className="font-medium">
                  {ride.destination?.lat?.toString().slice(0, 7)},{" "}
                  {ride.destination?.lng?.toString().slice(0, 7)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-chart-1" />
                <span className="text-muted-foreground">Fare:</span>
                <span className="font-bold text-chart-1">${ride.price}</span>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground">
                How was your ride? <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Tap the stars to rate your experience
              </p>
              <div className="flex justify-center">
                <StarRating rating={rating} onRatingChange={set_rating} />
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Additional Comments (Optional)
            </label>
            <Textarea
              placeholder="Tell us more about your experience..."
              value={comment}
              onChange={(e) => set_comment(e.target.value)}
              rows={3}
              maxLength={500}
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground text-right">
              {comment.length}/500 characters
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Skip Review
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || rating === 0}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <ButtonSpinner />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </DialogFooter>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground text-center mt-4">
          Your feedback helps us improve our service and helps other riders
          choose the best drivers.
        </div>
      </DialogContent>
    </Dialog>
  );
}
