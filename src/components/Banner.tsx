import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const Banner: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [marqueeDuration, setMarqueeDuration] = useState(180);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeText = `🎯 डियर फैमिली। कुछ समय पूर्व हमारी सरकारी रिजल्ट वेबसाइट का डोमेन हैक हो जाने के कारण हमें मजबूरन कुछ दिनों के लिए वेबसाइट को बंद करना पड़ा। इस असुविधा के लिए मैं आप सभी से ह्रदय से क्षमा प्रार्थी हूँ। लेकिन अब हम नई वेबसाइट और नए डाटा के साथ आप सभी की सेवा में फिर से उपस्थित हैं। हमारा उद्देश्य हमेशा की तरह आपकी पढ़ाई और करियर से जुड़ी जानकारी को सरल और सही तरीके से पहुचाना है। आप सभी से अनुरोध है की इस सूचना को अपने सभी मित्रों, छात्र साथियों और ग्रुप में जरूर साझा करें ताकि किसी को भी जानकारी के अभाव में परेशानी न हो। आप सभी का सहयोग और विश्वास ही हमारी सबसे बड़ी ताकत है। धन्यवाद एवं शुभकामनाएं। आपकी अपनी टीम। सरकारी रिजल्ट।`;

  const handleAudioToggle = () => {
    if (!audioRef.current) {
      // Create audio element if it doesn't exist
      audioRef.current = new Audio('/WhatsApp Audio 2025-07-18 at 22.42.08.mpeg');
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      audioRef.current.addEventListener('error', () => {
        setIsPlaying(false);
        alert('Error playing audio file');
      });
    }

    if (isPlaying) {
      // Stop audio
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      // Start audio
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        alert('Error playing audio file');
      });
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    // Calculate marquee duration based on text length
    const calculateMarqueeDuration = () => {
      if (marqueeRef.current) {
        const textWidth = marqueeRef.current.scrollWidth;
        const containerWidth = marqueeRef.current.parentElement?.clientWidth || 1200;
        // Calculate duration: very fast speed - 0.2 seconds per 100px of text width
        const duration = Math.max(30, (textWidth / 100) * 0.2);
        setMarqueeDuration(duration);
      }
    };

    // Calculate on mount and window resize
    calculateMarqueeDuration();
    window.addEventListener('resize', calculateMarqueeDuration);

    return () => {
      // Cleanup: stop audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      window.removeEventListener('resize', calculateMarqueeDuration);
    };
  }, []);

  return (
    <div className="bg-yellow-400 text-black py-3 overflow-hidden">
      <div className="w-full min-w-[1200px] px-4">
        <div className="flex items-center space-x-4">
          {/* Audio Button */}
          <button 
            onClick={handleAudioToggle}
            className={`flex-shrink-0 p-3 rounded-full transition-colors ${
              isPlaying ? 'bg-red-500 text-white' : 'hover:bg-yellow-500'
            }`}
            title={isPlaying ? 'Stop Audio' : 'Play Audio'}
          >
            {isPlaying ? (
              <VolumeX className="w-8 h-8" />
            ) : (
              <Volume2 className="w-8 h-8" />
            )}
          </button>
          
          {/* Marquee Text */}
          <div className="flex-1 overflow-hidden relative">
            <div 
              ref={marqueeRef}
              className="whitespace-nowrap flex"
              style={{
                animation: `marquee-slow ${marqueeDuration}s linear infinite`,
                animationPlayState: 'running'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.animationPlayState = 'paused';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animationPlayState = 'running';
              }}
            >
              <span className="text-xl font-bold px-4">
                {marqueeText}
              </span>
              <span className="text-xl font-bold px-4">
                {marqueeText}
              </span>
              <span className="text-xl font-bold px-4">
                {marqueeText}
              </span>
              <span className="text-xl font-bold px-4">
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