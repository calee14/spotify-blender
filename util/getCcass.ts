// app/util/getCcass.ts

import { ArtistData, UserArtists, UserTracks } from "@/types/global";
import { Track } from "@spotify/web-api-ts-sdk";

interface ArtistFrequency {
  artist: ArtistData;
  freq: number;
}
// matching algorithm
export default function getCcass(userTracks: UserTracks[], userArtists: UserArtists[]) {

  // pair shared tracks
  const user1Tracks = userTracks[0];
  const user2Tracks = userTracks[1];
  const user1TrackIds = new Set(user1Tracks.tracks.map((track) => track.id));
  const uniqueSharedTrackIds: Set<string> = new Set([]);
  const sharedTracks = user2Tracks.tracks.filter((track) => {
    if (uniqueSharedTrackIds.has(track.id)) { return false; }
    if (user1TrackIds.has(track.id)) {
      uniqueSharedTrackIds.add(track.id);
      return true;
    }
  });

  // find shared artists 
  const user1Artists = userArtists[0];
  const user2Artists = userArtists[1];
  const user1ArtistIds = new Set(user1Artists.artists.map((artist) => artist.artist.id));
  const user2ArtistIds = new Set(user2Artists.artists.map((artist) => artist.artist.id));
  const uniqueSharedArtistIds: Set<string> = new Set([]);
  const sharedArtists = user2Artists.artists.filter((artist) => {
    if (uniqueSharedArtistIds.has(artist.artist.id)) { return false; }
    uniqueSharedArtistIds.add(artist.artist.id);
    return user1ArtistIds.has(artist.artist.id);
  });

  userTracks.forEach((userTrack) => {
    userTrack.tracks = userTrack.tracks.filter((track) => !uniqueSharedTrackIds.has(track.id));
  });

  const user1ArtistTracks = new Map<string, Track[]>();
  const user2ArtistTracks = new Map<string, Track[]>();

  // freq of artists based on tracks
  const user1ArtistFreq = userTracks[0].tracks.reduce((map, track) => {
    const key = track.artists[0].id;
    if (!user1ArtistIds.has(key)) { return map; }
    map.set(key, (map.get(key) || 0) + 1);

    // update the artist tracks
    const artistTracks = user1ArtistTracks.get(key) || [];
    artistTracks.push(track);
    user1ArtistTracks.set(key, artistTracks);

    return map;
  }, new Map<string, number>());

  const user2ArtistFreq = userTracks[1].tracks.reduce((map, track) => {
    const key = track.artists[0].id;
    if (!user2ArtistIds.has(key)) { return map; }
    map.set(key, (map.get(key) || 0) + 1);

    // update the artist tracks
    const artistTracks = user2ArtistTracks.get(key) || [];
    artistTracks.push(track);
    user2ArtistTracks.set(key, artistTracks);

    return map;
  }, new Map<string, number>());

  const sharedArtistFreq: ArtistFrequency[] = sharedArtists.map((artist) => {
    const artistId = artist.artist.id;
    return {
      artist: artist, freq: (user1ArtistFreq.get(artistId) || 0) + (user2ArtistFreq.get(artistId) || 0)
    };
  });

  sharedArtistFreq.sort((a, b) => b.freq - a.freq);

  console.log(sharedArtistFreq);

  // select tracks for shared artists
  let group = true;
  for (let i = 0; i < sharedArtistFreq.length; i++) {
    const artist = sharedArtistFreq[i].artist;
    const user1Tracks: Track[] = user1ArtistTracks.get(artist.artist.id) || [];
    const user2Tracks: Track[] = user2ArtistTracks.get(artist.artist.id) || [];
    if ((group && user1Tracks.length > 0) || user2Tracks.length == 0) {
      console.log(user1Tracks[Math.floor(Math.random() * user1Tracks.length)].name);
      group = false;
    } else if ((!group && user2Tracks.length > 0) || user1Tracks.length == 0) {
      console.log(user2Tracks[Math.floor(Math.random() * user2Tracks.length)].name);
      group = true;
    }
  }

};
