'use client';

import { useEffect, useState } from "react";
import BlenderForm from "../components/BlenderForm";
import { AppState } from "../types/enums";
import { Track, User } from "@spotify/web-api-ts-sdk";
import getUserSongs from "../util/getUserSongs";
import getUserArtists from "../util/getUserArtists";
import BlenderLoadingPage from "../components/BlenderLoadingPage";
import BlenderSummaryPage from "../components/BlenderSummaryPage";
import BlenderResultsPage from "../components/BlenderResultsPage";
import getCcassScore from "@/util/getCcassScore";
import getCcass from "@/util/getCcass";
import { PlaylistTrack } from "@/types/global";

export default function Home() {

  const [users, setUsers] = useState<User[]>([]);

  const [appState, setAppState] = useState<AppState>(AppState.FORM);

  const userMap = new Map<string, User>();
  const [matchScore, setMatchScore] = useState(0);
  const [ourSong, setOurSong] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistTrack[]>([]);

  useEffect(() => {
    for (const user of users) {
      console.log(user.display_name);
    }
    users.forEach((user) => userMap.set(user.id, user));
  }, [users]);

  useEffect(() => {
    const handleAppState = async () => {
      switch (appState) {
        case AppState.FORM:
          break;
        case AppState.LOADING:
          try {
            const trackPromises = users.map(user => getUserSongs(user.id, 13));
            let userTracks = await Promise.all(trackPromises);
            let userArtists = await getUserArtists(userTracks);
            console.log(userTracks);
            console.log(userArtists);
            const matchScore = getCcassScore(userTracks, userArtists);
            setMatchScore(matchScore);
            console.log('love score', matchScore);

            const { ourSong, playlist } = getCcass(userTracks, userArtists);
            setOurSong(ourSong);
            setPlaylist(playlist);

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
        return <BlenderSummaryPage tasteMatch={`${matchScore}%`} songTitle={ourSong?.name || "unavailable"} setAppState={setAppState} />;
      case AppState.BLENDED:
        return <BlenderResultsPage tasteMatch={`${matchScore}%`} ourSong={ourSong!} playlist={playlist} setAppState={setAppState} />;
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
