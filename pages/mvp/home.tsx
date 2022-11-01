import type { NextPage } from "next";
import Router from "next/router";
import { SetStateAction, useState } from "react";
import { createRoom } from "../../utils/firebase-utils/firebase-util";
import { joinRoom } from "../../utils/firebase-utils/firebase-util";

const Home: NextPage = () => {
  const [userName, setUserName] = useState("");

  const inputUserName = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setUserName(event.target.value);
  };

  let [roomID, setRoomID] = useState("");

  const inputRoomID = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setRoomID(event.target.value);
  };

  async function navToLobby() {
    await Router.push({
      pathname: "/mvp/lobby",
      query: {
        userName,
        roomID,
      },
    });
  }

  function joinRoomNavToLobby() {
    joinRoom(userName, Number(roomID));
    navToLobby();
  }

  function createRoomNavToLobby() {
    createRoom(Number(roomID));
    joinRoomNavToLobby();
  }

  return (
    <main>
      <h1>Keyo Against Humanity</h1>
      <div>
        <p>Username</p>
        <input
          type="text"
          id="message"
          name="message"
          onChange={inputUserName}
          value={userName}
        />
      </div>
      <div>
        <p>Room Code</p>
        <input
          type="text"
          id="message"
          name="message"
          onChange={inputRoomID}
          value={roomID}
        />
      </div>
      <div>
        <button onClick={() => joinRoomNavToLobby()}>Join Room</button>
      </div>
      <div>
        <button onClick={() => createRoomNavToLobby()}>Create Room</button>
      </div>
    </main>
  );
};

export default Home;
