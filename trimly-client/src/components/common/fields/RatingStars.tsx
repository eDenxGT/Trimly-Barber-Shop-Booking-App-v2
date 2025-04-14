import { Star } from "lucide-react";
import React from "react";

interface RatingStarsProps {
  rating: number;
  totalReviews?: number;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  totalReviews,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-1 mt-1 ${className}`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          let percent = 0;
          if (rating >= star) {
            percent = 100;
          } else if (rating >= star - 0.5) {
            percent = 50;
          }

          return (
            <div key={star} className="relative w-4 h-4">
              {/* Gray background star */}
              <Star className="w-full h-full text-gray-300" />

              {/* Yellow mask gradient overlay */}
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  background: `linear-gradient(to right, #FFD700 ${percent}%, #ccc ${percent}%)`,
                  WebkitMaskImage: `url("data:image/svg+xml,%3Csvg fill='white' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 .587l3.668 7.57 8.332 1.151-6.064 5.911 1.497 8.235L12 18.896l-7.433 4.558 1.497-8.235L0 9.308l8.332-1.151z'/%3E%3C/svg%3E")`,
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "100% 100%",
                }}
              />
            </div>
          );
        })}
      </div>

      <span className="text-gray-700 text-sm">
        {rating.toFixed(1)}
        {totalReviews !== undefined && ` (${totalReviews} reviews)`}
      </span>
    </div>
  );
};
