import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useDeleteReviewMutation,
  useGetRiderReviewsQuery,
  useUpdateReviewMutation,
} from "@/redux/features/review/review-api";
import type { IRiderReview } from "@/types";
import {
  AlertTriangle,
  Calendar,
  Car,
  Filter,
  Pencil,
  Search,
  SortAsc,
  SortDesc,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type SortOption = "date-desc" | "date-asc" | "rating-desc" | "rating-asc";
type FilterOption = "all" | "5" | "4" | "3" | "2" | "1";

export default function MyReviews() {
  const [sort_by, set_sort_by] = useState<SortOption>("date-desc");
  const [filter_by, set_filter_by] = useState<FilterOption>("all");
  const [search_term, set_search_term] = useState("");
  const [page, set_page] = useState(1);
  const [editing_review, set_editing_review] = useState<IRiderReview | null>(
    null,
  );
  const [delete_review_id, set_delete_review_id] = useState<string | null>(
    null,
  );
  const [edit_rating, set_edit_rating] = useState(0);
  const [edit_comment, set_edit_comment] = useState("");

  const {
    data: reviewsResponse,
    isLoading,
    error,
    refetch,
  } = useGetRiderReviewsQuery({ page, limit: 12 });

  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const reviews = useMemo(
    () => reviewsResponse?.data || [],
    [reviewsResponse?.data],
  );

  const meta = reviewsResponse?.meta;

  const stats = useMemo(
    () => ({
      total: reviews.length,
      averageRating:
        reviews.length > 0
          ? (
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            ).toFixed(1)
          : "0.0",
      fiveStarReviews: reviews.filter((r) => r.rating === 5).length,
    }),
    [reviews],
  );

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    if (filter_by !== "all") {
      filtered = filtered.filter(
        (review) => review.rating === Number.parseInt(filter_by),
      );
    }

    if (search_term) {
      const searchLower = search_term.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.driver.user.name.toLowerCase().includes(searchLower) ||
          review.driver.vehicle.name.toLowerCase().includes(searchLower) ||
          review.driver.vehicle.model.toLowerCase().includes(searchLower),
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sort_by) {
        case "date-desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "rating-desc":
          return b.rating - a.rating;
        case "rating-asc":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return sorted;
  }, [reviews, filter_by, search_term, sort_by]);

  const handleEditClick = (review: IRiderReview) => {
    set_editing_review(review);
    set_edit_rating(review.rating);
    set_edit_comment(review.comment || "");
  };

  const handleSaveEdit = async () => {
    if (!editing_review) return;

    try {
      await updateReview({
        id: editing_review._id,
        data: { rating: edit_rating, comment: edit_comment },
      }).unwrap();
      set_editing_review(null);
    } catch {
      toast.error("Failed to update review");
    }
  };

  const handleDeleteReview = async () => {
    if (!delete_review_id) return;

    try {
      await deleteReview(delete_review_id).unwrap();
      set_delete_review_id(null);
    } catch {
      toast.error("Failed to delete review");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <GradientBackground className="rounded-3xl">
          <Card className="bg-card/95 backdrop-blur-sm border shadow-2xl rounded-3xl">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-destructive/10 rounded-full">
                  <X className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Failed to Load Reviews
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't load your reviews. Please try again.
                  </p>
                  <Button onClick={() => refetch()} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </GradientBackground>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <GradientBackground className="rounded-3xl">
        <Card className="bg-card/95 backdrop-blur-sm border shadow-2xl rounded-3xl">
          <CardHeader className="border-b relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative flex items-center justify-between">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold">
                <div className="relative p-3 bg-card rounded-2xl shadow-lg border">
                  <Star className="h-7 w-7 text-primary" />
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-sm" />
                </div>
                <div>
                  <div className="text-2xl font-bold">My Reviews</div>
                  <div className="text-sm font-normal text-muted-foreground mt-1">
                    Manage your driver reviews and feedback
                  </div>
                </div>
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-muted/50 rounded-2xl p-6 border backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold">Total Reviews</span>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {stats.total}
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 border backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-chart-1/10 rounded-xl">
                    <Star className="h-5 w-5 text-chart-1" />
                  </div>
                  <span className="font-semibold">Average Rating</span>
                </div>
                <div className="text-3xl font-bold text-chart-1">
                  {stats.averageRating}
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 border backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-chart-2/10 rounded-xl">
                    <Star className="h-5 w-5 text-chart-2" />
                  </div>
                  <span className="font-semibold">5-Star Reviews</span>
                </div>
                <div className="text-3xl font-bold text-chart-2">
                  {stats.fiveStarReviews}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </GradientBackground>

      <Card className="bg-card/95 backdrop-blur-sm border shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by driver name or vehicle..."
                value={search_term}
                onChange={(e) => set_search_term(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filter_by}
                onValueChange={(value) => set_filter_by(value as FilterOption)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {sort_by.includes("desc") ? (
                <SortDesc className="h-4 w-4 text-muted-foreground" />
              ) : (
                <SortAsc className="h-4 w-4 text-muted-foreground" />
              )}
              <Select
                value={sort_by}
                onValueChange={(value) => set_sort_by(value as SortOption)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="rating-desc">Highest Rating</SelectItem>
                  <SelectItem value="rating-asc">Lowest Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ReviewCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredAndSortedReviews.length === 0 ? (
        <GradientBackground className="rounded-3xl">
          <Card className="bg-card/95 backdrop-blur-sm border shadow-2xl rounded-3xl">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-muted/50 rounded-full">
                  <Star className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    No Reviews Found
                  </h3>
                  <p className="text-muted-foreground">
                    {search_term || filter_by !== "all"
                      ? "No reviews match your current filters. Try adjusting your search or filter criteria."
                      : "You haven't reviewed any drivers yet. Complete a ride to share your experience!"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </GradientBackground>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedReviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onEdit={() => handleEditClick(review)}
              onDelete={() => set_delete_review_id(review._id)}
            />
          ))}
        </div>
      )}

      {meta && meta.totalPage > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => set_page((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {meta.totalPage}
          </span>
          <Button
            variant="outline"
            onClick={() => set_page((p) => Math.min(meta.totalPage, p + 1))}
            disabled={page === meta.totalPage}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog
        open={!!editing_review}
        onOpenChange={(open) => !open && set_editing_review(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              Update your rating and comment for this driver.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => set_edit_rating(star)}
                    className="p-2 rounded-lg transition-colors hover:bg-muted"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8",
                        star <= edit_rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Comment</label>
              <Textarea
                value={edit_comment}
                onChange={(e) => set_edit_comment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {edit_comment.length}/500
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => set_editing_review(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isUpdating || edit_rating === 0}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!delete_review_id}
        onOpenChange={(open) => !open && set_delete_review_id(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Review
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => set_delete_review_id(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteReview}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ReviewCardProps {
  review: IRiderReview;
  onEdit: () => void;
  onDelete: () => void;
}

function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="bg-card/95 backdrop-blur-sm border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">{review.driver.user.name}</div>
                <div className="text-sm text-muted-foreground">
                  {review.driver.vehicle.name} {review.driver.vehicle.model}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-4 w-4",
                  star <= review.rating
                    ? "fill-chart-1 text-chart-1"
                    : "text-muted-foreground",
                )}
              />
            ))}
            <Badge variant="secondary" className="ml-2">
              {review.rating}.0
            </Badge>
          </div>

          {review.comment && (
            <div className="text-sm text-muted-foreground line-clamp-4">
              "{review.comment}"
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(review.createdAt)}</span>
          </div>
        </div>

        <div className="pt-4 border-t flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 gap-2"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewCardSkeleton() {
  return (
    <Card className="bg-card/95 backdrop-blur-sm border shadow-lg rounded-2xl">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-3 w-20" />
          <div className="pt-4 border-t flex gap-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
