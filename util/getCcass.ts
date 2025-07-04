// app/util/getCcass.ts

import { ArtistData, CcassPlaylist, PlaylistTrack, UserArtists, UserTracks } from "@/types/global";
import { Track } from "@spotify/web-api-ts-sdk";

interface ArtistFrequency {
  artist: ArtistData;
  freq: number;
}

const MAX_SHARED_SONGS = 13;
const MAX_SHARED_ARTIST_SONGS = 39;
const PLAYLIST_SIZE = 52; // divisible by 13

// matching algorithm
export default function getCcass(userTracks: UserTracks[], userArtists: UserArtists[]): CcassPlaylist {

  // final playlist
  let playlist: PlaylistTrack[] = [];
  // our song
  let ourSong: Track | null = null;

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

  // find our song if shared songs exist
  // finds our song which is the most frequently appearing shared track
  if (sharedTracks.length > 0) {
    const trackFrequencyMap = new Map<string, { track: Track; count: number }>();
    [user1Tracks, user2Tracks].forEach(userTrackData => {
      userTrackData.tracks.forEach(track => {
        if (uniqueSharedTrackIds.has(track.id)) {
          const existing = trackFrequencyMap.get(track.id);
          if (existing) {
            existing.count += 1;
          } else {
            trackFrequencyMap.set(track.id, { track, count: 1 });
          }
        }
      });
    });
    
    // track w appears most frequently
    let maxCount = 0;
    let mostFrequentTrack: Track | null = null;
    
    trackFrequencyMap.forEach(({ track, count }) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentTrack = track;
      }
    });
  
  // make our song to the most frequent shared track
  if (mostFrequentTrack && maxCount > 1) {
    ourSong = mostFrequentTrack;
    console.log(`Selected "our song": ${(ourSong as Track).name} (appeared ${maxCount} times)`);
  }
}


  // add shared songs to playlist
  playlist.push(...sharedTracks.slice(0, MAX_SHARED_SONGS).map((track): PlaylistTrack => ({ track: track, originUser: [userTracks[0].userId, userTracks[1].userId] })));

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
    const freq = (user1ArtistFreq.get(artistId) || 0) + (user2ArtistFreq.get(artistId) || 0);
    return {
      artist: artist, freq: freq
    };
  });

  sharedArtistFreq.sort((a, b) => b.freq - a.freq);
  console.log('shared artists', sharedArtists.map(a => a.artist.name));
  console.log('shared artist freq', sharedArtistFreq.map(m => `${m.artist.artist.name} ${m.freq}`))
  // helper func  to select and remove a random track
  function selectAndRemoveTrack(
    artistId: string,
    userTracks: Map<string, Track[]>,
    sharedArtistFreq: ArtistFrequency[],
    artistIndex: number
  ): { track: Track; updatedCount: number } | null {
    const tracks = userTracks.get(artistId) || [];
    if (tracks.length === 0) return null;

    const randIndex = Math.floor(Math.random() * tracks.length);
    const selectedTrack = tracks[randIndex];

    // remove track and update maps
    tracks.splice(randIndex, 1);
    userTracks.set(artistId, tracks);
    sharedArtistFreq[artistIndex].freq -= 1;

    return { track: selectedTrack, updatedCount: -1 };
  }

  // helper func to handle track selection logic
  function handleTrackSelection(
    group: boolean,
    artistIndex: number,
    artist: any,
    user1ArtistTracks: Map<string, Track[]>,
    user2ArtistTracks: Map<string, Track[]>,
    sharedArtistFreq: ArtistFrequency[],
    userArtists: any[]
  ): { selectedTrack: Track; originUser: string[]; newGroup: boolean } | null {
    const user1Tracks = user1ArtistTracks.get(artist.artist.id) || [];
    const user2Tracks = user2ArtistTracks.get(artist.artist.id) || [];

    if ((group && user1Tracks.length > 0) || user2Tracks.length == 0) {
      const result = selectAndRemoveTrack(artist.artist.id, user1ArtistTracks, sharedArtistFreq, artistIndex);
      if (result) {
        return {
          selectedTrack: result.track,
          originUser: [userArtists[0].userId, userArtists[1].userId],
          newGroup: false
        };
      }
    } else if ((!group && user2Tracks.length > 0) || user1Tracks.length == 0) {
      const result = selectAndRemoveTrack(artist.artist.id, user2ArtistTracks, sharedArtistFreq, artistIndex);
      if (result) {
        return {
          selectedTrack: result.track,
          originUser: [userArtists[1].userId, userArtists[0].userId],
          newGroup: true
        };
      }
    }

    return null;
  }
  // find the next shared artist with tracks
  const findAvailableArtist = () => {
    prevI += 1;
    prevI = prevI % sharedArtistFreq.length;
    for (let i = 0; i < sharedArtistFreq.length; i++) {
      if (sharedArtistFreq[(prevI + i) % sharedArtistFreq.length].freq > 0) {
        return (prevI + i) % sharedArtistFreq.length;
      }
    }
    return -1;
  }

  // select tracks for shared artists
  let numSharedArtistTracks = Array.from(user1ArtistTracks.values()).reduce((acc, val) => acc + val.length, 0) +
    Array.from(user2ArtistTracks.values()).reduce((acc, val) => acc + val.length, 0);

  let group = true;
  let prevI = -1;

  do {
    if (sharedArtistFreq.length == 0) { break; }
    const i = findAvailableArtist();
    if (i === -1) { break; }
    prevI = i;
    const artist = sharedArtistFreq[i].artist;
    console.log(artist.artist.name, i);
    const selection = handleTrackSelection(
      group, i, artist, user1ArtistTracks, user2ArtistTracks,
      sharedArtistFreq, userArtists
    );

    if (selection) {
      playlist.push({ track: selection.selectedTrack, originUser: selection.originUser });
      numSharedArtistTracks -= 1;
      group = selection.newGroup;
    }
  } while (numSharedArtistTracks > 0 && playlist.length <= MAX_SHARED_ARTIST_SONGS);

  // if shared tracks still available choose "our song" 
  if (!ourSong && numSharedArtistTracks > 0 && sharedArtistFreq.length > 0) {
    // introduce randomness to selecting shared artist for shared song
    prevI += Math.floor(Math.random() * sharedArtistFreq.length) % sharedArtistFreq.length;
    prevI = prevI % sharedArtistFreq.length;
    const i = findAvailableArtist();
    if (i !== -1) {
      prevI = i;
      const artist = sharedArtistFreq[i].artist;

      const selection = handleTrackSelection(
        group, i, artist, user1ArtistTracks, user2ArtistTracks,
        sharedArtistFreq, userArtists
      );

      if (selection) {
        ourSong = selection.selectedTrack;
        numSharedArtistTracks -= 1;
        group = selection.newGroup;
      }
    }
  }


  // fill up the rest of the playlist
  const takenSongs = new Set(playlist.map((pt) => pt.track.id));
  const user1LeftoverTracks = userTracks[0].tracks.filter((track) => !takenSongs.has(track.id));
  const user2LeftoverTracks = userTracks[1].tracks.filter((track) => !takenSongs.has(track.id));
  let numRemainingTracks = Array.from(user1LeftoverTracks.values()).reduce((acc, _) => acc + 1, 0) +
    Array.from(user2LeftoverTracks.values()).reduce((acc, _) => acc + 1, 0);

  do {
    // skip, no more tracks
    if ((user1LeftoverTracks.length == 0 && user2LeftoverTracks.length == 0) || playlist.length >= PLAYLIST_SIZE) {
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
    numRemainingTracks -= 1;
  } while (numRemainingTracks > 0 && playlist.length < PLAYLIST_SIZE)

  // find our song from track list
  if (!ourSong) {
    console.log('using the yolo');
    const userTrackList = userTracks[Math.floor(Math.random() * userTracks.length)].tracks;
    ourSong = userTrackList[Math.floor(Math.random() * userTrackList.length)];
  }

  playlist.forEach((pt) => {
    console.log(pt.track.name, pt.originUser);
  });

  console.log("our song: ", ourSong?.name);

  return { ourSong: ourSong, playlist: playlist, sharedTracks: sharedTracks };
};
