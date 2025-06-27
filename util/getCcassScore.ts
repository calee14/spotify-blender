// app/util/getCcassScore.ts
import { UserTracks, UserArtists } from "@/types/global";

export default function getCcassScore(userTracks: UserTracks[], userArtists: UserArtists[]) {
  const user1Tracks = userTracks[0];
  const user2Tracks = userTracks[1];

  const user1TrackIds = new Set(user1Tracks.tracks.map(track => track.id));
  const uniqueSharedTrackIds = new Set<string>();

  const sharedTracks = user2Tracks.tracks.filter(track => {
    if (uniqueSharedTrackIds.has(track.id)) return false;
    if (user1TrackIds.has(track.id)) {
      uniqueSharedTrackIds.add(track.id);
      return true;
    }
    return false;
  });

  const sharedCount = sharedTracks.length;

  // 30 shared tracks is a max 80 points
  const maxSongScore = 80;
  const songScore = Math.min((sharedCount / 30) * maxSongScore, maxSongScore);

  // shared artists
  const user1Artists = userArtists[0];
  const user2Artists = userArtists[1];
  const user1ArtistIds = new Set(user1Artists.artists.map(artist => artist.artist.id));
  const uniqueSharedArtistIds = new Set<string>();

  const sharedArtists = user2Artists.artists.filter(artist => {
    if (uniqueSharedArtistIds.has(artist.artist.id)) return false;
    uniqueSharedArtistIds.add(artist.artist.id);
    return user1ArtistIds.has(artist.artist.id);
  });

  // shared artist points maxes at 10
  const artistScore = Math.min(sharedArtists.length * 1.5, 10);

  // artist bonus maxes at 10
  const user1ArtistTrackMap = new Map<string, Set<string>>();
  for (const track of user1Tracks.tracks) {
    for (const artist of track.artists) {
      if (!user1ArtistTrackMap.has(artist.id)) user1ArtistTrackMap.set(artist.id, new Set());
      user1ArtistTrackMap.get(artist.id)!.add(track.id);
    }
  }

  const user2ArtistTrackMap = new Map<string, Set<string>>();
  for (const track of user2Tracks.tracks) {
    for (const artist of track.artists) {
      if (!user2ArtistTrackMap.has(artist.id)) user2ArtistTrackMap.set(artist.id, new Set());
      user2ArtistTrackMap.get(artist.id)!.add(track.id);
    }
  }

  let deepArtistBonus = 0;
  for (const artistId of uniqueSharedArtistIds) {
    const songs1 = user1ArtistTrackMap.get(artistId) ?? new Set();
    const songs2 = user2ArtistTrackMap.get(artistId) ?? new Set();
    let shared = 0;
    for (const id of songs1) {
      if (songs2.has(id)) shared++;
    }
    if (shared >= 3) deepArtistBonus += 2.5;
  }

  deepArtistBonus = Math.min(deepArtistBonus, 10);

  // final score
  const totalScore = songScore + artistScore + deepArtistBonus;
  return Math.min(100, Math.round(totalScore));
}
