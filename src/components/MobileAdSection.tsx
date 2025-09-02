import React, { useEffect } from 'react';
import { waitForGoogleAds, getOptimizedAdConfig } from '../utils/adsHelper';

const MobileAdSection: React.FC = () => {
  useEffect(() => {
    // Wait for Google Ads to load and initialize for mobile
    waitForGoogleAds(() => {
      try {
        const adConfig = getOptimizedAdConfig();
        (window.adsbygoogle = window.adsbygoogle || []).push(adConfig);
      } catch (error) {
        console.error('Error initializing Mobile Google Ads:', error);
      }
    });
  }, []);

  return (
    <div className="w-full px-2 py-3 md:hidden">
      <div className="flex items-center justify-center">
        <div className="w-full">
          {/* Mobile Google Ads Container */}
          <ins 
            className="adsbygoogle"
            style={{ 
              display: 'block',
              textAlign: 'center',
              minHeight: '100px',
              width: '100%',
              maxWidth: '100%'
            }}
            data-ad-client="ca-pub-8453458415715594"
            data-ad-slot="6506881139"
            data-ad-format="auto"
            data-full-width-responsive="false"
            data-adtest="off"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileAdSection;
