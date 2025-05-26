'use client';

import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

const spotifySDK = SpotifyApi.withClientCredentials(clientId, clientSecret);

export { spotifySDK };
