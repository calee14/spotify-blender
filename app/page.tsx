'use client';

import Image from "next/image";
import { spotifySDK } from "./lib/spotify";
import { ChangeEventHandler, useEffect, useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    user1: '',
    user2: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {

  };

  useEffect(() => {
    spotifySDK.search("The Beatles", ["artist"]).then((items) => {
      console.table(items.artists.items.map((item) => ({
        name: item.name,
        followers: item.followers.total,
        popularity: item.popularity,
      })));

    });

  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-[#131313] rounded-lg p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-white text-2xl font-extrabold mb-8 text-center">
          Spotify Blender
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="field1" className="block text-sm font-medium text-[#b3b3b3] mb-2">
              User #1
            </label>
            <input
              type="text"
              id="user1"
              name="user1"
              value={formData.user1}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3e3e3e] rounded-md text-white placeholder-[#6a6a6a] focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent transition-colors"
              placeholder="Enter artist name"
              required
            />
          </div>

          <div>
            <label htmlFor="field2" className="block text-sm font-medium text-[#b3b3b3] mb-2">
              User #2
            </label>
            <input
              type="text"
              id="user2"
              name="user2"
              value={formData.user2}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3e3e3e] rounded-md text-white placeholder-[#6a6a6a] focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent transition-colors"
              placeholder="Enter playlist name"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold py-3 px-4 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:ring-offset-2 focus:ring-offset-[#121212]"
          >
            Blend!
          </button>
        </form>
      </div>
    </div>
  );
}
