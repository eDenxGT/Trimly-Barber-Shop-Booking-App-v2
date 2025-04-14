import { MapPin, Star, Wifi, Calendar, CarFront, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IBarber } from "@/types/User";
import { formatDistance } from "@/utils/helpers/distanceFormatter";
import { useNavigate } from "react-router-dom";

export function BarberShopCard({ shop }: { shop: IBarber }) {
  const { openingHours } = shop;

  const getCurrentDayOpeningHours = () => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = days[new Date().getDay()];
    return openingHours?.[today as keyof typeof openingHours];
  };

  const isShopOpenNow = () => {
    const todayHours = getCurrentDayOpeningHours();

    if (!todayHours || !todayHours.open || !todayHours.close) {
      return false; // Shop is closed today
    }

    const now = new Date();

    // Format today's date with opening and closing times
    const [openHour, openMin] = todayHours.open.split(":").map(Number);
    const [closeHour, closeMin] = todayHours.close.split(":").map(Number);

    const openTime = new Date(now);
    openTime.setHours(openHour, openMin, 0, 0);

    const closeTime = new Date(now);
    closeTime.setHours(closeHour, closeMin, 0, 0);

    // Check if current time is within range
    return now >= openTime && now <= closeTime;
  };

  // Usage
  const isOpen = isShopOpenNow();

  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md overflow-hidden border-1 pt-0 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
      <div className="relative h-64 w-full overflow-hidden">
        {/* Banner image or gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r  from-blue-500 to-purple-600">
          {shop.banner && (
            <img
              src={shop.banner || "/placeholder.svg"}
              alt="Barber shop banner"
              className="object-cover h-full opacity-80"
            />
          )}
        </div>

        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Action buttons */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4">
          <Button
            onClick={() => navigate(`/shops/${shop.userId}`)}
            className="bg-[var(--darkblue)] cursor-pointer text-white hover:bg-[var(--darkblue-hover)] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Visit Profile
          </Button>
          <Button
            onClick={() => navigate(`/shops/${shop.userId}/booking`)}
            className="bg-[var(--yellow)] cursor-pointer text-white hover:bg-[var(--yellow-hover)] transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
          >
            Book Now <Calendar className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="pt-1">
        <div className="flex items-start gap-4">
          {/* Avatar positioned to the left of shop name */}
          <Avatar className="h-12 w-12 border-2 border-white shadow-md">
            <AvatarImage src={shop.avatar} alt={shop.shopName} />
            <AvatarFallback className="font-semibold">
              {shop.shopName?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {shop.shopName}
              </h2>
              <Badge
                variant={isOpen ? "default" : "outline"}
                className={cn(
                  "flex items-center gap-1",
                  isOpen
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                )}
              >
                <Clock className="h-3 w-3" />
                {isOpen ? "Open Now" : "Closed"}
              </Badge>
            </div>

            <p className="text-gray-600">{shop.description}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>
              {shop.location?.name} ({formatDistance(shop.distance)})
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">
              {shop.averageRating?.toFixed(1) || (0).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {shop.amenities?.wifi && (
            <Badge
              variant="default"
              className={cn(
                "flex items-center gap-1",
                shop.amenities?.wifi
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                  : "text-gray-500"
              )}
            >
              <Wifi className="h-3 w-3" /> WiFi
            </Badge>
          )}

          {shop.amenities?.parking && (
            <Badge
              variant={shop.amenities.parking ? "default" : "outline"}
              className={cn(
                "flex items-center gap-1",
                shop.amenities.parking
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                  : "text-gray-500"
              )}
            >
              <CarFront className="h-3 w-3" /> Parking
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
