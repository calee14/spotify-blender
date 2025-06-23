// app/util/getCcass.ts

import { ArtistData, PlaylistTrack, UserArtists, UserTracks } from "@/types/global";
import { Track } from "@spotify/web-api-ts-sdk";

interface ArtistFrequency {
  artist: ArtistData;
  freq: number;
}

const PLAYLIST_SIZE = 52; // divisible by 13

// matching algorithm
export default function getCcass(userTracks: UserTracks[], userArtists: UserArtists[]) {

  // final playlist
  let playlist: PlaylistTrack[] = [];

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

  playlist.push(...sharedTracks.map((track): PlaylistTrack => ({ track: track, originUser: [userTracks[0].userId, userTracks[1].userId] })));

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

  // remove shared tracks to avoid dup
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
  const numSharedArtistTracks = Array.from(user1ArtistTracks.values()).reduce((acc, val) => acc + val.length, 0) +
    Array.from(user1ArtistTracks.values()).reduce((acc, val) => acc + val.length, 0);

  let group = true;
  let count = 0;

  do {
    if (sharedArtistFreq.length == 0) { break; }
    const i = count % sharedArtistFreq.length;
    const artist = sharedArtistFreq[i].artist;
    const user1Tracks: Track[] = user1ArtistTracks.get(artist.artist.id) || [];
    const user2Tracks: Track[] = user2ArtistTracks.get(artist.artist.id) || [];

    // skip shared artist has no more tracks
    if (user1Tracks.length == 0 && user2Tracks.length == 0) {
      count += 1;
      continue;
    }

    if ((group && user1Tracks.length > 0) || user2Tracks.length == 0) {
      const randIndex = Math.floor(Math.random() * user1Tracks.length);
      playlist.push({ track: user1Tracks[randIndex], originUser: [userArtists[0].userId, userArtists[1].userId] });

      // del track, avoid dup
      user1Tracks.splice(randIndex, 1);
      user1ArtistTracks.set(artist.artist.id, user1Tracks);

      group = false;
    } else if ((!group && user2Tracks.length > 0) || user1Tracks.length == 0) {
      const randIndex = Math.floor(Math.random() * user2Tracks.length);
      playlist.push({ track: user2Tracks[randIndex], originUser: [userArtists[1].userId, userArtists[0].userId] });

      // del track, avoid dup
      user2Tracks.splice(randIndex, 1);
      user2ArtistTracks.set(artist.artist.id, user2Tracks);

      group = true;
    }
    count += 1;
  } while (count < numSharedArtistTracks && playlist.length <= 39);

  // fill up the rest of the playlist
  const takenSongs = new Set(playlist.map((pt) => pt.track.id));
  const user1LeftoverTracks = userTracks[0].tracks.filter((track) => !takenSongs.has(track.id));
  const user2LeftoverTracks = userTracks[1].tracks.filter((track) => !takenSongs.has(track.id));

  do {
    // skip shared artist has no more tracks
    if (user1LeftoverTracks.length == 0 && user2LeftoverTracks.length == 0) {
      break;
    }
    if ((group && user1LeftoverTracks.length > 0) || user2LeftoverTracks.length == 0) {
      const randIndex = Math.floor(Math.random() * user1LeftoverTracks.length);
      playlist.push({ track: user1LeftoverTracks[randIndex], originUser: [userArtists[0].userId] });

      // del track, avoid dup
      user1LeftoverTracks.splice(randIndex, 1);

      group = false;
    } else if ((!group && user2LeftoverTracks.length > 0) || user1LeftoverTracks.length == 0) {
      const randIndex = Math.floor(Math.random() * user2LeftoverTracks.length);
      playlist.push({ track: user2LeftoverTracks[randIndex], originUser: [userArtists[1].userId] });

      // del track, avoid dup
      user2LeftoverTracks.splice(randIndex, 1);

      group = true;
    }
    count += 1;
  } while (count < numSharedArtistTracks && playlist.length < PLAYLIST_SIZE)

  playlist.forEach((pt) => {
    console.log(pt.track.name, pt.originUser);
  });

};
