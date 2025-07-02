// app/actions/spotify.ts 
'use server';

import { spotifySDK } from "@/lib/spotify";
import { Artist, MaxInt, Track } from "@spotify/web-api-ts-sdk";

export async function getUser(userId: string) {
  try {
    const user = await spotifySDK.users.profile(userId);
    return { success: true, user: user };
  } catch (error) {
    console.error('cannot find user with id: ', userId, error);
    return { success: false, error: 'failed to find user' };
  }
}

export async function getUserPlaylist(userId: string, limit: MaxInt<50> = 10) {
  try {
    const playlists = await spotifySDK.playlists.getUsersPlaylists(userId, limit);
    return { success: true, playlists: playlists };
  } catch (error) {
    console.error('cannot find playlists of user with id: ', userId, error);
    return { success: false, error: 'failed to get playlist' };
  }
}

export async function getArtistsFromSongs(songs: Track[]) {
  try {
    const artists: Artist[] = [];

    const uniqueArtistIds = new Set<string>();

    songs.filter((track) => track !== null && track !== undefined)
      .map((track) => track.artists[0].id)
      .forEach((id) => uniqueArtistIds.add(id));

    const tempUniqueArtistIds = Array.from(uniqueArtistIds);
    for (let i = 0; i < tempUniqueArtistIds.length; i += 50) {
      const chunk = tempUniqueArtistIds.slice(i, i + 50).filter(artist => artist !== null);
      const artistChunk = await spotifySDK.artists.get(chunk);
      artists.push(...artistChunk);
    }

    return { success: true, artists: artists };
  } catch (error) {
    console.error('cannot find artists for given list of songs', error);
    return { success: false, error: 'failed to get artists' };
  }
}

export async function getPlaylistSongs(playlistId: string) {
  try {
    const songs = await spotifySDK.playlists.getPlaylistItems(playlistId);
    return { success: true, songs: songs };
  } catch (error) {
    console.error('cannot find songs in playlist with id: ', playlistId, error);
    return { success: false, error: 'failed to get playlist' };
  }
}

export async function searchSpotify(query: string) {
  try {
    const results = await spotifySDK.search(query, ['track', 'artist']);
    return { success: true, data: results };
  } catch (error) {
    console.error('Spotify search error:', error);
    return { success: false, error: 'Failed to search Spotify' };
  }
}
