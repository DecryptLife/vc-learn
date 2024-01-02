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
  const [remoteStream, setRemoteStream] = useState<MediaStream[] | null>(null);

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
      setRemoteID(from);
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

  const handleCallAccepted = useCallback(
    ({ from, ans }: CallAcceptedProps) => {
      peer.setLocalDescription(ans);
      console.log("Call accepted");

      for (const track in myStream?.getTracks()) {
        peer.peer?.addTrack(track, myStream);
      }
    },
    [myStream]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();

    socket?.emit("peer:nego:needed", { to: remoteID, offer });
  }, [remoteID, socket]);

  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);

      socket?.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  useEffect(() => {
    peer.peer?.addEventListener("negotiationneeded", handleNegoNeeded);

    return () => {
      peer.peer?.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    peer.peer?.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream);
    });
  }, [remoteStream]);

  useEffect(() => {
    socket?.on("user:joined", handleUserJoined);
    socket?.on("incoming:call", handleIncomingCall);
    socket?.on("call:accepted", handleCallAccepted);
    socket?.on("peer:nego:needed", handleNegoNeedIncoming);

    return () => {
      socket?.off("user:joined", handleUserJoined);
      socket?.off("incoming:call", handleIncomingCall);
      socket?.off("call:accepted", handleCallAccepted);
    };
  }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted]);

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

      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="300px"
            width="500px"
            url={remoteStream}
          />
        </>
      )}
    </div>
  );
};

export default RoomScreen;
