import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface ThumbnailData {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  redirectUrl?: string;
  isActive: boolean;
}

const ThumbnailPopup: React.FC = () => {
  const [thumbnail, setThumbnail] = useState<ThumbnailData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if popup should be shown (24-hour interval)
  const shouldShowPopup = (): boolean => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return false;
    }
    
    const lastShown = localStorage.getItem('thumbnailPopupLastShown');
    
    // If no record exists, show popup (first time user)
    if (!lastShown) {
      console.log('🎯 First time user - showing thumbnail popup');
      return true;
    }

    const lastShownTime = new Date(lastShown).getTime();
    const currentTime = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    const timeDifference = currentTime - lastShownTime;
    const shouldShow = timeDifference >= twentyFourHours;
    
    console.log('⏰ Thumbnail popup check:', {
      lastShown: new Date(lastShown).toLocaleString(),
      currentTime: new Date().toLocaleString(),
      timeDifference: Math.round(timeDifference / (1000 * 60 * 60)) + ' hours',
      shouldShow
    });

    return shouldShow;
  };

  // Mark popup as shown
  const markPopupAsShown = () => {
    if (typeof window === 'undefined') return;
    
    const now = new Date().toISOString();
    localStorage.setItem('thumbnailPopupLastShown', now);
    console.log('✅ Thumbnail popup marked as shown at:', new Date(now).toLocaleString());
  };

  // Manual trigger function (for testing)
  const showPopup = () => {
    if (thumbnail) {
      setIsVisible(true);
      markPopupAsShown();
      console.log('🎯 Manual thumbnail popup triggered');
    } else {
      console.log('⚠️ No thumbnail data available for popup');
    }
  };

  // Expose showPopup function globally for testing
  React.useEffect(() => {
    (window as any).showThumbnailPopup = showPopup;
    (window as any).resetThumbnailPopup = () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('thumbnailPopupLastShown');
        console.log('🔄 Thumbnail popup timer reset - will show on next page load');
      }
    };
    (window as any).testThumbnailAPI = async () => {
      try {
        console.log('🧪 Testing thumbnail API...');
        const response = await fetch('https://api.dhanlaxmii.com/thumbnails');
        const data = await response.json();
        console.log('🧪 API Response:', data);
        console.log('🧪 Response type:', typeof data);
        console.log('🧪 Is array:', Array.isArray(data));
        if (Array.isArray(data)) {
          console.log('🧪 First item:', data[0]);
          console.log('🧪 First item keys:', Object.keys(data[0]));
        } else {
          console.log('🧪 Object keys:', Object.keys(data));
        }
      } catch (err) {
        console.error('🧪 API Test Error:', err);
      }
    };
    
    (window as any).createTestThumbnail = () => {
      const testThumbnail: ThumbnailData = {
        id: 'test',
        imageUrl: 'https://picsum.photos/400/300?random=2',
        title: 'Test Thumbnail',
        description: 'This is a test thumbnail to verify the popup works correctly',
        redirectUrl: 'https://sarkarinet.com',
        isActive: true
      };
      setThumbnail(testThumbnail);
      setIsVisible(true);
      console.log('🧪 Test thumbnail created and popup shown');
    };
    
    (window as any).createSimpleThumbnail = () => {
      const simpleThumbnail: ThumbnailData = {
        id: 'simple',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY0NmU1Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5UaHVtYm5haWwgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=',
        title: 'Simple Test Thumbnail',
        description: 'This is a simple test with embedded SVG image',
        redirectUrl: 'https://sarkarinet.com',
        isActive: true
      };
      setThumbnail(simpleThumbnail);
      setIsVisible(true);
      console.log('🧪 Simple thumbnail created and popup shown');
    };
    
    (window as any).createYourDataThumbnail = () => {
      const yourDataThumbnail: ThumbnailData = {
        id: 'your-data',
        imageUrl: 'https://api.dhanlaxmii.com/uploads/thumbnails/thumbnail-1753508570770-360167883.avif',
        title: 'testfestible',
        description: 'test',
        redirectUrl: 'https://github.com/sksayril/final-mahavitdemo-landingpage/blob/main/dist/index.html',
        isActive: true
      };
      setThumbnail(yourDataThumbnail);
      setIsVisible(true);
      console.log('🧪 Your data thumbnail created and popup shown');
    };
    return () => {
      delete (window as any).showThumbnailPopup;
      delete (window as any).resetThumbnailPopup;
      delete (window as any).testThumbnailAPI;
      delete (window as any).createTestThumbnail;
      delete (window as any).createSimpleThumbnail;
      delete (window as any).createYourDataThumbnail;
    };
  }, [thumbnail]);

  // Fetch thumbnail data
  const fetchThumbnail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📡 Fetching thumbnail from API...');
      const response = await fetch('https://api.dhanlaxmii.com/thumbnails');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📸 Thumbnail data received:', data);
      console.log('📊 Data type:', typeof data);
      console.log('📊 Is array:', Array.isArray(data));
      console.log('📊 Data keys:', Object.keys(data));

      // Handle different response formats
      let thumbnailData: any;
      
      if (Array.isArray(data)) {
        // If response is an array, take the first item (index 0)
        if (data.length === 0) {
          throw new Error('No thumbnails available');
        }
        thumbnailData = data[0]; // Get the first object from array
        console.log('🔍 Using first item from array (index 0):', thumbnailData);
      } else if (data.thumbnail || data.data) {
        // If response has thumbnail or data property
        thumbnailData = data.thumbnail || data.data;
      } else {
        // Assume the response is the thumbnail data directly
        thumbnailData = data;
      }

      console.log('🔍 Parsed thumbnail data:', thumbnailData);
      console.log('🔍 All thumbnail data keys:', Object.keys(thumbnailData));
      
      // Check for different possible image URL field names
      const possibleImageFields = ['imageUrl', 'image', 'url', 'image_url', 'thumbnail', 'file', 'path'];
      let imageUrl = null;
      
      console.log('🔍 Checking for image URL in fields:', possibleImageFields);
      console.log('🔍 Available fields in thumbnailData:', Object.keys(thumbnailData));
      
      for (const field of possibleImageFields) {
        console.log(`🔍 Checking field '${field}':`, (thumbnailData[0] as any)[field]);
        if ((thumbnailData[0] as any)[field]) {
          imageUrl = (thumbnailData[0] as any)[field];
          console.log(`✅ Found image URL in field '${field}':`, imageUrl);
          break;
        }
      }
      
      if (!imageUrl) {
        console.log('❌ No image URL found in any expected field');
        console.log('🔍 Available fields:', Object.keys(thumbnailData));
        
        // Try to use the 'url' field as a fallback if it exists
        if ((thumbnailData[0] as any).url) {
          imageUrl = (thumbnailData[0] as any).url;
          console.log('🔄 Using URL field as fallback image URL:', imageUrl);
        } else {
          throw new Error('No image URL found in thumbnail data');
        }
      }
      
      // Update the thumbnailData with the found imageUrl
      thumbnailData.imageUrl = imageUrl;
      console.log('🔍 Image URL before processing:', thumbnailData.imageUrl);

      console.log('🔍 Image URL:', thumbnailData.imageUrl);
      // Handle the specific URL format from your API
      if (thumbnailData[0].imageUrl) {
        // If the URL is relative, make it absolute
        if (thumbnailData[0].imageUrl.startsWith('/uploads/')) {
          thumbnailData[0].imageUrl = `https://api.dhanlaxmii.com${thumbnailData[0].imageUrl}`;
        }
        // If it's already a full URL, use it as is
        else if (thumbnailData[0].imageUrl.startsWith('http')) {
          // URL is already complete
        }
        // If it's just a filename, construct the full URL
        else {
          thumbnailData[0].imageUrl = `https://api.dhanlaxmii.com/${thumbnailData[0].imageUrl}`;
        }
        
        // Fix double slashes in URL (common issue)
        thumbnailData[0].imageUrl = thumbnailData[0].imageUrl.replace(/\/\//g, '/').replace('http:/', 'http://');
      }

      // Validate required fields
      if (!thumbnailData[0].imageUrl) {
        throw new Error('No image URL found in thumbnail data');
      }

      console.log('🔗 Final thumbnail URL:', thumbnailData[0].imageUrl);
      setThumbnail(thumbnailData[0]);
      console.log('✅ Thumbnail data set successfully');

    } catch (err) {
      console.error('❌ Error fetching thumbnail:', err);
      
      // Don't show error for connection refused (API not running)
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        console.log('🔄 API not available, using fallback thumbnail');
        setError(null); // Don't show error state
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch thumbnail');
      }
      
      // Set fallback thumbnail for testing
      const fallbackThumbnail: ThumbnailData = {
        id: 'fallback',
        imageUrl: 'https://picsum.photos/400/300?random=1',
        title: 'Welcome to Sarkari Net!',
        description: 'Your trusted source for government job updates and exam information.',
        redirectUrl: 'https://sarkarinet.com',
        isActive: true
      };
      
      console.log('🔄 Using fallback thumbnail for testing');
      setThumbnail(fallbackThumbnail);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if popup should be shown and show it
  const checkAndShowPopup = () => {
    if (shouldShowPopup()) {
      console.log('🎯 Showing thumbnail popup');
      setIsVisible(true);
      markPopupAsShown();
    } else {
      console.log('⏰ Thumbnail popup not due yet (24-hour interval)');
    }
  };

  // Fetch thumbnail on component mount and check popup
  useEffect(() => {
    // First check if popup should be shown (for first-time users)
    checkAndShowPopup();
    
    // Then fetch thumbnail data (only if we're in browser)
    if (typeof window !== 'undefined') {
      fetchThumbnail();
    }
  }, []);

  // Handle thumbnail click
  const handleThumbnailClick = () => {
    if (thumbnail?.redirectUrl) {
      console.log('🔗 Redirecting to:', thumbnail.redirectUrl);
      window.open(thumbnail.redirectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle close popup
  const handleClose = () => {
    setIsVisible(false);
  };

  // Don't render anything if not visible
  if (!isVisible) {
    return null;
  }



  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Popup Content */}
        <div 
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Loading State */}
          {isLoading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading thumbnail...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-8 text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Unable to Load Thumbnail</h3>
              <p className="text-gray-600 text-sm mb-4">{error}</p>
              <button
                onClick={fetchThumbnail}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Thumbnail Content */}
          {thumbnail && !isLoading && !error && (
            <>
              {/* Thumbnail Image */}
              <div 
                className={`relative cursor-pointer transition-transform duration-200 hover:scale-105 ${
                  thumbnail.redirectUrl ? 'hover:shadow-lg' : ''
                }`}
                onClick={handleThumbnailClick}
              >
                                 <img
                   src={thumbnail.imageUrl}
                   alt={thumbnail.title || 'Thumbnail'}
                   className="w-full h-auto object-cover"
                   onError={(e) => {
                     console.error('Failed to load thumbnail image, using fallback');
                     e.currentTarget.src = 'https://picsum.photos/400/300?random=3';
                   }}
                 />
                
                {/* Click indicator if URL is available */}
                {thumbnail.redirectUrl && (
                  <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>Click to visit</span>
                  </div>
                )}
              </div>

              {/* Content */}
              {(thumbnail.title || thumbnail.description) && (
                <div className="p-4">
                  {thumbnail.title && (
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {thumbnail.title}
                    </h3>
                  )}
                  {thumbnail.description && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {thumbnail.description}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex space-x-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
                {thumbnail.redirectUrl && (
                  <button
                    onClick={handleThumbnailClick}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Visit</span>
                  </button>
                )}
              </div>
            </>
          )}
                 </div>
       </div>
     </>
   );
};

export default ThumbnailPopup; 