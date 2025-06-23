import { Artist, Track, User } from "@spotify/web-api-ts-sdk";

export interface UserTracks {
  userId: string;
  tracks: Track[];
}

export interface ArtistData {
  artist: Artist;
  genres: string[];
}

export interface UserArtists {
  userId: string;
  artists: ArtistData[];
}

export interface PlaylistTrack {
  track: Track;
  originUser: User[];
}
