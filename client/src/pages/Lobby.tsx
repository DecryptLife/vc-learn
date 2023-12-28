// @ts-check

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();
  const socket = useSocket();

  const handleSubmit = useCallback(
    (e: any) => {
      e.preventDefault();
      socket?.emit("room:join", { email, room });
    },
    [email, room]
  );

  const handleJoinRoom = useCallback((data: any) => {
    const { email, room } = data;
    navigate(`/room/${room}`);
  }, []);

  useEffect(() => {
    socket?.on("room:join", handleJoinRoom);

    return () => {
      socket?.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div>
      <h1>Lobby</h1>
      <form className="lobby_form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          name="email"
          id="uemail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="room_num">Room Number</label>
        <input
          type="number"
          name="room_num"
          id="room_num"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button>Join</button>
      </form>
    </div>
  );
};

export default LobbyScreen;
