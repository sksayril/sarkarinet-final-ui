// Mobile Detection Utility for Google Ads

// Check if device is mobile based on user agent
export const isMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
};

// Check if screen width is mobile size
export const isMobileScreen = (): boolean => {
  return window.innerWidth <= 768;
};

// Check if device is mobile (either by user agent or screen size)
export const isMobile = (): boolean => {
  return isMobileDevice() || isMobileScreen();
};

// Get device type for ad targeting
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobileDevice()) {
    return 'mobile';
  }
  if (window.innerWidth <= 1024) {
    return 'tablet';
  }
  return 'desktop';
};

// Check if viewport is mobile-friendly
export const isMobileViewport = (): boolean => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return false;
  
  const content = viewport.getAttribute('content');
  return content && content.includes('width=device-width');
};
