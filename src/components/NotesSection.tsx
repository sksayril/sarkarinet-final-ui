import React, { useEffect, useState } from 'react';
import { isMobile as checkMobile, getOptimalAdSize } from '../utils/mobileDetection';

// Declare adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const NotesSection: React.FC = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const updateMobileStatus = () => {
      const mobile = checkMobile();
      setIsMobileDevice(mobile);
    };

    updateMobileStatus();
    window.addEventListener('resize', updateMobileStatus);

    return () => window.removeEventListener('resize', updateMobileStatus);
  }, []);

  useEffect(() => {
    // Initialize Google Ads with mobile-responsive configuration
    const initializeAds = () => {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log(`Ads initialized for ${isMobileDevice ? 'mobile' : 'desktop'} device`);
        } else {
          // Wait for adsbygoogle to load
          setTimeout(initializeAds, 100);
        }
      } catch (error) {
        console.error('Error initializing Google Ads:', error);
      }
    };

    initializeAds();
  }, [isMobileDevice]);

  // Get responsive styles based on device
  const getAdStyles = () => {
    if (isMobileDevice) {
      return {
        display: 'block',
        width: '100%',
        height: 'auto',
        minHeight: '250px',
        maxWidth: '100%',
        margin: '8px auto',
        borderRadius: '8px',
        overflow: 'hidden'
      };
    }
    
    return {
      display: 'inline-block',
      width: '300px',
      height: '250px',
      margin: '8px auto',
      borderRadius: '4px',
      overflow: 'hidden'
    };
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-6xl">
          {/* Responsive Ad Slot 11 - Desktop & Mobile */}
          <ins 
            className="adsbygoogle"
            style={getAdStyles()}
            data-ad-client="ca-pub-8453458415715594"
            data-ad-slot="3305790696"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
};

export default NotesSection; 