import React, { useEffect } from 'react';
import { waitForGoogleAds, getOptimizedAdConfig } from '../utils/adsHelper';

const NotesSection: React.FC = () => {

  useEffect(() => {
    // Wait for Google Ads to load and initialize
    waitForGoogleAds(() => {
      try {
        const adConfig = getOptimizedAdConfig();
        (window.adsbygoogle = window.adsbygoogle || []).push(adConfig);
      } catch (error) {
        console.error('Error initializing Google Ads:', error);
      }
    });
  }, []);

  return (
    <div className="w-full px-2 sm:px-4 pt-0 pb-4" style={{ marginTop: '0', paddingTop: '0', marginBottom: '0' }}>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-6xl">
          {/* Google Ads Container - Mobile Responsive */}
          <ins 
            className="adsbygoogle"
            style={{ 
              display: 'block',
              textAlign: 'center',
              minHeight: '90px',
              width: '100%'
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

export default NotesSection; 