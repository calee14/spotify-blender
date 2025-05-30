'use client';

import { useEffect, useState } from "react";
import BlenderForm from "./components/BlenderForm";
import { AppState } from "./types/enums";
import { User } from "@spotify/web-api-ts-sdk";
import getUserSongs from "./util/getUserSongs";

export default function Home() {

  const [users, setUsers] = useState<User[]>([]);

  const [appState, setAppState] = useState<AppState>(AppState.FORM);

  useEffect(() => {
    for (const user of users) {
      console.log(user.display_name);
    }
  }, [users]);

  useEffect(() => {
    switch (appState) {
      case AppState.FORM:
        break;
      case AppState.LOADING:
        let user = users[0];
        getUserSongs(user.id).then((tracks) => {
          for (const track of tracks) {
            console.log(track.name);
          }
          setAppState(AppState.BLENDED);
        });
        break;
      case AppState.BLENDED:
        console.log('blended');
        break;
      default:
        break;
    }
  }, [appState]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <BlenderForm setUsers={setUsers} setAppState={setAppState} />
    </div>
  );
}
