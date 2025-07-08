'use client';

import { useEffect, useMemo, useState } from "react";
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

const NUM_PLAYLISTS_FETCHED = 13;

export default function Home() {

  const [users, setUsers] = useState<User[]>([]);

  const [appState, setAppState] = useState<AppState>(AppState.FORM);

  const userMap = useMemo(() => {
    const map = new Map<string, User>();
    users.forEach((user) => map.set(user.id, user));
    return map;
  }, [users]);

  const [matchScore, setMatchScore] = useState(0);
  const [ourSong, setOurSong] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistTrack[]>([]);
  const [sharedTracks, setSharedTracks] = useState<Track[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleAppState = async () => {
      switch (appState) {
        case AppState.FORM:
          break;
        case AppState.LOADING:
          try {
            const trackPromises = users.map(user => getUserSongs(user.id, NUM_PLAYLISTS_FETCHED));
            const userTracks = await Promise.all(trackPromises);
            const userArtists = await getUserArtists(userTracks);

            if (userTracks.some((userTracks => userTracks.tracks.length == 0))) {
              setErrorMessage("at least one user has no songs. please make sure both users have public playlists on their profile with at least one song.")
              throw Error("at least one user has no songs");
            }

            console.log(userTracks);
            console.log(userArtists);
            const matchScore = getCcassScore(userTracks, userArtists);
            setMatchScore(matchScore);
            console.log('love score', matchScore);

            const { ourSong, playlist, sharedTracks } = getCcass(userTracks, userArtists);
            setOurSong(ourSong);
            setPlaylist(playlist);
            setSharedTracks(sharedTracks);

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
        return <BlenderForm setUsers={setUsers} setAppState={setAppState} errorMessage={errorMessage} />;
      case AppState.LOADING:
        return <BlenderLoadingPage userNames={users.map((u) => u.display_name)} />;
      case AppState.SUMMARIZE:
        return <BlenderSummaryPage tasteMatch={`${matchScore}%`} songTitle={ourSong?.name || "unavailable"} setAppState={setAppState} />;
      case AppState.BLENDED:
        return <BlenderResultsPage tasteMatch={`${matchScore}%`} ourSong={ourSong!} playlist={playlist} sharedTracks={sharedTracks} userMap={userMap} setAppState={setAppState} />;
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
