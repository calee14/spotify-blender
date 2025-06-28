'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShareLink() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const handleBack = () => {
    router.push('/');
  };

  useEffect(() => {
    setIsVisible(true);
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className={`min-h-[600px] bg-[#131313] rounded-lg p-8 justify-center duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={handleBack}
          className="flex items-center text-white hover:text-green-400 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-white text-2xl font-extrabold mb-2 text-center">
          How to find the share link
        </h2>
        <div className="mb-7 mt-7">
          <p>Visit the user&aposs; Spotify profile. </p>
          <p>Click on the 3-dots button which will display a drop down.</p>
          <p>Click on the &quot;Copy link to profile&quot; button to copy share link.</p>
        </div>
        <Image
          src="/images/share_link.png"
          alt=""
          width={520}
          height={520}
          className="rounded-3xl"
          priority
        />
      </div>
    </div >
  );
}
