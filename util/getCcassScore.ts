// app/util/getCcassScore.ts
import { UserTracks, UserArtists } from "@/types/global";

export default function getCcassScore(userTracks: UserTracks[], userArtists: UserArtists[]) {
    const user1Tracks = userTracks[0];
    const user2Tracks = userTracks[1];

    const user1TrackIds = new Set(user1Tracks.tracks.map(track => track.id));
    const uniqueSharedTrackIds = new Set<string>();
    // only count shared tracks once 
    const sharedTracks = user2Tracks.tracks.filter(track => {
    if (uniqueSharedTrackIds.has(track.id)) return false;
    if (user1TrackIds.has(track.id)) {
        uniqueSharedTrackIds.add(track.id);
        return true;
    }
    return false;
    });
    // every shared song is 5 points
    const songScore = sharedTracks.length * 5;

    // shared artists
    const user1Artists = userArtists[0];
    const user2Artists = userArtists[1];
    const user1ArtistIds = new Set(user1Artists.artists.map(artist => artist.artist.id));
    const user2ArtistIds = new Set(user2Artists.artists.map(artist => artist.artist.id));

    const uniqueSharedArtistIds = new Set<string>();
    const sharedArtists = user2Artists.artists.filter(artist => {
        if (uniqueSharedArtistIds.has(artist.artist.id)) return false;
        uniqueSharedArtistIds.add(artist.artist.id);
        return user1ArtistIds.has(artist.artist.id);
    });
    // every shared artist is 2 pts
    const artistScore = sharedArtists.length * 3;

    // shared artist with 3+ shared songs

    // track grouped together by same artist
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

    // for each shared artist, check for 3+ same tracks
    let extraPts = 0;
    for (const artistId of uniqueSharedArtistIds) {
        const songs1 = user1ArtistTrackMap.get(artistId) ?? new Set();
        const songs2 = user2ArtistTrackMap.get(artistId) ?? new Set();

        let sharedCount = 0;
        for (const id of songs1) {
            if (songs2.has(id)) sharedCount++;
        }
        if (sharedCount >= 3) extraPts += 10;
    }

    // final score max 100
    const totalScore = 13 + songScore + artistScore + extraPts;
    const finalScore = Math.min(100, totalScore);

    return finalScore;
}
