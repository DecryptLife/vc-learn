// @ts-check
import React, { useCallback, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";

const RoomScreen = () => {
  const socket = useSocket();

  const handleUserJoined = useCallback((data: any) => {
    const { email, id } = data;
    console.log(`${email} joined the room`);
  }, []);
  useEffect(() => {
    socket?.on("user:joined", handleUserJoined);

    return () => {
      socket?.off("user:joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);
  return (
    <div>
      <h1>Room Screen</h1>
    </div>
  );
};

export default RoomScreen;
