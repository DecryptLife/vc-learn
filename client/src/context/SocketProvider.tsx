// @ts-checkts

import React, { createContext, useContext, useMemo } from "react";
import { Socket, io } from "socket.io-client";

interface SocketContextProps {
  socket: Socket | null;
}

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketContext = createContext<SocketContextProps | null>(null);

// custom hook for using socket
export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context.socket;
};

export const SocketProvider = (props: SocketProviderProps) => {
  const socket = useMemo(() => io("localhost:3001"), []);

  const contextValue: SocketContextProps = { socket };
  return (
    <SocketContext.Provider value={contextValue}>
      {props.children}
    </SocketContext.Provider>
  );
};
