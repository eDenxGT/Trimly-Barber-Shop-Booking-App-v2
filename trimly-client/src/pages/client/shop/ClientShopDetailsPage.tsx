import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Star,
  MessageCircle,
  Share2,
  Clock,
  UserIcon,
  Wifi,
  Car,
  X,
  Check,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { useBarberShopById } from "@/hooks/barber/useBarberShopById";
import { getBarberShopDetailsById } from "@/services/client/clientService";
import moment from "moment";
import { handleShare } from "@/utils/helpers/shareLink";
import { formatTo12Hour } from "@/utils/helpers/timeFormatter";
import { ReviewModal } from "@/components/modals/ReviewModal";
import { RatingStars } from "@/components/common/fields/RatingStars";
import { openInGoogleMap } from "@/utils/helpers/googleMapRedirect";
import { useToaster } from "@/hooks/ui/useToaster";

export function ClientShopDetailsPage({ role = "client" }: { role: string }) {
  const { shopId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { data, isLoading, error } = useBarberShopById(
    getBarberShopDetailsById,
    shopId || "",
    "active"
  );
  const shop = data?.user;
  const navigate = useNavigate();
  const { errorToast } = useToaster();

  const handleRedirectBooking = (shopId: string) => {
    navigate(`/shops/${shopId}/booking`);
  };

  if (isLoading)
    return (
      <div className="p-4 flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="p-4 flex items-center justify-center h-screen">
        Error loading shop data
      </div>
    );
  if (!shop)
    return (
      <div className="p-4 flex items-center justify-center h-screen">
        Shop not found
      </div>
    );

  const handleCall = () => {
    if (shop.phoneNumber) {
      window.location.href = `tel:${shop.phoneNumber}`;
    } else {
      console.log("Phone number not available");
      errorToast("Phone number not available");
    }
  };

  const displayWeeklySchedule = () => {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    return (
      <div className="space-y-2 text-sm">
        {days.map((day) => {
          const dayData = shop.openingHours?.[day];
          const isOpen = dayData && dayData.open && dayData.close;

          return (
            <div key={day} className="flex justify-between items-center">
              <span className="capitalize text-gray-500">{day}</span>
              {isOpen ? (
                <span>
                  {formatTo12Hour(dayData?.open || "")} -{" "}
                  {formatTo12Hour(dayData?.close || "")}
                </span>
              ) : (
                <span className="text-gray-400">Closed</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="flex min-h-screen flex-col mt-16 bg-gray-50">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-gray-100"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {shop.shopName || "Barber Shop Details"}
          </h1>
        </div>
      </header>
      <main className="flex-1">
        {/* Banner Image */}
        <div className="relative">
          <img
            src={shop.banner || "/placeholder.svg?height=300&width=600"}
            alt={`${shop.shopName} banner`}
            className="max-h-110 w-full object-cover"
          />
          {role === "client" && (
            <Button
              onClick={() => handleRedirectBooking(shop.userId || "")}
              className="absolute bottom-4 right-4 bg-[var(--darkblue)] text-white font-semibold hover:bg-[var(--darkblue-hover)]"
            >
              Book Now
            </Button>
          )}

          {/* Shop Status Badge */}
          <Badge
            className={`absolute top-4 right-4 ${
              shop.status === "active"
                ? "bg-green-100 text-green-800 border-green-200"
                : shop.status === "pending"
                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                : "bg-red-100 text-red-800 border-red-200"
            }`}
          >
            {shop.status === "active" ? (
              <>
                <Check className="h-3 w-3 mr-1" /> Active
              </>
            ) : shop.status === "pending" ? (
              <>
                <Clock className="h-3 w-3 mr-1" /> Pending
              </>
            ) : (
              <>
                <X className="h-3 w-3 mr-1" /> Inactive
              </>
            )}
          </Badge>
        </div>

        {/* Shop Info Section */}
        <div className="px-4 py-3">
          <div className="flex items-start">
            {shop.avatar && (
              <Avatar className="h-16 w-16 mr-3 border-2 border-white shadow-md">
                <AvatarImage src={shop.avatar} alt={shop.shopName} />
                <AvatarFallback>{shop?.shopName?.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{shop.shopName}</h1>
              <div className="flex items-center gap-1 mt-1 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>
                  {shop.location?.displayName || "Location not available"}
                </span>
              </div>
              <RatingStars
                rating={shop.averageRating || 0}
                totalReviews={shop.totalReviewCount || 0}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <Button
              variant="ghost"
              className="flex flex-col items-center p-2 h-auto text-gray-600 transition-colors hover:text-[var(--yellow-hover)]"
              onClick={() =>
                openInGoogleMap(
                  shop.location?.coordinates?.[1],
                  shop.location?.coordinates?.[0]
                )
              }
            >
              <MapPin className="h-5 w-5 mb-1" />
              <span className="text-xs">Place</span>
            </Button>
            <Button
              onClick={() => navigate(`/chat?userId=${shop.userId || ""}&type=dm`)}
              variant="ghost"
              className="flex flex-col items-center p-2 h-auto text-gray-600 transition-colors hover:text-[var(--yellow-hover)]"
            >
              <MessageCircle className="h-5 w-5 mb-1" />
              <span className="text-xs">Chat</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex flex-col items-center p-2 h-auto transition-colors hover:text-[var(--yellow-hover)]`}
              onClick={handleCall}
            >
              <Phone className="h-5 w-5 mb-1" />
              <span className="text-xs">Call</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center p-2 h-auto text-gray-600 transition-colors hover:text-[var(--yellow-hover)]"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Share</span>
            </Button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="px-1 mt-2">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1">
              <TabsTrigger
                value="about"
                className="rounded-md data-[state=active]:bg-amber-100 data-[state=active]:text-black"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="service"
                className="rounded-md data-[state=active]:bg-amber-100 data-[state=active]:text-black"
              >
                Service
              </TabsTrigger>
              {/* <TabsTrigger
                value="schedule"
                className="rounded-md data-[state=active]:bg-amber-100 data-[state=active]:text-black"
              >
                Schedule
              </TabsTrigger> */}
              <TabsTrigger
                value="review"
                className="rounded-md data-[state=active]:bg-amber-100 data-[state=active]:text-black"
              >
                Review
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              {/* About Tab */}
              <TabsContent value="about" className="mt-0">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    {shop.description || "No description available."}
                  </p>

                  <div>
                    <h3 className="font-semibold mb-2">Opening Hours</h3>
                    {displayWeeklySchedule()}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-1 text-sm">
                      {shop.email && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Email:</span>
                          <span>{shop.email}</span>
                        </div>
                      )}
                      {shop.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Phone:</span>
                          <span>{shop.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {shop.amenities &&
                      Object.keys(shop.amenities).length > 0 ? (
                        Object.entries(shop.amenities).map(
                          ([key, value]) =>
                            value && (
                              <Badge
                                key={key}
                                variant="outline"
                                className="capitalize bg-orange-200 border-orange-300 text-orange-700"
                              >
                                {key === "wifi" ? (
                                  <Wifi className="h-3 w-3 mr-1" />
                                ) : key === "parking" ? (
                                  <Car className="h-3 w-3 mr-1" />
                                ) : null}
                                {key}
                              </Badge>
                            )
                        )
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No amenities available
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <div className="h-40 rounded-lg overflow-hidden">
                      {shop.location?.coordinates ? (
                        <iframe
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          style={{ border: 0 }}
                          referrerPolicy="no-referrer-when-downgrade"
                          allowFullScreen
                          loading="lazy"
                          src={`https://www.google.com/maps?q=${shop.location.coordinates[1]},${shop.location.coordinates[0]}&output=embed`}
                        ></iframe>
                      ) : (
                        <div className="h-full bg-gray-200 flex items-center justify-center rounded-lg">
                          <MapPin className="h-6 w-6 text-gray-400" />
                          <span className="ml-2 text-gray-500">Map View</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-700">
                      {shop.location?.displayName || "Address not available"}
                      {shop.location?.zipCode && `, ${shop.location.zipCode}`}
                    </p>
                  </div>

                  {shop.status === "pending" && shop.rejectionReason && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <h3 className="text-yellow-800 font-medium">
                        Pending Approval
                      </h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Reason: {shop.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="service" className="mt-0">
                <div className="space-y-4">
                  <h3 className="font-semibold">Our Services</h3>
                  <div className="space-y-3">
                    {shop.services && shop.services.length > 0 ? (
                      shop.services.map((service, index) => (
                        <Card
                          key={index}
                          className="border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1.5">
                                <h4 className="font-medium text-gray-800">
                                  {service.name}
                                </h4>
                                {service.description && (
                                  <p className="text-xs text-gray-500">
                                    {service.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    30 min
                                  </div>
                                  <div className="capitalize flex items-center text-xs text-gray-500">
                                    <UserIcon className="h-3 w-3 mr-1" />
                                    {service.genderType}
                                  </div>
                                </div>
                              </div>
                              <div className="text-base font-semibold text-blue-500">
                                ₹{service.price}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No services available
                      </p>
                    )}
                  </div>
                  {role === "client" && shop.status === "active" && (
                    <div className="mt-4 flex ">
                      <Button
                        onClick={() => handleRedirectBooking(shop.userId || "")}
                        variant="secondary"
                        className="max-w-fit mx-auto bg-[var(--yellow)] text-white hover:bg-[var(--yellow-hover)]"
                      >
                        Book Appointment
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Schedule Tab */}
              {/* <TabsContent value="schedule" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Schedule</h3>
                    <div className="flex items-center bg-gray-100 rounded-md px-3 py-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {new Date().toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-1"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.5 5L7.5 8L10.5 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Timeline</div>

                    {appointments.map((appointment, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-center">
                          <div className="w-20 text-sm text-gray-500">
                            {appointment.time}
                          </div>
                          {appointment.barber ? (
                            <Card className="flex-1 bg-[#f0f4ff]">
                              <CardContent className="p-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={appointment.avatar} />
                                    <AvatarFallback>
                                      {appointment.barber.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="text-sm font-medium">
                                      {appointment.barber}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {appointment.service}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            <div className="flex-1 border-t border-dashed border-gray-300 h-0 my-4"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {role === "client" && shop.status === "active" && (
                    <div className="mt-4 flex">
                      <Button
                        onClick={() => handleRedirectBooking(shop.userId || "")}
                        variant="secondary"
                        className="max-w-fit mx-auto bg-[var(--yellow)] text-white hover:bg-[var(--yellow-hover)]"
                      >
                        Book Available Slot
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent> */}

              {/* Reviews Tab */}
              <TabsContent value="review" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Customer Reviews</h3>
                    <Badge variant="outline" className="font-normal">
                      <Star className="h-3 w-3 fill-[#FFD700] text-[#FFD700] mr-1" />
                      {shop?.averageRating?.toFixed(1)} (
                      {shop?.totalReviewCount || 0} reviews)
                    </Badge>
                  </div>

                  {shop.reviews && shop.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {shop.reviews.map(
                        (review): React.ReactNode => (
                          <div key={review.reviewId} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={review.reviewer?.avatar} />
                                  <AvatarFallback>
                                    {review.reviewer?.fullName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {review.reviewer?.fullName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {moment(review.createdAt).fromNow()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {[...Array(5)].map(
                                  (_, i): React.ReactNode => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating
                                          ? "fill-[#FFD700] text-[#FFD700]"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  )
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">
                              {review.reviewText}
                            </p>
                            <Separator />
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No reviews yet. Be the first to leave a review!
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-center items-center">
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    variant="secondary"
                    className="max-w-fit mx-auto bg-[var(--yellow)] text-white hover:bg-[var(--yellow-hover)]"
                  >
                    Write a Review
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shopId={shopId || ""}
      />
    </div>
  );
}
