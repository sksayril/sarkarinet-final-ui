import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Download, RotateCw, RefreshCw } from 'lucide-react';

interface PhotoResizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhotoResizerModal: React.FC<PhotoResizerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resizedUrl, setResizedUrl] = useState<string>('');
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [quality, setQuality] = useState<number>(0.9);
  const [fileType, setFileType] = useState<string>('image/jpeg');
  const [error, setError] = useState<string>('');
  const [manualWidthChange, setManualWidthChange] = useState<boolean>(false);
  const [manualHeightChange, setManualHeightChange] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetImage();
    }
  }, [isOpen]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setError('');
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResizedUrl('');

      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        
        // Set default size maintaining aspect ratio
        const maxDimension = 800;
        let newWidth = img.width;
        let newHeight = img.height;
        
        if (img.width > maxDimension || img.height > maxDimension) {
          if (img.width > img.height) {
            newWidth = maxDimension;
            newHeight = Math.round((img.height * maxDimension) / img.width);
          } else {
            newHeight = maxDimension;
            newWidth = Math.round((img.width * maxDimension) / img.height);
          }
        }
        
        setWidth(newWidth);
        setHeight(newHeight);
      };
      img.onerror = () => {
        setError('Failed to load image. Please try another file.');
      };
      img.src = url;
    } else if (file) {
      setError('Please select a valid image file (JPEG, PNG, GIF, etc.)');
    }
  };

  const handleWidthChange = (newWidth: number) => {
    if (newWidth <= 0) return;
    
    setWidth(newWidth);
    setManualWidthChange(true);
    
    // Only auto-adjust height if aspect ratio is maintained AND user hasn't manually set height
    if (maintainAspectRatio && originalDimensions && !manualHeightChange) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newHeight = Math.round(newWidth / aspectRatio);
      setHeight(newHeight);
    }
  };

  const handleHeightChange = (newHeight: number) => {
    if (newHeight <= 0) return;
    
    setHeight(newHeight);
    setManualHeightChange(true);
    
    // Only auto-adjust width if aspect ratio is maintained AND user hasn't manually set width
    if (maintainAspectRatio && originalDimensions && !manualWidthChange) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newWidth = Math.round(newHeight * aspectRatio);
      setWidth(newWidth);
    }
  };

  // Force resize to exact dimensions regardless of aspect ratio
  const forceResizeToExactDimensions = () => {
    setMaintainAspectRatio(false);
  };

  const resizeImage = async () => {
    if (!selectedFile || !previewUrl) {
      setError('Please select an image first');
      return;
    }

    setIsResizing(true);
    setError('');

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = previewUrl;
      });

      // Set canvas dimensions to exact requested size
      canvas.width = width;
      canvas.height = height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Use better image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw resized image to exact dimensions
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to data URL with specified quality and type
      const mimeType = fileType === 'image/jpeg' ? 'image/jpeg' : 'image/png';
      const resizedDataUrl = canvas.toDataURL(mimeType, quality);
      
      setResizedUrl(resizedDataUrl);
      
      // Show success message
      console.log(`Image successfully resized to ${width}×${height} pixels`);
    } catch (err) {
      console.error('Error resizing image:', err);
      setError('Failed to resize image. Please try again.');
    } finally {
      setIsResizing(false);
    }
  };

  const downloadImage = () => {
    if (!resizedUrl) {
      setError('No resized image available. Please resize the image first.');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = resizedUrl;
      
      // Generate filename with dimensions
      const originalName = selectedFile?.name || 'image';
      const nameWithoutExt = originalName.split('.').slice(0, -1).join('.');
      const extension = fileType === 'image/jpeg' ? 'jpg' : 'png';
      const filename = `${nameWithoutExt}_${width}x${height}.${extension}`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading image:', err);
      setError('Failed to download image. Please try again.');
    }
  };

  const resetImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setResizedUrl('');
    setWidth(800);
    setHeight(600);
    setOriginalDimensions(null);
    setError('');
    setQuality(0.9);
    setFileType('image/jpeg');
    setManualWidthChange(false);
    setManualHeightChange(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const setPresetSize = (presetWidth: number, presetHeight: number) => {
    setWidth(presetWidth);
    setHeight(presetHeight);
    setManualWidthChange(false);
    setManualHeightChange(false);
    // Temporarily disable aspect ratio for preset sizes to allow exact dimensions
    if (maintainAspectRatio) {
      setMaintainAspectRatio(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[95vh] sm:h-[90vh] flex flex-col mx-auto">
        {/* Header with Orange-to-Red Gradient */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-t-lg">
          <h2 className="text-lg sm:text-2xl font-bold text-white">Photo & Signature Resizer</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-red-700 hover:bg-red-800 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-4 mt-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row p-4 sm:p-6 gap-4 sm:gap-6 overflow-y-auto">
          {/* Left Panel - Controls */}
          <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
            {/* Section 1: Photo Upload */}
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">1. Photo Upload Karein</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose File</span>
                </button>
                <span className="text-gray-600 font-medium text-sm sm:text-base break-all">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
              </div>
            </div>

            {/* Section 2: Size Input */}
            {selectedFile && (
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">2. Naya Size (pixels mein)</h3>
                
                {/* Original Dimensions Info */}
                {originalDimensions && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-blue-800 font-medium">
                      Original Size: {originalDimensions.width} × {originalDimensions.height} pixels
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (चौड़ाई)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      min="1"
                      max="4000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (लंबाई)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      min="1"
                      max="4000"
                    />
                  </div>
                </div>
                
                {/* Aspect Ratio Toggle */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 font-medium">Maintain aspect ratio (अनुपात बनाए रखें)</span>
                </div>
                {maintainAspectRatio && (
                  <p className="text-xs text-gray-500 italic">
                    Tip: Uncheck this to set exact dimensions like 1280×720
                  </p>
                )}

                {/* Quality and Format Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quality
                    </label>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value={1.0}>High (100%)</option>
                      <option value={0.9}>Good (90%)</option>
                      <option value={0.8}>Medium (80%)</option>
                      <option value={0.6}>Low (60%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Format
                    </label>
                    <select
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="image/jpeg">JPEG</option>
                      <option value="image/png">PNG</option>
                    </select>
                  </div>
                </div>
                
                {/* Quick Size Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      if (originalDimensions) {
                        setWidth(originalDimensions.width);
                        setHeight(originalDimensions.height);
                      }
                    }}
                    className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                  >
                    Original Size
                  </button>
                  <button
                    onClick={() => setPresetSize(1280, 720)}
                    className="px-3 py-1 text-xs bg-blue-200 hover:bg-blue-300 text-blue-700 rounded transition-colors font-medium"
                  >
                    1280×720 (HD)
                  </button>
                  <button
                    onClick={() => setPresetSize(1920, 1080)}
                    className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                  >
                    1920×1080 (Full HD)
                  </button>
                  <button
                    onClick={() => setPresetSize(800, 600)}
                    className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                  >
                    800×600
                  </button>
                  <button
                    onClick={() => setPresetSize(1024, 768)}
                    className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                  >
                    1024×768
                  </button>
                  <button
                    onClick={() => setPresetSize(400, 500)}
                    className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                  >
                    400×500 (Passport)
                  </button>
                  <button
                    onClick={() => setPresetSize(200, 200)}
                    className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                  >
                    200×200 (Profile)
                  </button>
                </div>
                
                {/* Resize Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={resizeImage}
                    disabled={isResizing}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                  >
                    {isResizing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span>Resizing...</span>
                      </div>
                    ) : (
                      "Resize Photo"
                    )}
                  </button>
                  
                  {/* Force HD Resize Button */}
                  <button
                    onClick={() => {
                      setWidth(1280);
                      setHeight(720);
                      setMaintainAspectRatio(false);
                      setManualWidthChange(false);
                      setManualHeightChange(false);
                      setTimeout(() => resizeImage(), 100);
                    }}
                    disabled={isResizing}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                  >
                    Force Resize to 1280×720 HD
                  </button>
                </div>
              </div>
            )}

            {/* Download Button */}
            {resizedUrl && (
              <button
                onClick={downloadImage}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-base sm:text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Download Resized Photo</span>
              </button>
            )}

            {/* Reset Button */}
            {selectedFile && (
              <button
                onClick={resetImage}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold text-base sm:text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-full">
            <div className="h-full bg-gray-100 rounded-lg p-3 sm:p-4 flex items-center justify-center">
              {previewUrl ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={resizedUrl || previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                  {resizedUrl && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      {width} × {height}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📷</div>
                  <p className="text-base sm:text-lg font-medium">Photo preview yahan dikhega</p>
                  <p className="text-xs sm:text-sm mt-2">Upload a photo to see preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoResizerModal; 