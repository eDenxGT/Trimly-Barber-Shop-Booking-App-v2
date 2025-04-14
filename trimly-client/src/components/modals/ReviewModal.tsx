import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToaster } from "@/hooks/ui/useToaster";
import MuiButton from "../common/buttons/MuiButton";
import { useReviewMutation } from "@/hooks/review/useReview";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: string;
}

export function ReviewModal({ isOpen, onClose, shopId }: ReviewModalProps) {
  const { successToast, errorToast } = useToaster();
  const [hoverRating, setHoverRating] = useState(0);
  const { mutate: postReview, isPending, isError } = useReviewMutation();

  const formik = useFormik({
    initialValues: {
      rating: 0,
      reviewText: "",
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .min(1, "Please select a rating")
        .max(5)
        .required("Rating is required"),
      reviewText: Yup.string()
        .max(1000, "Review must be 1000 characters or less")
        .required("Review is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      postReview(
        {
          shopId,
          rating: values.rating,
          reviewText: values.reviewText,
        },
        {
          onSuccess: (data) => {
            successToast(data.message);
            resetForm();
            onClose();
          },
          onError: (error: any) => {
            errorToast(error.response.data.message);
          },
        }
      );
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const characterCount = formik.values.reviewText.length;
  const maxCharacters = 1000;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 pt-2">
          {/* Star Rating */}
          <div className="space-y-2">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={cn(
                      "text-gray-300 transition-colors duration-150 hover:text-yellow-400 focus:outline-none",
                      formik.isSubmitting &&
                        "cursor-default pointer-events-none"
                    )}
                    onClick={() => formik.setFieldValue("rating", star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={formik.isSubmitting}
                    aria-label={`Rate ${star} out of 5 stars`}
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 fill-current",
                        (hoverRating || formik.values.rating) >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      )}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
              {formik.touched.rating && formik.errors.rating ? (
                <div className="text-sm text-red-500">
                  {formik.errors.rating}
                </div>
              ) : null}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Textarea
              id="reviewText"
              name="reviewText"
              placeholder="Share your experience with this shop..."
              rows={5}
              value={formik.values.reviewText}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
              className={`resize-none ${
                formik.touched.reviewText && formik.errors.reviewText
                  ? "border-red-500"
                  : ""
              }`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <div>
                {formik.touched.reviewText && formik.errors.reviewText ? (
                  <span className="text-red-500">
                    {formik.errors.reviewText}
                  </span>
                ) : null}
              </div>
              <div>
                <span
                  className={
                    characterCount > maxCharacters ? "text-red-500" : ""
                  }
                >
                  {characterCount}/{maxCharacters}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <MuiButton
              type="submit"
              disabled={
                Boolean(formik.errors.reviewText) ||
                Boolean(formik.errors.rating) ||
                formik.isSubmitting ||
                !formik.isValid ||
                characterCount > maxCharacters ||
                (isPending && !isError)
              }
              loading={isPending}
            >
              Submit Review
            </MuiButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
