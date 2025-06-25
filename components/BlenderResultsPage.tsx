import { AppState } from '@/types/enums';
import { PlaylistTrack } from '@/types/global';
import { Track } from '@spotify/web-api-ts-sdk';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface BlenderResultPageProps {
  tasteMatch: string;
  ourSong: Track;
  playlist: PlaylistTrack[];
  setAppState: Dispatch<SetStateAction<AppState>>;
}

export default function BlenderResultsPage({ tasteMatch, ourSong, playlist }: BlenderResultPageProps) {
  const [visibleTexts, setVisibleTexts] = useState(0);
  // TEMP: songs for playlist mix 
  const [blendedSongs, setBlendedSongs] = useState([
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      match: "95%",
      albumArt: "🌟"
    },
    {
      id: 2,
      title: "Levitating",
      artist: "Dua Lipa",
      match: "92%",
      albumArt: "✨"
    },
    {
      id: 3,
      title: "Stay",
      artist: "The Kid LAROI & Justin Bieber",
      match: "89%",
      albumArt: "🎭"
    },
    {
      id: 4,
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      match: "87%",
      albumArt: "💜"
    },
    {
      id: 5,
      title: "Heat Waves",
      artist: "Glass Animals",
      match: "84%",
      albumArt: "🔥"
    }
  ]);

  // containers to display result
  // for the fade in effect
  const containers = [
    {
      id: 1,
      title: "Your Music Match is {}",
      subtitle: "You should be best friends if not already!",
      content: (
        <div></div>
      )
    },
    {
      id: 2,
      title: "Your Song",
      subtitle: "",
      content: (
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xl">🎵</span>
          </div>
          <div>
            <p className="text-white font-semibold">Blinding Lights - The Weekndlja;lj aklsjflka;jsflkaj lfk;jalkd ;fj fuck weeknd</p>
          </div>
        </div>

      )
    },
    {
      id: 3,
      title: "Your Blended Playlist",
      subtitle: "A perfect mix",
      content: (
        <div className="space-y-2">
          {blendedSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800/60 rounded-lg transition-colors duration-200 cursor-pointer group"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">{song.albumArt}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate group-hover:text-green-400 transition-colors">
                    {song.title}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {song.artist}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-green-500 text-xs font-medium">
                  {song.match}
                </span>
                <div className="w-1 h-1 bg-green-500 rounded-full opacity-75"></div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 4,
      title: "Search Shared Songs",
      subtitle: "Find songs you both love",
      content: (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for songs..."
              className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Song List */}
          <div className="space-y-2">
            {blendedSongs.map((song, index) => (
              <div
                key={`search-${song.id}`}
                className="flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800/60 rounded-lg transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">{song.albumArt}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate group-hover:text-green-400 transition-colors">
                      {song.title}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-green-500 text-xs font-medium">
                    {song.match}
                  </span>
                  <div className="w-1 h-1 bg-green-500 rounded-full opacity-75"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleTexts(prev => {
        if (prev < containers.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 650); // 1.5 second delay between each container

    return () => clearInterval(timer);
  }, [containers.length]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full space-y-8">
        {containers.map((container, index) => (
          <div
            key={container.id}
            className={`transition-opacity duration-1000 ${index < visibleTexts ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className="">
              <div className="mb-4">
                <h2 className="text-white text-xl md:text-2xl font-bold mb-1">
                  {container.title}
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                  {container.subtitle}
                </p>
              </div>
              <div className="mt-4">
                {container.content}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
