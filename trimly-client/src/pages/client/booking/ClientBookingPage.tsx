import { useState, useEffect, useRef } from "react";
import { format, isBefore, startOfDay, parse, addMinutes } from "date-fns";
import { ArrowLeft, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { IService } from "@/types/Service";
import {
  createBooking,
  getBarberShopDetailsById,
  handleFailureBookingPayment,
  verifyPayment,
} from "@/services/client/clientService";
import { useBarberShopById } from "@/hooks/barber/useBarberShopById";
import { generateSlots } from "@/utils/helpers/generateTimeSlots";
import { IClient } from "@/types/User";
import { RazorpayButton } from "@/services/payment/RazorPay";
import { WalletPaymentModal } from "@/components/modals/WalletPaymentModal";
import { useWalletPaymentMutation } from "@/hooks/client/useWalletPayment";
import { useToaster } from "@/hooks/ui/useToaster";

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface OpeningHours {
  [key: string]: { open: string | null; close: string | null } | null;
}

export interface Booking {
  clientId: string;
  shopId: string;
  services: string[];
  date: Date;
  startTime: string;
  bookedTimeSlots: string[];
  duration: number;
  total: number;
  status: string;
}

export function ClientBookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedServices, setSelectedServices] = useState<IService[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [allTimeSlots, setAllTimeSlots] = useState<Record<string, TimeSlot[]>>(
    {}
  );
  const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([]);
  const { shopId } = useParams();

  const navigate = useNavigate();
  const initialSlotsProcessed = useRef(false);
  const existingBookingsProcessed = useRef(false);
  const { mutate: payWithWallet } = useWalletPaymentMutation();
  const user: IClient = useOutletContext();
  const { data, isLoading, error } = useBarberShopById(
    getBarberShopDetailsById,
    shopId || "",
    "active"
  );
  const shopData = data?.user;

  const { successToast, errorToast } = useToaster();

  const existingBookings = shopData?.bookings;
  const minBookingDate = startOfDay(new Date());

  const isDateAvailable = (date: Date): boolean => {
    const dayName = format(date, "EEEE").toLowerCase();
    const dayHours = shopData?.openingHours?.[dayName];

    if (!dayHours || (dayHours.open === null && dayHours.close === null)) {
      return false;
    }

    return true;
  };

  const disabledDates = (date: Date) => {
    if (isBefore(date, minBookingDate)) {
      return true;
    }
    return !isDateAvailable(date);
  };

  const getClosingTime = (date: Date): Date | null => {
    if (!shopData?.openingHours) return null;

    const dayName = format(date, "EEEE").toLowerCase();
    const dayHours = shopData.openingHours[dayName];

    if (!dayHours || !dayHours.close) return null;

    return parse(dayHours.close, "HH:mm", date);
  };

  useEffect(() => {
    if (!shopData?.openingHours || initialSlotsProcessed.current) return;

    const slots = generateSlots(shopData?.openingHours, 30);
    setAllTimeSlots(slots);
    initialSlotsProcessed.current = true;
  }, [shopData?.openingHours]);

  useEffect(() => {
    if (
      Object.keys(allTimeSlots).length === 0 ||
      existingBookingsProcessed.current
    )
      return;

    const updatedSlots = JSON.parse(JSON.stringify(allTimeSlots));
    let slotsUpdated = false;

    existingBookings?.forEach((booking) => {
      const dateKey = new Date(booking.date).toDateString();
      const slotsForDate = updatedSlots[dateKey];

      if (slotsForDate) {
        booking.bookedTimeSlots.forEach((bookedTime) => {
          const slotIndex = slotsForDate.findIndex(
            (slot) => slot.time === bookedTime
          );
          if (slotIndex !== -1 && slotsForDate[slotIndex].available) {
            slotsForDate[slotIndex].available = false;
            slotsUpdated = true;
          }
        });
      }
    });

    if (slotsUpdated) {
      setAllTimeSlots(updatedSlots);
    }
    existingBookingsProcessed.current = true;
  }, [allTimeSlots, existingBookings]);

  useEffect(() => {
    if (!selectedDate) return;

    const dateKey = selectedDate.toDateString();
    const timeSlotsForDate = [...(allTimeSlots[dateKey] || [])];

    if (selectedServices.length === 0) {
      setAvailableTimes(timeSlotsForDate);
      return;
    }

    const closingTime = getClosingTime(selectedDate);
    if (!closingTime) {
      setAvailableTimes([]);
      return;
    }

    const totalServiceDuration = selectedServices.length * 30;

    const updatedTimes = timeSlotsForDate.map((slot, index) => {
      const isValidStartingSlot = (() => {
        for (let i = 0; i < selectedServices.length; i++) {
          if (
            index + i >= timeSlotsForDate.length ||
            !timeSlotsForDate[index + i].available
          ) {
            return false;
          }
        }

        try {
          const slotTime = parse(slot.time, "h:mm a", selectedDate);
          const endTime = addMinutes(slotTime, totalServiceDuration);
          if (endTime > closingTime) {
            return false;
          }
        } catch (err) {
          console.error("Error parsing time:", err);
          return false;
        }

        return true;
      })();

      return {
        ...slot,
        available: slot.available && isValidStartingSlot,
      };
    });

    setAvailableTimes(updatedTimes);
  }, [selectedDate, allTimeSlots, selectedServices]);

  useEffect(() => {
    if (!selectedDate || !selectedTime || selectedServices.length === 0) {
      setBookedTimeSlots([]);
      return;
    }

    const requiredSlots = selectedServices.length;
    const dateKey = selectedDate.toDateString();
    const allDateSlots = allTimeSlots[dateKey] || [];
    const startSlotIndex = allDateSlots.findIndex(
      (slot) => slot.time === selectedTime
    );

    const bookedSlots = [];
    for (let i = 0; i < requiredSlots; i++) {
      if (startSlotIndex + i < allDateSlots.length) {
        bookedSlots.push(allDateSlots[startSlotIndex + i].time);
      }
    }

    setBookedTimeSlots(bookedSlots);
  }, [selectedDate, selectedTime, selectedServices, allTimeSlots]);

  const toggleService = (service: IService) => {
    setSelectedTime(null);

    const existingService = selectedServices.find(
      (s) => s.serviceId === service.serviceId
    );

    if (existingService) {
      setSelectedServices(
        selectedServices.filter((s) => s.serviceId !== service.serviceId)
      );
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleTimeSelection = (time: string) => {
    if (!selectedDate || selectedServices.length === 0) return;

    setSelectedTime(time);

    const requiredSlots = selectedServices.length;
    const availableTimesCopy = JSON.parse(JSON.stringify(availableTimes));
    const startSlotIndex = availableTimesCopy.findIndex(
      (slot) => slot.time === time
    );

    for (let i = 0; i < requiredSlots; i++) {
      const slotIndex = startSlotIndex + i;
      if (slotIndex < availableTimesCopy.length) {
        if (i > 0) {
          availableTimesCopy[slotIndex].available = false;
        }
      }
    }

    setAvailableTimes(availableTimesCopy);
  };

  const calculateTotal = () => {
    const totalDuration = selectedServices.length * 30;
    const servicesTotal = selectedServices.reduce((total, service) => {
      return total + service.price;
    }, 0);
    const serviceFee = 5;
    const finalTotal = servicesTotal + serviceFee;

    return {
      subtotal: servicesTotal,
      serviceFee,
      total: finalTotal,
      totalDuration,
    };
  };

  const totals = calculateTotal();

  const handlePaymentSuccess = () => {
    navigate("/my-bookings");
  };

  const handleWalletPaymentSuccess = () => {
    payWithWallet(
      {
        bookedTimeSlots,
        clientId: user.userId || "",
        date: (selectedDate as Date) || "",
        duration: totals.totalDuration,
        services: selectedServices.map((s) => s.serviceId),
        shopId: shopId || "",
        startTime: selectedTime || "",
        total: totals.total,
      },
      {
        onSuccess: (data) => {
          successToast(data.message);
          navigate("/my-bookings");
        },
        onError: (error: any) => {
          errorToast(error.response.data.message);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mt-16 max-w-2xl mx-auto px-4 py-6">
        Loading shop details...
      </div>
    );
  }

  if (error || !shopData) {
    return (
      <div className="container mt-16 max-w-2xl mx-auto px-4 py-6">
        Error loading shop details. Please try again.
      </div>
    );
  }

  return (
    <div className="container mt-16 max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link to="/shops" className="mr-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">{shopData.shopName}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="mb-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
              Select Date
            </h2>
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={(date) => {
                    setSelectedDate(date || null);
                    setSelectedTime(null);
                  }}
                  disabled={disabledDates}
                  fromDate={minBookingDate}
                  className="rounded-md border"
                  classNames={{
                    day_today:
                      "bg-primary/10 text-primary font-bold border border-primary",
                    day_selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_disabled:
                      "text-muted-foreground opacity-40 line-through",
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {selectedDate && (
            <div className="mb-6">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
                Available Times
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {availableTimes.length > 0 ? (
                  availableTimes.map((slot) => (
                    <Button
                      key={slot.time}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "text-xs h-7 px-3 rounded-full",
                        selectedTime === slot.time &&
                          "bg-primary text-primary-foreground hover:bg-primary/90",
                        !slot.available && "opacity-40 cursor-not-allowed"
                      )}
                      disabled={!slot.available}
                      onClick={() => handleTimeSelection(slot.time)}
                    >
                      {slot.time}
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    No slots available for the selected date.
                  </p>
                )}
              </div>

              {selectedServices.length > 0 && selectedTime && (
                <div className="mt-3 px-2 py-1 bg-primary/10 rounded-md text-xs">
                  <p>
                    This booking will take {totals.totalDuration} minutes (
                    {selectedServices.length} slots)
                  </p>
                  <p>Start time: {selectedTime}</p>
                  <p>
                    End time:{" "}
                    {(() => {
                      try {
                        const startTime = parse(
                          selectedTime as string,
                          "h:mm a",
                          selectedDate as Date
                        );
                        const endTime = addMinutes(
                          startTime,
                          totals.totalDuration
                        );
                        return format(endTime, "h:mm a");
                      } catch (err) {
                        return "Unknown";
                      }
                    })()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
              Select Services
            </h2>
            <div className="space-y-2">
              {shopData.services?.map((service) => {
                const isSelected = selectedServices.some(
                  (s) => s.serviceId === service.serviceId
                );

                return (
                  <div
                    key={service.serviceId}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => toggleService(service)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <Scissors className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{service.name}</h3>
                        <p className="text-xs text-muted-foreground">30 min</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        ₹{service.price}
                      </span>
                      {isSelected && (
                        <Badge variant="outline" className="h-5 bg-primary/10">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedServices.length > 0 && (
            <div>
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
                Payment Summary
              </h2>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  {selectedServices.map((item) => (
                    <div
                      key={item.serviceId}
                      className="flex justify-between py-1.5 text-sm"
                    >
                      <span>{item.name}</span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}

                  <Separator className="my-3" />

                  <div className="flex justify-between py-1.5 text-sm">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>₹{totals.serviceFee}</span>
                  </div>

                  <div className="flex justify-between py-1.5 text-sm">
                    <span className="text-muted-foreground">
                      Total duration
                    </span>
                    <span>{totals.totalDuration} min</span>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between py-1.5 font-medium">
                    <span>Total</span>
                    <span>₹{totals.total}</span>
                  </div>

                  {selectedDate &&
                    selectedTime &&
                    bookedTimeSlots.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <WalletPaymentModal
                          amount={totals.total}
                          onPaymentConfirm={handleWalletPaymentSuccess}
                        />
                        <RazorpayButton
                          onSuccess={handlePaymentSuccess}
                          className="w-full"
                          amount={totals.total}
                          description="Slot Booking Payment"
                          onCreateOrder={() =>
                            createBooking({
                              bookedTimeSlots,
                              clientId: user.userId || "",
                              date: selectedDate || "",
                              duration: totals.totalDuration,
                              services: selectedServices.map(
                                (s) => s.serviceId
                              ),
                              shopId: shopId || "",
                              startTime: selectedTime || "",
                              total: totals.total,
                            })
                          }
                          onVerifyPayment={verifyPayment}
                          onFailure={handleFailureBookingPayment}
                        />
                      </div>
                    )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
