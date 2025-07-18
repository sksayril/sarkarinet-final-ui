import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Download, RotateCw, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const PhotoResizer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resizedUrl, setResizedUrl] = useState<string>('');
  const [width, setWidth] = useState<string>('800');
  const [height, setHeight] = useState<string>('600');
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
        setWidth('800');
        setHeight('600');
      };
      img.src = url;
    }
  };

  const handleWidthChange = (newWidth: string) => {
    setWidth(newWidth);
    // Remove automatic aspect ratio linking - allow independent changes
  };

  const handleHeightChange = (newHeight: string) => {
    setHeight(newHeight);
    // Remove automatic aspect ratio linking - allow independent changes
  };

  const resizeImage = () => {
    if (!selectedFile) return;

    // Convert string values to numbers, use 0 if empty or invalid
    const widthNum = parseInt(width) || 0;
    const heightNum = parseInt(height) || 0;

    if (widthNum === 0 || heightNum === 0) {
      alert('Please enter valid width and height values');
      return;
    }

    setIsResizing(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let finalWidth = widthNum;
      let finalHeight = heightNum;
      
      // If maintain aspect ratio is enabled, calculate the proper dimensions
      if (maintainAspectRatio && originalDimensions) {
        const aspectRatio = originalDimensions.width / originalDimensions.height;
        if (widthNum / heightNum > aspectRatio) {
          // Width is proportionally larger, adjust height
          finalHeight = Math.round(widthNum / aspectRatio);
        } else {
          // Height is proportionally larger, adjust width
          finalWidth = Math.round(heightNum * aspectRatio);
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
    setWidth('800');
    setHeight('600');
    setOriginalDimensions(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:text-purple-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
            <span className="font-semibold text-lg">Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold">Photo & Signature Resizer</h1>
          <div></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Panel - Controls */}
            <div className="w-full lg:w-1/2 space-y-6">
              {/* Section 1: Photo Upload */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">1. Photo Upload Karein</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Choose File
                  </button>
                  <span className="text-gray-600 font-semibold text-lg break-all">
                    {selectedFile ? selectedFile.name : "No file chosen"}
                  </span>
                </div>
              </div>

              {/* Section 2: Size Input */}
              {selectedFile && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">2. Naya Size (pixels mein)</h3>
                  </div>
                  
                  {/* Original Dimensions Info */}
                  {originalDimensions && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-blue-800 font-bold text-lg">
                        Original Size: {originalDimensions.width} × {originalDimensions.height} pixels
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">
                        Width (चौड़ाई)
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                        min="1"
                        max="4000"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">
                        Height (लंबाई)
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
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
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-lg text-gray-700 font-semibold">Maintain aspect ratio (अनुपात बनाए रखें)</span>
                  </div>
                  
                  {/* Quick Size Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        if (originalDimensions) {
                          setWidth(originalDimensions.width.toString());
                          setHeight(originalDimensions.height.toString());
                        }
                      }}
                      className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-semibold"
                    >
                      Original Size
                    </button>
                    <button
                      onClick={() => {
                        setWidth('800');
                        setHeight('600');
                      }}
                      className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-semibold"
                    >
                      800×600
                    </button>
                    <button
                      onClick={() => {
                        setWidth('1024');
                        setHeight('768');
                      }}
                      className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-semibold"
                    >
                      1024×768
                    </button>
                    <button
                      onClick={() => {
                        setWidth('1920');
                        setHeight('1080');
                      }}
                      className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-semibold"
                    >
                      1920×1080
                    </button>
                  </div>
                  
                  {/* Resize Button */}
                  <button
                    onClick={resizeImage}
                    disabled={isResizing}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {isResizing ? (
                      <div className="flex items-center justify-center space-x-3">
                        <RotateCw className="w-6 h-6 animate-spin" />
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
                  className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <Download className="w-6 h-6" />
                  <span>Download Resized Photo</span>
                </button>
              )}
            </div>

            {/* Right Panel - Preview */}
            <div className="w-full lg:w-1/2">
              <div className="h-96 lg:h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 flex items-center justify-center border-2 border-dashed border-gray-300">
                {previewUrl ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={resizedUrl || previewUrl}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-6">📷</div>
                    <p className="text-2xl font-bold mb-3">Photo preview yahan dikhega</p>
                    <p className="text-lg">Upload a photo to see preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoResizer; 