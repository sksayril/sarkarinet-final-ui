import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const Banner: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const marqueeText = "🎯 कुछ समय पहले हमारा AI Quiz Feature लॉन्च हुआ, अभी ट्राई करें! SSC";

  const handleSpeechToggle = () => {
    if (isPlaying) {
      // Stop speech
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Start speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(marqueeText);
        utterance.lang = 'hi-IN'; // Hindi language
        utterance.rate = 0.8;
        utterance.pitch = 1;
        
        utterance.onend = () => {
          setIsPlaying(false);
        };
        
        utterance.onerror = () => {
          setIsPlaying(false);
        };
        
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      } else {
        alert('Text-to-speech is not supported in your browser');
      }
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup: stop speech when component unmounts
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="bg-yellow-400 text-black py-2 overflow-hidden">
      <div className="w-full min-w-[1200px] px-4">
        <div className="flex items-center space-x-4">
          {/* Speaker Button */}
          <button 
            onClick={handleSpeechToggle}
            className={`flex-shrink-0 p-3 rounded-full transition-colors ${
              isPlaying ? 'bg-red-500 text-white' : 'hover:bg-yellow-500'
            }`}
            title={isPlaying ? 'Stop Speech' : 'Play Speech'}
          >
            {isPlaying ? (
              <VolumeX className="w-8 h-8" />
            ) : (
              <Volume2 className="w-8 h-8" />
            )}
          </button>
          
          {/* Marquee Text */}
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-xl font-bold">
                {marqueeText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;