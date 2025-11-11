import React from 'react';
import { Youtube, Send, MessageCircle } from 'lucide-react';

const SocialMediaAdSection: React.FC = () => {
  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full min-w-[1200px] px-4 py-3 bg-white">
      <div className="w-full flex items-center justify-center">
        {/* Social Media Icons - Centered */}
        <div className="flex items-center justify-center space-x-4" style={{ margin: '8px 0', padding: '8px 0' }}>
            <button
              className="w-14 h-14 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-red-500"
              style={{ margin: '0 4px' }}
              onClick={() => handleLinkClick('https://youtube.com/@saarkariresult?si=quBrKwgYcOwAG1cC')}
              title="YouTube Channel"
              aria-label="Visit our YouTube channel"
            >
              <Youtube className="w-7 h-7 text-white" />
            </button>
            <button
              className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-blue-500"
              style={{ margin: '0 4px' }}
              onClick={() => handleLinkClick('https://t.me/sarkariresultofficiales')}
              title="Telegram Channel"
              aria-label="Visit our Telegram channel"
            >
              <Send className="w-7 h-7 text-white" />
            </button>
            <button
              className="w-14 h-14 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-green-500"
              style={{ margin: '0 4px' }}
              onClick={() => handleLinkClick('https://whatsapp.com/channel/0029VbBc0aUBPzjcFlv7HR2a')}
              title="WhatsApp Channel"
              aria-label="Visit our WhatsApp channel"
            >
              <MessageCircle className="w-7 h-7 text-white" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaAdSection;

