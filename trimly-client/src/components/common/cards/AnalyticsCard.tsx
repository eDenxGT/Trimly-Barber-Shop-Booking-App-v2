import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  IndianRupee,
  Star,
  Users,
} from "lucide-react";

export interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: string;
  bgColor?: string;
  iconColor?: string;
  totalReviews?: number;
}

export const AnalyticsCardComponent: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  iconColor,
  totalReviews,
}) => {
  const IconComponent = () => {
    switch (icon) {
      case "dollar-sign":
        return (
          <IndianRupee className={`h-5 w-5 ${iconColor || "text-primary"}`} />
        );
      case "users":
        return <Users className={`h-5 w-5 ${iconColor || "text-primary"}`} />;
      case "calendar":
        return (
          <Calendar className={`h-5 w-5 ${iconColor || "text-primary"}`} />
        );
      case "star":
        return <Star className={`h-5 w-5 ${iconColor || "text-primary"}`} />;
      default:
        return null;
    }
  };

  return (
    <Card
      className="shadow-sm overflow-hidden border-t-4"
      style={{
        borderTopColor: iconColor?.replace("text-", "").replace("500", "400"),
      }}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {icon === "star" && (
                <span className="text-xs text-gray-500">({totalReviews} reviews)</span>
              )}
            </div>
          </div>
          <div
            className={`p-2 rounded-full ${bgColor || "bg-primary/10"}`}
          >
            <IconComponent />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
