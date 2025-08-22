import React, { useEffect } from 'react';

// Declare adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const NotesSection: React.FC = () => {
  useEffect(() => {
    // Load Google Ads script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8453458415715594';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    // Initialize ads when script loads
    script.onload = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Error loading Google Ads:', error);
      }
    };

    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full px-4 py-4">
      <div className="flex items-center justify-center">
        <div className="max-w-6xl w-full">
          {/* Google Ads Container */}
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-8453458415715594"
            data-ad-slot="6506881139"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
};

export default NotesSection; 