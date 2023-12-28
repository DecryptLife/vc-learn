// @ts-check

import React, { useCallback, useState } from "react";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmit = useCallback(
    (e: any) => {
      e.preventDefault();
      console.log({
        email,
        room,
      });
    },
    [email, room]
  );
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
