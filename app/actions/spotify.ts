// app/actions/spotify.ts 
'use server';

import { IBM_Plex_Sans_JP } from "next/font/google";
import { spotifySDK } from "@/lib/spotify";
import { MaxInt, Track } from "@spotify/web-api-ts-sdk";

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
    const uniqueArtistIds = new Set<string>();
    songs.map((track) => {
      return track.artists[0].id;
    }).forEach((id) => uniqueArtistIds.add(id));

    const artists = await spotifySDK.artists.get([...uniqueArtistIds]);
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
