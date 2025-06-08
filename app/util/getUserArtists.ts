// app/util/getUserArtists.ts

import { MaxInt, Track } from "@spotify/web-api-ts-sdk";
import { getArtistsFromSongs } from "../actions/spotify";
import { UserTracks } from "../types/global";

export default async function getUserArtists(songs: Track[]) {

  getArtistsFromSongs(songs);
}
