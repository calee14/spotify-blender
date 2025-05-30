// app/util/getUserSongs.ts

import { Track } from "@spotify/web-api-ts-sdk";
import { getPlaylistSongs, getUserPlaylist } from "../actions/spotify";

export default async function getUserSongs(userId: string) {

  return getUserPlaylist(userId, 10).then(({ success, playlists, error }) => {
    let playlistIds: string[] = [];
    if (success) {
      playlists?.items.map((playlist) => {
        playlistIds.push(playlist.id);
      })
    }
    return playlistIds;
  }).then(async (playlistIds) => {
    let userTracks: Track[] = [];
    for (const playlistId of playlistIds) {
      await getPlaylistSongs(playlistId).then(({ success, songs, error }) => {
        let tracks: Track[] = [];
        if (success) {
          songs?.items.map((track) => {
            tracks.push(track.track);
          });
        }
        userTracks = [...userTracks, ...tracks];
      });
    }
    return userTracks;
  });
}
