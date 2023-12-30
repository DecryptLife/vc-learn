// @ts-check
import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";

import peer from "../service/peer";

import { useSocket } from "../context/SocketProvider";

interface IncomingCallProps {
  from: string;
  offer: RTCSessionDescriptionInit;
}

interface CallAcceptedProps {
  from: string;
  ans: RTCSessionDescriptionInit;
}

const RoomScreen = () => {
  const [remoteID, setRemoteID] = useState<string>("");
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const socket = useSocket();

  const handleUserJoined = useCallback((data: any) => {
    const { email, id } = data;

    setRemoteID(id);

    const offer: Promise<RTCSessionDescriptionInit | undefined> =
      peer.getOffer();

    socket?.emit("user:call", { to: remoteID, offer });

    console.log(`${email} joined the room`);
  }, []);

  const handleIncomingCall = useCallback(
    async ({ from, offer }: IncomingCallProps) => {
      console.log("incoming call", from, offer);
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setMyStream(stream);
      const ans: RTCSessionDescriptionInit | undefined = await peer.getAnswer(
        offer
      );

      socket?.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );
  useEffect(() => {
    socket?.on("user:joined", handleUserJoined);
    socket?.on("incoming:call", handleIncomingCall);

    return () => {
      socket?.off("user:joined", handleUserJoined);
      socket?.off("incoming:call", handleIncomingCall);
    };
  }, [socket, handleUserJoined, handleIncomingCall]);

  const handleCallUser = useCallback(async () => {
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setMyStream(stream);
  }, [myStream]);
  return (
    <div>
      <h1>Room Screen</h1>
      <h4>{remoteID ? "Connected" : "No one in room"}</h4>
      {remoteID && <button onClick={handleCallUser}>CALL</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="300px"
            width="500px"
            url={myStream}
          />
        </>
      )}
    </div>
  );
};

export default RoomScreen;
