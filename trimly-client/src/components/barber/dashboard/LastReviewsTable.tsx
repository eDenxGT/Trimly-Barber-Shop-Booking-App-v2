import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { ReviewData } from "@/types/DashboardListingTypes";
import { getSmartDate } from "@/utils/helpers/timeFormatter";

const LastReviewsTable = ({ reviewsData }: { reviewsData: ReviewData[] }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Latest Reviews</CardTitle>
        <CardDescription>What clients are saying about you</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
          {reviewsData.length > 0 ? (
            reviewsData.map((review) => (
              <div
                key={review.reviewId}
                className="border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={review.clientAvatar}
                        alt={review.clientName}
                      />
                      <AvatarFallback>{review.clientName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{review.clientName}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {getSmartDate(review.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mt-2 text-sm">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 mt-2 text-center text-sm">
              No reviews yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LastReviewsTable;
