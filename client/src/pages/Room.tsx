// @ts-check
import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../context/SocketProvider";

const RoomScreen = () => {
  const [remoteID, setRemoteID] = useState<string>("");
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const socket = useSocket();

  const handleUserJoined = useCallback((data: any) => {
    const { email, id } = data;

    setRemoteID(id);

    console.log(`${email} joined the room`);
  }, []);
  useEffect(() => {
    socket?.on("user:joined", handleUserJoined);

    return () => {
      socket?.off("user:joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);

  const handleCallUser = useCallback(async () => {
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setMyStream(stream);
  }, []);
  return (
    <div>
      <h1>Room Screen</h1>
      <h4>{remoteID ? "Connected" : "No one in room"}</h4>
      {remoteID && <button onClick={handleCallUser}>CALL</button>}
      {myStream && (
        <ReactPlayer
          playing
          muted
          height="300px"
          width="500px"
          url={myStream}
        />
      )}
    </div>
  );
};

export default RoomScreen;
