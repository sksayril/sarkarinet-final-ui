import React, { useState, useEffect } from 'react';
import { Youtube, Send, MessageCircle, Linkedin, } from 'lucide-react';

interface HomeContentData {
  _id: string;
  title: string;
  description: string;
  telegramLink: string;
  whatsappLink: string;
  faqs: any[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: HomeContentData;
}

const Header: React.FC = () => {
  const [channelLinks, setChannelLinks] = useState({
    whatsapp: 'https://whatsapp.com/channel/0029Vb64LpHKbYMM6c72230S',
    telegram: 'https://t.me/saarkariresult',
    youtube: 'https://www.youtube.com/channel/UCVT29pLEmQMg2PSWnIaKKdw'
  });

  useEffect(() => {
    const fetchChannelLinks = async () => {
      try {
        const response = await fetch('http://localhost:3110/home-content/public/active');
        
        if (response.ok) {
          const result: ApiResponse = await response.json();
          
          if (result.success && result.data) {
            setChannelLinks(prev => ({
              ...prev,
              whatsapp: result.data.whatsappLink || prev.whatsapp,
              telegram: result.data.telegramLink || prev.telegram
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching channel links:', error);
        // Keep default links if API fails
      }
    };

    fetchChannelLinks();
  }, []);

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="bg-red-700 text-white">
      <div className="w-full min-w-[1200px] px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="w-30 h-30 bg-white rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img 
              src="/PhotoRoom-20250716_202655.png" 
              alt="Sarkari Result Logo" 
              className="w-40 h-40 object-contain"
            />
          </div>
          
          {/* Centered Title */}
          <div className="flex-1 text-center">
            <h1 className="text-6xl font-bold tracking-wider whitespace-nowrap">SARKARI RESULT</h1>
            <p className="text-4xl mt-2">www.sarkariresult.com</p>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div 
              className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center cursor-pointer hover:from-red-700 hover:to-red-800 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 border-2 border-white shadow-black/50"
              onClick={() => handleLinkClick(channelLinks.youtube)}
              title="YouTube Channel"
            >
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <div 
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:from-blue-700 hover:to-blue-800 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 border-2 border-white shadow-black/50"
              onClick={() => handleLinkClick(channelLinks.telegram)}
              title="Telegram Channel"
            >
              <Send className="w-6 h-6 text-white" />
            </div>
            <div 
              className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center cursor-pointer hover:from-green-700 hover:to-green-800 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 border-2 border-white shadow-black/50"
              onClick={() => handleLinkClick(channelLinks.whatsapp)}
              title="WhatsApp Channel"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;