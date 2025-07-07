import { AppState } from '@/types/enums';
import { PlaylistTrack } from '@/types/global';
import { Track, User } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
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

  // memo for search shared songs
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

  // shuffle the playlist
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]; // Create a copy to avoid mutating original

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }

    return shuffled;
  }

  const shuffledPlaylist = useMemo(() => {
    return shuffleArray(playlist);
  }, [playlist])

  // get matching msgs
function getMatchMessage(tasteMatch: string) {
  const justNumber = tasteMatch.replace(/[^\d.]/g, '');
  const match = Number(justNumber);

  if (match >= 91) {
    const messages = [
      {
        title: `It's true love at first listen 🫀🎧 (${match}%)`,
        subtitle: "It's fate. You two are in sync. 🤝",
      },
      {
        title: `I'm not like other... wait we're not like other... wait we ARE like each other 👯‍♀️⚔️🌎'`,
        subtitle: "Turns out, in a world of unique snowflakes❄️, you both somehow ended up with the same misunderstood brand of 'different.' Congratulations!",
      },
      {
        title: `Musical soulmates activated! ✨ (${match}%)`,
        subtitle: "This isn't just a match, it's destiny. You two could probably finish each other's songs.",
      },
      {
        title: `This isn't just a match, it was written in the stars. 💞✍️🌠`,
        subtitle: "Seriously, did you write this connection into existence? Because it's too good to be true.",
      },
      {
        title: `The crowds in stands went wild 📣🍻`,
        subtitle: "'Cause for a moment, we got to rule the world 🌎👑",
      },
      {
        title: `Warning: Extreme compatibility detected! 🚨 (${match}%)`,
        subtitle: "You're so in sync, you might start humming the same tune at the exact same time. Proceed with caution.⚠️",
      },
      {
        title: `A pair of aces 🂡🂱`,
        subtitle: "Never fold a winning hand 🤑💸💰"
      },
      {
        title: `Together at last 🔐💞`,
        subtitle: "The night we danced because we knew our lives would never be the same 🌌"
      },
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  } else if (match >= 78) {
    const messages = [
      {
        title: `Wedding bells are chiming 💒🔔🎵💞 (${match}%)`,
        subtitle: "Chances are you probably already share pre-marital playlists. Might as well tie the knot!",
      },
      {
        title: `Harmonics achieved! 🎶 (${match}%)`,
        subtitle: "Your tastes align like perfect chords. Time to compose that duet!",
      },
      {
        title: `Finally, someone else who "gets it." 🧠🙂‍↕️⨊`,
        subtitle: "You've found your rare breed. No more explaining your unique quirks because they just *know*. It's a beautiful thing.",
      },
      {
        title: `You two are partners in murder...ous musical connection 👀🫆🔍`,
        subtitle: "Consider yourselves co-conspirators in such excellent taste it's almost criminal. Prepare for effortless conversations and shared, slightly mischievous, laughs. 😉",
      },
      {
        title: `Practically psychic connection! 🔮🪬`,
        subtitle: "It’s like we can read each other's minds... or at least anticipate each other's next brilliant thought.",
      },
      {
        title: `Nailed it. You're musical kindred souls 💘`,
        subtitle: "Seriously, you two are a fantastic duo. The kind of match Taylor Swift write love songs about. 📝",
      },
      {
        title: `Roadtrip!! 🚗🎤 (${match}%)`,
        subtitle: "This kind of musical connection deserves a stadium tour. Or at least a really good car singalong. Best part is you both know all the lyrics",
      },
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  } else if (match >= 65) {
    const messages = [
      {
        title: `You share a groovy rhythm 🕺💃 (${match}%)`,
        subtitle: "Do I hear the same melody coming on? This could be the start of a beautiful symphony.",
      },
      {
        title: `Melody makers in the making! 🎼 (${match}%)`,
        subtitle: "There's definitely a shared beat here. Who knows what hits you'll discover together?",
      },
      {
        title: `More than just good company. ⚡️🎇`,
        subtitle: "There's a definite spark here. Think of it as a promising beginning to a very cool story.",
      },
      {
        title: `Not identical, but perfectly complementary. 🧩`,
        subtitle: "Think of yourselves as two puzzle pieces that just happen to fit perfectly.",
      },
      {
        title: `Roll out the trophies for the winners. 🏆🏆`,
        subtitle: "This match is a definite win. Enough common ground to be comfortable, enough difference to be exciting for fun discoveries and shared adventures. 🥾🌄",
      },
      {
        title: `Close enough to share earbuds! 🎧 (${match}%)`,
        subtitle: "There might be some awkward (or heated) skips but at least you're listening together 🚗🎶",
      },
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  } else if (match >= 52) {
    const messages = [
      {
        title: `Some overlap, some mystery... 🔍 (${match}%)`,
        subtitle: "This could grow into something.",
      },
      {
        title: `Tune in, turn on, and needle drop! 🤔 (${match}%)`,
        subtitle: "Enough common ground to build on, but plenty of new territory to explore. Start the record player! What's next on the playlist?",
      },
      {
        title: `Still figuring it out, and that's okay!`,
        subtitle: "Gray area is better than no area. Think of this as a blank canvas.",
      },
      {
        title: `I'm in Heaven! 😇 (${match}%)`,
        subtitle: "You know what they say 🥰 Heaven is a place on Earth -or- you killed each other from musical differences",
      },
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  } else {
    const messages = [
      {
        title: `Maybe not your other half... but the other half of music? 🎲 (${match}%)`,
        subtitle: "Opposites attract... sometimes",
      },
      {
        title: `Diversity is all the rave! 🤩🌝(${match}%)`,
        subtitle: "Or at least they make for interesting listening parties.",
      },
      {
        title: `The "it's complicated" of playlists 🤪 (${match}%)`,
        subtitle: "You probably won't be sharing headphones, but at least there will always be something new to listen to!",
      },
      {
        title: `Opposites attract... or at least coexist peacefully. ☮️👩‍⚖️👨‍⚖️`,
        subtitle: "Hey, at least you'll never run out of things to talk about (or gently debate! 🤺). Embrace the beautiful chaos.",
      },
      {
        title: `Houston, we have... differences. 🪐🌎🚀`,
        subtitle: "Your music tastes might be on different planets 🛸, but that just makes the journey to understanding more adventurous! 👽",
      },
      {
        title: `It's not you, it's just... everything else.`,
        subtitle: "Don't take it personally! Sometimes, the universe just likes to throw a curveball. ⚾️",
      },
      {
        title: `The chances of you two together? One in a million 🥺`,
        subtitle: "So you're telling me I have a chance. 🎰"
      },
      {
        title: `Time to test your dedication`,
        subtitle: "Patience is key. You know what they say, the curious cat 🐈‍⬛ was first to kill the worm 🪱"
      }
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

  // containers to display result
  // for the fade in effect
  const matchMessage = getMatchMessage(tasteMatch);
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
              className="rounded-full w-[65px] h-[65px]"
              style={{ objectFit: 'cover' }}
            />)
          }
        </div>
      )
    },
    {
      id: 2,
      title: matchMessage.title,
      subtitle: matchMessage.subtitle,
      content: (
        <div></div>
      )
    },
    {
      id: 3,
      title: "Your Song",
      subtitle: "",
      content: (
        <div className="flex items-center space-x-4 group">
          <div className="w-16 h-16 flex items-center justify-center">
            <Image
              width={60}
              height={60}
              src={ourSong.album.images.at(0)?.url || ""}
              alt="🌟"
              className="rounded-md w-[60px] h-[60px]"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold max-w-52 sm:max-w-96 truncate group-hover:text-green-400 transition-colors">
              <a href={ourSong.uri} className='hover:underline'>
                {ourSong.name}
              </a>
            </p>
            <p className="text-gray-400 text-xs truncate max-w-52 sm:max-w-96">
              {ourSong.artists.map((artist) => artist.name).join(',')}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Your Blended Playlist",
      subtitle: "A perfect mix",
      content: (
        <div className="">
          {shuffledPlaylist.map((song, index) => (
            <div
              key={index + 1}
              className="flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800/60 rounded-lg transition-colors duration-200 cursor-pointer group"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0">
                  <Image
                    width={40}
                    height={40}
                    src={song.track.album.images.at(0)?.url || ""}
                    alt="🌟"
                    className="rounded-md w-[40px] h-[40px]"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate max-w-52 sm:max-w-96 group-hover:text-green-400 transition-colors">
                    <a href={song.track.uri} className='hover:underline'>
                      {song.track.name}
                    </a>
                  </p>
                  <p className="text-gray-400 text-xs truncate max-w-52 sm:max-w-96">
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
                      className="rounded-full w-[20px] h-[20px] -ml-1 first:ml-0"
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
            {filteredSharedTracks.map((song) => (
              <div
                key={`search - ${song.id} `}
                className="flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800/60 rounded-lg transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 rounded-md flex items-center justify-center flex-shrink-0">
                    <Image
                      width={40}
                      height={40}
                      src={song.album.images.at(0)?.url || ""}
                      alt="🌟"
                      className="rounded-md w-[40px] h-[40px]"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate max-w-52 sm:max-w-96 group-hover:text-green-400 transition-colors">
                      <a href={song.uri} className='hover:underline'>
                        {song.name}
                      </a>
                    </p>
                    <p className="text-gray-400 text-xs truncate max-w-52 sm:max-w-96">
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
