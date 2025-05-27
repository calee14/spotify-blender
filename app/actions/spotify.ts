// app/actions/spotify.ts 
'use server';

import { spotifySDK } from "../lib/spotify";

export async function getUser(userId: string) {
  try {
    const user = await spotifySDK.users.profile(userId);
    return { success: true, user: user };
  } catch (error) {
    console.error('cannot find user with id: ', userId, error);
    return { success: false, error: 'failed to find user' };
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
