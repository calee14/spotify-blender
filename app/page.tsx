'use client';

import { useEffect, useState } from "react";
import BlenderForm from "./components/BlenderForm";
import { AppState } from "./types/enums";
import { User } from "@spotify/web-api-ts-sdk";
import getUserSongs from "./util/getUserSongs";
import { getArtistsFromSongs } from "./actions/spotify";

export default function Home() {

  const [users, setUsers] = useState<User[]>([]);

  const [appState, setAppState] = useState<AppState>(AppState.FORM);

  useEffect(() => {
    for (const user of users) {
      console.log(user.display_name);
    }
  }, [users]);

  useEffect(() => {
    const handleAppState = async () => {
      switch (appState) {
        case AppState.FORM:
          break;
        case AppState.LOADING:
          try {
            const trackPromises = users.map(user => getUserSongs(user.id, 1));
            let tracks = await Promise.all(trackPromises);
            console.log(tracks);
            console.log(await getArtistsFromSongs(tracks.flatMap((t) => t.tracks)));

            setAppState(AppState.BLENDED);
          } catch (error) {
            console.error('error getting user songs');
            setAppState(AppState.FORM);
          }
          break;
        case AppState.BLENDED:
          console.log('blended');
          break;
        default:
          break;
      }
    }
    handleAppState();
  }, [appState]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <BlenderForm setUsers={setUsers} setAppState={setAppState} />
    </div>
  );
}
