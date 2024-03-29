import type { NextPage } from "next";
import Image from "next/image";
import Router from "next/router";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  fetchListOfCaptions,
  getApplerForRound,
  vote,
  updateLeaderboard,
} from "../utils/firebase-utils/firebase-util";
import { fetchApplerImageURL } from "../utils/firebase-utils/firebase-util";
import { everyoneCastAVoteListener } from "../utils/firebase-utils/firebase-util";

async function navToResults(
  URL: string,
  userName: string,
  roomID: number,
  caption: string
) {
  await Router.push({
    pathname: "/results",
    query: {
      userName,
      roomID,
      URL,
      caption,
    },
  });
}

async function voteAndUpdateLeaderboard(roomID: number, caption: string) {
  await updateLeaderboard(Number(roomID), String(caption));
  await vote(String(caption), Number(roomID));
}

const Vote: NextPage = () => {
  const router = useRouter();
  const {
    query: { userName, roomID, caption, URL },
  } = router;

  const [applerUsername, setApplerUsername] = useState("");

  useEffect(() => {
    getApplerForRound(Number(roomID)).then((applerUsername) => {
      setApplerUsername(applerUsername);
    });
  }, [roomID]);

  const [imgURL, setImgURL] = useState("");

  useEffect(() => {
    fetchApplerImageURL(Number(roomID)).then((imgURL) => {
      setImgURL(imgURL);
    });
  }, [roomID]);

  const [voted, setVoted] = useState(false);

  function voteOnce(caption: string, roomID: number) {
    voteAndUpdateLeaderboard(Number(roomID), String(caption));
    setVoted(true);
  }

  const [captionList, setCaptionList] = useState([""]);

  useEffect(() => {
    fetchListOfCaptions(Number(roomID)).then((captionList) => {
      setCaptionList(captionList);
    });
  }, [roomID]);

  useEffect(() => {
    everyoneCastAVoteListener(Number(roomID), () =>
      navToResults(
        String(URL),
        String(userName),
        Number(roomID),
        String(caption)
      )
    );
  }, [URL, caption, roomID, userName]);

  const waves = "/waveboi.png";
  const top = "/top.png";

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
        <li className="lobby-flex">
          <h1>{applerUsername}&#39;S PAINTING</h1>
          <div className="generatedimg">
            <Image src={imgURL} width={400} height={400} alt="Pretty Picture" />
          </div>
        </li>
        <li className="lobby-flex">
          <h1>VOTE ON YOUR FAVORITE CAPTION</h1>
          <div>
            {voted ? (
              <h3>You Voted!</h3>
            ) : (
              <div>
                {captionList.map((caption) => (
                  <button
                    className="vote"
                    key={caption}
                    onClick={() => voteOnce(caption, Number(roomID))}
                  >
                    {caption}
                  </button>
                ))}
              </div>
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

export default Vote;
