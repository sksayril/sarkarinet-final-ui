import React, { useEffect } from 'react';

// Declare adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const LargeAdSection: React.FC = () => {

  useEffect(() => {
    // Initialize Google Ads for the large ad slot
    const initializeAds = () => {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log('Large Ad Slot initialized successfully');
        } else {
          // Wait for adsbygoogle to load
          setTimeout(initializeAds, 100);
        }
      } catch (error) {
        console.error('Error initializing Large Google Ads:', error);
      }
    };

    initializeAds();
  }, []);

  return (
    <div className="w-full px-2 sm:px-4 py-4">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-6xl">
          {/* Large Ad Slot - Test */}
          <ins 
            className="adsbygoogle large-ad"
            style={{
              display: 'inline-block',
              width: '900px',
              height: '250px'
            }}
            data-ad-client="ca-pub-8453458415715594"
            data-ad-slot="3305790696"
          />
        </div>
      </div>
    </div>
  );
};

export default LargeAdSection;
