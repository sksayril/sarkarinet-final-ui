// Google Ads Helper Utility
import { isMobile, getDeviceType } from './mobileDetection';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// Initialize Google Ads with mobile optimization
export const initializeGoogleAds = (): void => {
  try {
    if (window.adsbygoogle) {
      const deviceType = getDeviceType();
      console.log(`Initializing Google Ads for ${deviceType} device`);
      
      // Push ads with mobile-specific configuration
      (window.adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "ca-pub-8453458415715594",
        enable_page_level_ads: true,
        overlays: { bottom: true },
        device_type: deviceType
      });
    }
  } catch (error) {
    console.error('Error initializing Google Ads:', error);
  }
};

// Wait for Google Ads script to load and initialize
export const waitForGoogleAds = (callback: () => void): void => {
  if (window.adsbygoogle) {
    callback();
  } else {
    setTimeout(() => waitForGoogleAds(callback), 100);
  }
};

// Mobile-specific ad configuration
export const getMobileAdConfig = () => {
  const deviceType = getDeviceType();
  return {
    google_ad_client: "ca-pub-8453458415715594",
    google_ad_slot: "6506881139",
    google_ad_format: "auto",
    google_full_width_responsive: "true",
    google_adtest: "off",
    device_type: deviceType
  };
};

// Get optimized ad configuration based on device
export const getOptimizedAdConfig = () => {
  if (isMobile()) {
    return {
      ...getMobileAdConfig(),
      google_ad_format: "auto",
      google_full_width_responsive: "true"
    };
  }
  return getMobileAdConfig();
};
