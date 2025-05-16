import { ClientHome } from "@/components/client/ClientHome";
import { useGetClientHomeData } from "@/hooks/client/useGetHomeData";
import { IBooking } from "@/types/Booking";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const ClientHomePage = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [permissionDenied, setPermissionDenied] = useState(false);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setPermissionDenied(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location access is required to show nearby shops.");
          setPermissionDenied(true);
        }
      }
    );
  };
  
  useEffect(() => {
    const checkPermission = async () => {
      if (navigator.permissions) {
        const status = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });
  
        if (status.state === "granted") {
          getLocation();
        } else if (status.state === "prompt") {
          getLocation();
        } else if (status.state === "denied") {
          alert(
            "You've blocked location access. Please enable it from browser settings."
          );
          setPermissionDenied(true);
        }
  
        status.onchange = () => {
          if (status.state === "granted") {
            getLocation();
          }
        };
      } else {
        getLocation();
      }
    };
  
    checkPermission();
  }, []);  

  const { data: homeData, isLoading } = useGetClientHomeData({
    latitude: location?.lat as number | null,
    longitude: location?.lng as number | null,
  });

  const shops = homeData?.shops;
  const booking = homeData?.lastBooking;
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={"client-home"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <ClientHome
            shops={shops || []}
            booking={booking || ({} as IBooking)}
            isLoading={isLoading}
            getLocation={getLocation}
            permissionDenied={permissionDenied}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
};
