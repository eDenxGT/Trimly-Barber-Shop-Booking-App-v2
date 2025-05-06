import { createContext, useContext, useEffect } from "react";
import { socket } from "../lib/socket/socket";

const SocketContext = createContext(socket);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server 🚀");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server ❌");
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
