// app/util/getUserSongs.ts

import { MaxInt, Track } from "@spotify/web-api-ts-sdk";
import { getPlaylistSongs, getUserPlaylist } from "../actions/spotify";
import { UserTracks } from "../types/global";

// get all songs/tracks from user's top number of playlists (specified by limit)
export default async function getUserSongs(userId: string, limit: MaxInt<50> = 10): Promise<UserTracks> {

  return getUserPlaylist(userId, limit).then(({ success, playlists, error }) => {
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
    return { userId: userId, tracks: userTracks };
  });
}
