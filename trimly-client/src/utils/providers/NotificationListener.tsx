import { useEffect } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { useToaster } from "@/hooks/ui/useToaster";

export const NotificationListener = () => {
  const socket = useSocket();
  const { infoToast } = useToaster();

  useEffect(() => {
    socket.on(
      "receive-notification",
      (notificationData: { message: string }) => {
        infoToast(`New Notification: ${notificationData.message}`);
      }
    );

    return () => {
      socket.off("receive-notification");
    };
  }, [socket]); 

  return null; 
};
