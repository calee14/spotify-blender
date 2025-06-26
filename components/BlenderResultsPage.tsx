import { AppState } from '@/types/enums';
import { PlaylistTrack } from '@/types/global';
import { Track, User } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { title } from 'node:process';
import React, { useState, useEffect, Dispatch, SetStateAction, useMemo } from 'react';

interface BlenderResultPageProps {
  tasteMatch: string;
  ourSong: Track;
  playlist: PlaylistTrack[];
  sharedTracks: Track[];
  userMap: Map<string, User>;
  setAppState: Dispatch<SetStateAction<AppState>>;
}

export default function BlenderResultsPage({ tasteMatch,
  ourSong,
  playlist,
  sharedTracks,
  userMap
}: BlenderResultPageProps) {

  const [visibleTexts, setVisibleTexts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSharedTracks = useMemo(() => {
    if (!searchQuery.trim()) {
      return sharedTracks;
    }
    const query = searchQuery.toLowerCase().trim();
    return sharedTracks.filter((track) =>
      track.name.toLowerCase().startsWith(query) ||
      track.artists.some((artist) => artist.name?.toLowerCase().startsWith(query))
    );
  }, [sharedTracks, searchQuery]);

  // containers to display result
  // for the fade in effect
  const containers = [
    {
      id: 1,
      title: `${[...userMap.values()].map((user) => user.display_name).join(" + ")}`,
      content: (
        <div className="flex space-x-4">
          {[...userMap.values()].map((user, index) =>
            <Image
              key={index}
              width={65}
              height={65}
              src={user.images.at(0)?.url || ''}
              alt='user'
              className="rounded-full"
              style={{ objectFit: 'cover' }}
            />)
          }
        </div>
      )
    },
    {
      id: 2,
      title: `Your Music Match is ${tasteMatch} `,
      subtitle: "You should be best friends if not already!",
      content: (
        <div></div>
      )
    },
    {
      id: 3,
      title: "Your Song",
      subtitle: "",
      content: (
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 flex items-center justify-center">
            <Image
              width={60}
              height={60}
              src={ourSong.album.images.at(0)?.url || ""}
              alt="🌟"
              className="rounded-md"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div>
            <p className="text-white font-semibold">{ourSong.name}</p>
            <p className="text-gray-400 text-xs truncate">
              {ourSong.artists.map((artist) => artist.name).join(',')}
            </p></div>
        </div>
      )
    },
    {
      id: 4,
      title: "Your Blended Playlist",
      subtitle: "A perfect mix",
      content: (
        <div className="">
          {playlist.map((song, index) => (
            <div
              key={index + 1}
              className="flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800/60 rounded-lg transition-colors duration-200 cursor-pointer group"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <Image
                    width={40}
                    height={40}
                    src={song.track.album.images.at(0)?.url || ""}
                    alt="🌟"
                    className="rounded-md"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate max-w-96 group-hover:text-green-400 transition-colors">
                    <a href={song.track.uri} className='hover:underline'>
                      {song.track.name}
                    </a>
                  </p>
                  <p className="text-gray-400 text-xs truncate max-w-96">
                    {song.track.artists.map((artist) => artist.name).join(',')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-green-500 text-xs font-medium flex">
                  {song.originUser.map((user, index) =>
                    <Image
                      key={index}
                      width={20}
                      height={20}
                      src={userMap.get(user)?.images.at(0)?.url || ''}
                      alt='user'
                      className="rounded-full -ml-1 first:ml-0"
                      style={{ objectFit: 'cover', zIndex: song.originUser.length - index }}
                    />)
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 5,
      title: "Search Shared Songs",
      subtitle: "Find songs you both love",
      content: (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <div className="max-h-96 overflow-scroll">
            {filteredSharedTracks.map((song, index) => (
              <div
                key={`search - ${song.id} `}
                className="flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800/60 rounded-lg transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-md flex items-center justify-center flex-shrink-0">
                    <Image
                      width={40}
                      height={40}
                      src={song.album.images.at(0)?.url || ""}
                      alt="🌟"
                      className="rounded-md"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate group-hover:text-green-400 transition-colors">
                      <a href={song.uri} className='hover:underline'>
                        {song.name}
                      </a>
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {song.artists.map((artist) => artist.name).join(',')}
                    </p>
                  </div>
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full space-y-8">
        {containers.map((container, index) => (
          <div
            key={container.id}
            className={`transition - opacity duration - 1000 ${index < visibleTexts ? 'opacity-100' : 'opacity-0'
              } `}
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
