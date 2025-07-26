import React, { useState, useEffect } from 'react';
import { Youtube, Send, MessageCircle, Linkedin, Cloud, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    youtube: 'https://www.youtube.com/channel/UCVT29pLEmQMg2PSWnIaKKdw'
  });
  const [googleCloudStatus, setGoogleCloudStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  useEffect(() => {
    const fetchChannelLinks = async () => {
      try {
        const response = await fetch('https://api.dhanlaxmii.com/home-content/public/active');
        
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
        setGoogleCloudStatus('connected');
        console.log('Google Cloud configuration loaded:', config.projectId);
      } else {
        setGoogleCloudStatus('error');
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
            <h1 className="text-7xl font-bold tracking-wider whitespace-nowrap">SARKARI RESULT</h1>
            

            <p className="text-4xl mt-2">WWW.SAARKARIRESULT.COM</p>

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
            {/* <Link to="/aivoice">
              <div 
                className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center cursor-pointer hover:from-purple-700 hover:to-purple-800 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 border-2 border-white shadow-black/50"
                title="AI Assistant"
                onClick={() => console.log('🤖 Header AI Assistant button clicked!')}
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
            </Link> */}
            
            {/* Test Thumbnail Popup Button */}
            {/* <button
              onClick={() => {
                if ((window as any).showThumbnailPopup) {
                  (window as any).showThumbnailPopup();
                } else {
                  console.log('Thumbnail popup not ready yet');
                }
              }}
              className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-white"
              title="Test Thumbnail Popup"
            >
              <span className="text-white text-xs font-bold">T</span>
            </button>
             */}
            {/* Thumbnail Status Indicator */}
            {/* <div className="text-white text-xs opacity-75">
              {localStorage.getItem('thumbnailPopupLastShown') ? (
                <span title={`Last shown: ${new Date(localStorage.getItem('thumbnailPopupLastShown')!).toLocaleString()}`}>
                  📸
                </span>
              ) : (
                <span title="Never shown">⏰</span>
              )}
            </div> */}
            
            {/* Google Cloud Status Indicator */}
            {/* <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-2xl ${
                googleCloudStatus === 'connected' 
                  ? 'bg-gradient-to-r from-green-600 to-green-700' 
                  : googleCloudStatus === 'error'
                  ? 'bg-gradient-to-r from-red-600 to-red-700'
                  : 'bg-gradient-to-r from-yellow-600 to-yellow-700'
              }`}
              title={`Google Cloud: ${googleCloudStatus === 'connected' ? 'Connected' : googleCloudStatus === 'error' ? 'Error' : 'Loading'}`}
            >
              <Cloud className="w-6 h-6 text-white" />
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;