'use client';

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import getUserIdFromUrl from "../util/getUserIdFromUrl";
import { getUser } from "../app/actions/spotify";
import { User } from "@spotify/web-api-ts-sdk";
import { AppState } from "../types/enums";
import { useRouter } from "next/navigation";
import ClipboardButton from "./ClipboardButton";

interface BlenderFormProps {
  setUsers: Dispatch<SetStateAction<User[]>>;
  setAppState: Dispatch<SetStateAction<AppState>>;
  errorMessage: string;
};

export default function BlenderForm({ setUsers, setAppState, errorMessage }: BlenderFormProps) {
  const [formData, setFormData] = useState({
    user1: '',
    user2: ''
  });
  const [user1InputError, setUser1InputError] = useState('');
  const [user2InputError, setUser2InputError] = useState('');
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUser1InputError('');
    setUser2InputError('');

    const userId1 = getUserIdFromUrl(formData['user1']);
    const userId2 = getUserIdFromUrl(formData['user2']);

    const users: User[] = [];

    let successUserFetch = true;
    // check users exist
    await getUser(userId1).then(({ success, user }) => {
      if (success) {
        users.push(user!);
      } else {
        successUserFetch = false;
        setUser1InputError('please enter a valid share-profile-link for this user');
      }
    });
    await getUser(userId2).then(({ success, user }) => {
      if (success) {
        users.push(user!);
      } else {
        successUserFetch = false;
        setUser2InputError('please enter a valid share-profile-link for this user');
      }
    });

    if (successUserFetch) {
      setUsers(users);
      setAppState(AppState.LOADING);
    }
  }

  return (
    <div className="sm:min-w-[26rem] items-center justify-center">
      <div className={`bg-[#131313] rounded-lg p-8 w-full max-w-md shadow-2xl duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-white text-2xl font-extrabold mb-2 text-center">
          🌟 blendify 🌟
        </h2>
        <p className="text-center text-sm font-medium">blend with spotify friends anytime, anywhere</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="field1" className="block text-sm font-medium text-[#b3b3b3] mb-2">
              share link of user #1
            </label>
            <input
              type="text"
              id="user1"
              name="user1"
              value={formData.user1}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3e3e3e] rounded-md text-white placeholder-[#6a6a6a] focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent transition-colors"
              placeholder="https://open.spotify.com/user/31pvare2eapogu5ow2pzndpnbvnu?si=c1cb9aa3cc0945c7"
              required
            />
            {user1InputError &&
              <p className="w-full text-red-400 text-sm">{user1InputError}</p>
            }

          </div>

          <div>
            <label htmlFor="field2" className="block text-sm font-medium text-[#b3b3b3] mb-2">
              share link of user #2
            </label>
            <input
              type="text"
              id="user2"
              name="user2"
              value={formData.user2}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3e3e3e] rounded-md text-white placeholder-[#6a6a6a] focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent transition-colors"
              placeholder="https://open.spotify.com/user/31pvare2eapogu5ow2pzndpnbvnu?si=c1cb9aa3cc0945c7"
              required
            />
            {user2InputError &&
              <p className="w-full text-red-400 text-sm">{user2InputError}</p>
            }
          </div>

          <button
            type="submit"
            className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold py-3 px-4 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:ring-offset-2 focus:ring-offset-[#121212]"
          >
            blend!
          </button>
        </form>

        <div className="mt-5">
          <button onClick={() => router.push("/sharelink")} className="text-[#1db954] text-sm hover:underline">
            need help finding share link?
          </button>
        </div>

        {errorMessage &&
          <p className="w-full text-red-400 text-sm">{errorMessage}</p>
        }
      </div>
      <div className="text-sm fixed bottom-2 right-2">
        <ClipboardButton value="contactblendifyapp@gmail.com">
          <p className="font-bold text-[#1db954]">contact us!</p>
        </ClipboardButton>
      </div>
    </div >
  );
}
