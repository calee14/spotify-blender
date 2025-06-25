// app/util/getUserArtists.ts

import { getArtistsFromSongs } from "../app/actions/spotify";
import { ArtistData, UserArtists, UserTracks } from "../types/global";

export default async function getUserArtists(users: UserTracks[]): Promise<UserArtists[]> {
  const trackPromises = users.map(user => getArtistsFromSongs(user.tracks).then(({ success, artists, error }) => {
    if (success) {
      if (artists == undefined) throw Error();
      artists = artists.filter((artist) => artist != null);
      const artistsData: ArtistData[] = artists!.map((artist) => { return { artist: artist, genres: artist.genres } });
      return { userId: user.userId, artists: artistsData };
    }
    return { userId: user.userId, artists: [] }
  })
  );
  return await Promise.all(trackPromises);
}
