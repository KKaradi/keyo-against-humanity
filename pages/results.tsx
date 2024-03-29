import type { NextPage } from "next";
import Image from "next/image";
import Router from "next/router";
import { useRouter } from "next/router";
import { newGameClickedListener } from "../utils/firebase-utils/firebase-util";
import { resetGame } from "../utils/firebase-utils/firebase-util";
import {
  endSessionClicked,
  everyoneWentListener,
  getApplerForRound,
  resetRoom,
  gameResets,
  fetchLeaderboard,
} from "../utils/firebase-utils/firebase-util";
import { useState, useEffect } from "react";
import {
  fetchApplerImageURL,
  fetchCaptionVoteObject,
  nextRound,
  nextRoundHasBeenClicked,
} from "../utils/firebase-utils/firebase-util";

async function navToHome(roomID: number) {
  await Router.push({
    pathname: "/",
  });
  setTimeout(() => resetRoom(Number(roomID)), 10000);
}

async function navToLobby(userName: string, roomID: number) {
  await Router.push({
    pathname: "/lobby",
    query: {
      userName,
      roomID,
    },
  });
}
const Results: NextPage = () => {
  const router = useRouter();
  const {
    query: { userName, roomID },
  } = router;

  const [captionVotes, setCaptionVotes] = useState({});

  useEffect(() => {
    fetchCaptionVoteObject(Number(roomID)).then((captionVotes) => {
      setCaptionVotes(captionVotes);
    });
  }, [roomID]);

  const [applerUsername, setApplerUsername] = useState("");

  useEffect(() => {
    getApplerForRound(Number(roomID)).then((applerUsername) => {
      setApplerUsername(applerUsername);
    });
  }, [roomID]);

  const [leaderboard, setLeaderboard] = useState({});

  useEffect(() => {
    fetchLeaderboard(Number(roomID)).then((leaderboard) => {
      setLeaderboard(leaderboard);
    });
  }, [roomID]);

  const [imgURL, setImgURL] = useState("");

  useEffect(() => {
    fetchApplerImageURL(Number(roomID)).then((imgURL) => {
      setImgURL(imgURL);
    });
  }, [roomID]);

  const [newGame, setNewGame] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      const result = await gameResets(Number(roomID));
      setNewGame(result);
    };
    fetch();
  }, [roomID]);

  useEffect(() => {
    nextRoundHasBeenClicked(Number(roomID), () =>
      navToLobby(String(userName), Number(roomID))
    );
  }, [roomID, userName]);

  useEffect(() => {
    everyoneWentListener(Number(roomID), () => navToHome(Number(roomID)));
  }, [roomID]);

  useEffect(() => {
    newGameClickedListener(Number(roomID), () =>
      navToLobby(String(userName), Number(roomID))
    );
  }, [userName, roomID]);

  const waves = "/waveboi.png";
  const top = "/top.png";
  const gameOver = "/gameOver.png";

  return (
    <main>
      <Image
        src={top}
        width={10000}
        height={600}
        alt="shapes top header"
        className="top"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      ></meta>

      <ul className="flex-container">
        <li className="result-flex">
          <h1> </h1>
          <div>
            <Image
              className="resultsImage"
              src={imgURL}
              width={400}
              height={400}
              alt="Pretty Picture"
            ></Image>
          </div>
        </li>
        <li className="leaderboard-flex">
          <div>
            <Image
              className="gameImage"
              src={gameOver}
              height={150}
              width={200}
              alt="gameOver"
            ></Image>
          </div>
          <h3>RESULTS:</h3>
          <div>
            <div>
              {Object.keys(captionVotes).map((caption, index) => {
                return (
                  <div key={index}>
                    {caption} got{" "}
                    {captionVotes[caption as keyof typeof captionVotes]} votes.
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h3>LEADERBOARD:</h3>
            <div>
              {Object.keys(leaderboard).map((username, index) => {
                return (
                  <div key={index}>
                    {username} has{" "}
                    {leaderboard[username as keyof typeof leaderboard]} points.
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            {newGame ? (
              <div>
                <button
                  className="genbtn"
                  onClick={() => resetGame(Number(roomID))}
                >
                  New Game
                </button>
                <button
                  className="genbtn"
                  onClick={() => endSessionClicked(Number(roomID))}
                >
                  End Session
                </button>
              </div>
            ) : (
              <button
                className="nextbtn"
                onClick={() => nextRound(Number(roomID))}
              >
                Next Round
              </button>
            )}
          </div>
        </li>
      </ul>
      <Image
        src={waves}
        width={2400}
        height={400}
        alt="waves at the bottom of the screen"
        className="waveslobby"
      />
    </main>
  );
};

export default Results;
