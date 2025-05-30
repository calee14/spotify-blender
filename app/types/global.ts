import { Track } from "@spotify/web-api-ts-sdk";

export interface UserTracks {
  userId: string;
  tracks: Track[];
}
