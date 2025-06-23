// app/util/getCcass.ts

import { UserArtists, UserTracks } from "@/types/global";

// matching algorithm
export default function getCcass(userTracks: UserTracks[], userArtists: UserArtists[]) {

  // pair shared tracks
  const user1Tracks = userTracks[0];
  const user2Tracks = userTracks[1];
  const user1TrackIds = new Set(user1Tracks.tracks.map((track) => track.id));
  const uniqueSharedTrackIds: Set<string> = new Set([]);
  const sharedTracks = user2Tracks.tracks.filter((track) => {
    if (uniqueSharedTrackIds.has(track.id)) { return false; }
    uniqueSharedTrackIds.add(track.id);
    return user1TrackIds.has(track.id);
  });

  // find tracks from shared artists
  const user1Artists = userArtists[0];
  const user2Artists = userArtists[1];
  const user1ArtistIds = new Set(user1Artists.artists.map((artist) => artist.artist.id));
  // const sharedArtist
};
