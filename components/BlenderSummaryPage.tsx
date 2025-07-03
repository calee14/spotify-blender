import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { AppState } from '../types/enums';

interface BlenderSummaryPageProps {
  tasteMatch: string;
  songTitle: string;
  setAppState: Dispatch<SetStateAction<AppState>>;
  displayDuration?: number; // Duration for each text in milliseconds
}

export default function BlenderSummaryPage({
  tasteMatch,
  songTitle,
  setAppState,
  displayDuration = 4000
}: BlenderSummaryPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const messages = [
    `Your taste match is ${tasteMatch}`,
    `The song that brings you together is "${songTitle}"`
  ];

  const handleSkip = () => {
    if (currentStep === 0) {
      // Skip to second message
      setIsVisible(false);
      setTimeout(() => {
        setCurrentStep(1);
        setIsVisible(true);
      }, 300);
    } else {
      // Skip to completion
      setIsVisible(false);
      setTimeout(() => {
        setAppState(AppState.BLENDED);
      }, 300);
    }
  };

  useEffect(() => {
    // Initial fade in
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 800);

    // Handle transitions
    const transitionTimeout = setTimeout(() => {
      if (currentStep === 0) {
        // Fade out first message
        setIsVisible(false);

        // Fade in second message after transition
        setTimeout(() => {
          setCurrentStep(1);
          setIsVisible(true);
        }, 1000);
      } else {
        // Fade out second message and call callback
        setIsVisible(false);
        setTimeout(() => {
          setAppState(AppState.BLENDED);
        }, 1000);
      }
    }, displayDuration);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(transitionTimeout);
    };
  }, [currentStep, displayDuration, setAppState]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-8 right-8 text-black bg-[#1DB954] hover:bg-[#1ED760] px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 active:scale-100"
      >
        Skip
      </button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-12 px-8">

        {/* Main text display */}
        <div className="text-center max-w-4xl">
          <h1
            className={`text-white text-3xl md:text-5xl lg:text-5xl font-bold leading-tight transition-all duration-1000 transform ${isVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-12 scale-95'
              }`}
          >
            {messages[currentStep]}
          </h1>
        </div>


      </div>
      {/* Progress indicator - now fixed at bottom */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {messages.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-500 ${index === currentStep
              ? 'bg-[#1db954] scale-125'
              : index < currentStep
                ? 'bg-green-300'
                : 'bg-gray-600'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
