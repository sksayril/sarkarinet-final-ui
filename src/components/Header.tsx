import React, { useState, useEffect } from 'react';
import { Youtube, Send, MessageCircle } from 'lucide-react';
import { getGoogleCloudConfig } from '../utils/googleCloud';

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
    youtube: 'https://youtube.com/@saarkariresult?si=YT_rU7HguxmFx_uO'
  });

  useEffect(() => {
    const fetchChannelLinks = async () => {
      try {
        const response = await fetch('https://api.mydost.site/home-content/public/active');
        
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

    // Check Google Cloud configuration
    const checkGoogleCloud = () => {
      const config = getGoogleCloudConfig();
      if (config) {
        console.log('Google Cloud configuration loaded:', config.projectId);
      } else {
        console.warn('Google Cloud configuration not found');
      }
    };

    fetchChannelLinks();
    checkGoogleCloud();
  }, []);

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="bg-red-700 text-white">
      <div className="w-full min-w-[320px] px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo - Optimized for LCP */}
          <div className="w-24 h-24 md:w-30 md:h-30 bg-white rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img 
              src="/PhotoRoom-20250716_202655.webp" 
              alt="Sarkari Result Logo" 
              className="w-20 h-20 md:w-40 md:h-40 object-contain"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          
          {/* Centered Title - Optimized for LCP */}
          <div className="flex-1 text-center min-w-0">
            <h1 
              className="text-2xl font-bold tracking-wider whitespace-nowrap md:text-4xl lg:text-5xl"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontWeight: '700',
                letterSpacing: '0.05em',
                fontSize: 'clamp(1.5rem, 4vw, 3rem)'
              }}
            >
              SARKARI RESULT
            </h1>
            
            <p 
              className="text-lg mt-2 md:text-2xl lg:text-4xl"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: 'clamp(1.125rem, 3vw, 2.25rem)'
              }}
            >
              WWW.SAARKARIRESULT.COM
            </p>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <button
              className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center hover:from-red-700 hover:to-red-800 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 border-2 border-white shadow-black/50"
              onClick={() => handleLinkClick(channelLinks.youtube)}
              title="YouTube Channel"
              aria-label="Visit our YouTube channel"
            >
              <Youtube className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
            <button
              className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:from-blue-700 hover:to-blue-800 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 border-2 border-white shadow-black/50"
              onClick={() => handleLinkClick(channelLinks.telegram)}
              title="Telegram Channel"
              aria-label="Visit our Telegram channel"
            >
              <Send className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
            <button
              className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center hover:from-green-700 hover:to-green-800 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 border-2 border-white shadow-black/50"
              onClick={() => handleLinkClick(channelLinks.whatsapp)}
              title="WhatsApp Channel"
              aria-label="Visit our WhatsApp channel"
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;