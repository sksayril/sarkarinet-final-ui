import React, { useState, useRef } from 'react';
import { X, Upload, Download, RotateCw } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResizedUrl('');

      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        // Set default size but don't force aspect ratio
        setWidth(800);
        setHeight(600);
      };
      img.src = url;
    }
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    // Remove automatic aspect ratio linking - allow independent changes
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    // Remove automatic aspect ratio linking - allow independent changes
  };

  const resizeImage = () => {
    if (!selectedFile) return;

    setIsResizing(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let finalWidth = width;
      let finalHeight = height;
      
      // If maintain aspect ratio is enabled, calculate the proper dimensions
      if (maintainAspectRatio && originalDimensions) {
        const aspectRatio = originalDimensions.width / originalDimensions.height;
        if (width / height > aspectRatio) {
          // Width is proportionally larger, adjust height
          finalHeight = Math.round(width / aspectRatio);
        } else {
          // Height is proportionally larger, adjust width
          finalWidth = Math.round(height * aspectRatio);
        }
      }
      
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setResizedUrl(resizedDataUrl);
      }
      setIsResizing(false);
    };

    img.src = previewUrl;
  };

  const downloadImage = () => {
    if (!resizedUrl) return;

    const link = document.createElement('a');
    link.href = resizedUrl;
    link.download = `resized_${selectedFile?.name || 'image.jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setResizedUrl('');
    setWidth(800);
    setHeight(600);
    setOriginalDimensions(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Choose File
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
                    onClick={() => {
                      setWidth(800);
                      setHeight(600);
                    }}
                    className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                  >
                    800×600
                  </button>
                  <button
                    onClick={() => {
                      setWidth(1024);
                      setHeight(768);
                    }}
                    className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                  >
                    1024×768
                  </button>
                  <button
                    onClick={() => {
                      setWidth(1920);
                      setHeight(1080);
                    }}
                    className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                  >
                    1920×1080
                  </button>
                </div>
                
                {/* Resize Button */}
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
              </div>
            )}

            {/* Download Button */}
            {resizedUrl && (
              <button
                onClick={downloadImage}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-base sm:text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Download Resized Photo</span>
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