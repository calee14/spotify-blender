'use client';

import { useEffect, useState } from "react";
import BlenderForm from "../components/BlenderForm";
import { AppState } from "../types/enums";
import { User } from "@spotify/web-api-ts-sdk";
import getUserSongs from "../util/getUserSongs";
import getUserArtists from "../util/getUserArtists";
import BlenderLoadingPage from "../components/BlenderLoadingPage";
import BlenderSummaryPage from "../components/BlenderSummaryPage";
import BlenderResultsPage from "../components/BlenderResultsPage";
import getCcassScore from "@/util/getCcassScore";
import getCcass from "@/util/getCcass";

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
            let userTracks = await Promise.all(trackPromises);
            let userArtists = await getUserArtists(userTracks);
            console.log(userTracks);
            console.log(userArtists);
            getCcassScore(userTracks, userArtists);
            getCcass(userTracks, userArtists);

            setAppState(AppState.SUMMARIZE);
          } catch (error) {
            console.error('error getting user songs', error);
            setAppState(AppState.FORM);
          }
          break;
        case AppState.SUMMARIZE:
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

  const renderAppStates = () => {
    switch (appState) {
      case AppState.FORM:
        return <BlenderForm setUsers={setUsers} setAppState={setAppState} />;
      case AppState.LOADING:
        return <BlenderLoadingPage userNames={users.map((u) => u.display_name)} />;
      case AppState.SUMMARIZE:
        return <BlenderSummaryPage tasteMatch="98%" songTitle="Back to Me" setAppState={setAppState} />;
      case AppState.BLENDED:
        return <BlenderResultsPage />;
      default:
        return <div>Default content</div>;
    }
  }
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {renderAppStates()}
    </div>
  );
}
