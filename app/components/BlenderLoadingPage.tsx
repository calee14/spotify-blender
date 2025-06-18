import { useState, useEffect } from 'react';

interface BlenderLoadingPageProps {
  userNames: string[]
};

export default function BlenderLoadingPage({ userNames }: BlenderLoadingPageProps) {
  const getTwoRandomUsers = () => {
    if (userNames.length < 2) return { user1: '', user2: '' };

    const shuffled = [...userNames].sort(() => 0.5 - Math.random());
    return { user1: shuffled[0], user2: shuffled[1] };
  }

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState(getTwoRandomUsers());

  const getLoadingTexts = () => {
    const { user1, user2 } = selectedUsers;
    return [
      "Finding your vibe...",
      `Mixing ${user1} and ${user2}'s music...`,
      `Finding compatibility between ${user1} and ${user2}...`,
      "Loading your playlist...",
      `Creating the perfect blend for ${user1}...`,
      "Getting the party started...",
      `Syncing ${user2}'s favorite tracks...`,
      `Preparing ${user1} and ${user2}'s experience...`,
      "Tuning the beat..."
    ];
  }

  const [loadingTexts, setLoadingTexts] = useState(getLoadingTexts());

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        // pick new users for loading texts 
        if (Math.random() < 0.39) { // 39% chance to pick new users
          setSelectedUsers(getTwoRandomUsers());
        }
        setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLoadingTexts(getLoadingTexts());
  }, [selectedUsers]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">


        {/* Loading animation circles */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2.6s'
              }}
            ></div>
          ))}
        </div>

        {/* Animated text */}
        <div className="h-8 flex items-center justify-center">
          <p
            className={`text-white text-xl font-extrabold transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {loadingTexts[currentTextIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
