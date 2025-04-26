import { useEffect } from "react";
import { socket } from "./socket";
import { IBarber, IClient } from "@/types/User";

interface ConnectSocketProps {
  user: IBarber | IClient;
}

export const ConnectSocket = ({ user }: ConnectSocketProps) => {
  useEffect(() => {
    if (!user || !user.userId) return;
    socket.connect(); 
    
    socket.emit("registerUser", { userId: user.userId });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return null;
};
