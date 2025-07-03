'use client';

import { useState } from 'react';

interface ClipboardButtonProps {
  value: string;
  children?: React.ReactNode;
}

export default function ClipboardButton({
  value,
  children = 'Copy Email',
}: ClipboardButtonProps) {
  const [showMessage, setShowMessage] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setShowMessage(true);

      // Hide message after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <>
      <button
        onClick={copyToClipboard}
      >
        {children}
      </button>

      {/* Message at bottom of screen */}
      {showMessage && (
        <div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out"
          style={{
            animation: 'fadeInUp 0.3s ease-in-out',
          }}
        >
          <div className="bg-[#1db954] font-bold text-white px-6 py-3 rounded-md shadow-lg text-xs">
            email copied to clipboard!
          </div>
        </div>
      )}

      {/* Inline keyframe animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
