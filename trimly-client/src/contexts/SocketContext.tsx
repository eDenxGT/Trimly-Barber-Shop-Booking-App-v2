import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../lib/socket/socket";

const SocketContext = createContext(socket);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server 🚀");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server ❌");
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
