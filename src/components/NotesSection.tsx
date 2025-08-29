import React, { useEffect } from 'react';

// Declare adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const NotesSection: React.FC = () => {

  useEffect(() => {
    // Initialize Google Ads with the exact configuration
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      console.log('Home Page ADS initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Ads:', error);
    }
  }, []);

  return (
    <div className="w-full px-2 sm:px-4 py-4">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-6xl">
          {/* Ad Slot 11 - Responsive */}
          <ins 
            className="adsbygoogle"
            style={{
              display: 'inline-block',
              width: '300px',
              height: '250px'
            }}
            data-ad-client="ca-pub-8453458415715594"
            data-ad-slot="4570770906"
          />
        </div>
      </div>
    </div>
  );
};

export default NotesSection; 