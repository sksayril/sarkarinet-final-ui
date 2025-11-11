import React from 'react';
import { Youtube, Send, MessageCircle } from 'lucide-react';

const SocialMediaAdSection: React.FC = () => {
  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full min-w-[1200px] px-4 py-3 bg-white">
      <div className="w-full flex items-center justify-center">
        {/* Social Media Buttons - Centered */}
        <div className="flex items-center justify-center space-x-10" style={{ margin: '8px 0', padding: '8px 0' }}>
            <button
              className="social-button-glow-red bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center space-x-3 hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 border-2 border-red-500 px-6 py-3"
              style={{ margin: '0 16px' }}
              onClick={() => handleLinkClick('https://youtube.com/@saarkariresult?si=quBrKwgYcOwAG1cC')}
              title="YouTube Channel"
              aria-label="Visit our YouTube channel"
            >
              <Youtube className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-base">YouTube</span>
            </button>
            <button
              className="social-button-glow-blue bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center space-x-3 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 border-2 border-blue-500 px-6 py-3"
              style={{ margin: '0 16px' }}
              onClick={() => handleLinkClick('https://t.me/sarkariresultofficiales')}
              title="Telegram Channel"
              aria-label="Visit our Telegram channel"
            >
              <Send className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-base">Telegram</span>
            </button>
            <button
              className="social-button-glow-green bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center space-x-3 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 border-2 border-green-500 px-6 py-3"
              style={{ margin: '0 16px' }}
              onClick={() => handleLinkClick('https://whatsapp.com/channel/0029VbBc0aUBPzjcFlv7HR2a')}
              title="WhatsApp Channel"
              aria-label="Visit our WhatsApp channel"
            >
              <MessageCircle className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-base">WhatsApp</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaAdSection;

