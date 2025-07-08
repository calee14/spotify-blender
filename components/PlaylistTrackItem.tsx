import { Track, User } from "@spotify/web-api-ts-sdk";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface PlaylistTrackItemProps {
  index: string;
  toggleExpanded: (index: string) => void;
  song: Track;
  originUsers?: string[];
  userMap: Map<string, User>;
  expandedIndex: string | null;
  isIframeLoaded: boolean;
  setIsIframeLoaded: Dispatch<SetStateAction<boolean>>;
}

export default function PlaylistTrackItem({ index, toggleExpanded, song, originUsers, userMap, expandedIndex, isIframeLoaded, setIsIframeLoaded }: PlaylistTrackItemProps) {
  return (
    <div key={index}>
      <div
        onClick={() => toggleExpanded(index.toString())}
        className="flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800/60 rounded-lg transition-colors duration-200 cursor-pointer group"
      >
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 relative">
            <Image
              width={40}
              height={40}
              src={song.album.images.at(0)?.url || ""}
              alt="🌟"
              className="rounded-md w-[40px] h-[40px]"
              style={{ objectFit: 'cover' }}
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-3 h-3 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[10px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-0.5"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate max-w-48 sm:max-w-96 group-hover:text-[#1db954] transition-colors">
              <a className='hover:underline' href={song.uri}>
                {song.name}
              </a>
            </p>
            <p className="text-gray-400 text-xs truncate max-w-48 sm:max-w-96">
              {song.artists.map((artist) => artist.name).join(',')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <span className="text-xs font-medium flex">
            {originUsers && originUsers.map((user, index) =>
              <Image
                key={index}
                width={20}
                height={20}
                src={userMap.get(user)?.images.at(0)?.url || ''}
                alt='user'
                className="rounded-full w-[20px] h-[20px] -ml-1 first:ml-0"
                style={{ objectFit: 'cover', zIndex: originUsers.length - index }}
              />)
            }
          </span>
        </div>
      </div>
      {expandedIndex === index.toString() && (
        <div>
          <iframe
            style={{ borderRadius: "12px" }}
            src={`https://open.spotify.com/embed/${song.type === "episode" ? "episode" : "track"}/${song.id}?utm_source=generator`}
            width="100%"
            height="152"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className={`mt-2 mb-2 transition-all duration-[700ms] ease-out transform ${isIframeLoaded
              ? 'opacity-100'
              : 'opacity-0'
              }`}
            onLoad={() => setIsIframeLoaded(true)}
          >
          </iframe>
        </div>
      )}
    </div>

  )
}
