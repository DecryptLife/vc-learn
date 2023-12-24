// @ts-check

import React from "react";

const LobbyScreen = () => {
  return (
    <div>
      <h1>Lobby</h1>
      <form className="lobby_form">
        <label htmlFor="email">Email ID</label>
        <input type="email" name="email" id="uemail" />

        <label htmlFor="room_num">Room Number</label>
        <input type="number" name="room_num" id="room_num" />

        <button>Join</button>
      </form>
    </div>
  );
};

export default LobbyScreen;
