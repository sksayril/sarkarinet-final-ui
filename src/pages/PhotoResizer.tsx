import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Download, RotateCw, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const PhotoResizer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resizedUrl, setResizedUrl] = useState<string>('');
  const [width, setWidth] = useState<string>('800');
  const [height, setHeight] = useState<string>('600');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(false);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [quality, setQuality] = useState<number>(90);
  const [format, setFormat] = useState<string>('JPEG');
  const [rotation, setRotation] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        // Set default size
        setWidth('800');
        setHeight('600');
      };
      img.src = url;
    } else if (file) {
      setError('Please select a valid image file (JPEG, PNG, GIF, etc.)');
    }
  };

  const handleWidthChange = (newWidth: string) => {
    setWidth(newWidth);
  };

  const handleHeightChange = (newHeight: string) => {
    setHeight(newHeight);
  };

  const resizeImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    // Convert string values to numbers
    const widthNum = parseInt(width) || 0;
    const heightNum = parseInt(height) || 0;

    if (widthNum <= 0 || heightNum <= 0) {
      setError('Please enter valid width and height values (greater than 0)');
      return;
    }

    setIsResizing(true);
    setError('');

    try {
      // Create a canvas for exact dimension resizing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Set exact dimensions
      canvas.width = widthNum;
      canvas.height = heightNum;

      // Create image element
      const img = new Image();
      
      img.onload = () => {
        // Clear canvas
        ctx.clearRect(0, 0, widthNum, heightNum);
        
        // Apply rotation if needed
        if (rotation !== 0) {
          // Save the current context state
          ctx.save();
          
          // Move to center of canvas
          ctx.translate(widthNum / 2, heightNum / 2);
          
          // Apply rotation (convert degrees to radians)
          const radians = (rotation * Math.PI) / 180;
          ctx.rotate(radians);
          
          // Calculate dimensions for rotated image
          let drawWidth, drawHeight;
          
          if (maintainAspectRatio) {
            // Calculate aspect ratio to fit within bounds
            const imgAspectRatio = img.width / img.height;
            const targetAspectRatio = widthNum / heightNum;
            
            if (imgAspectRatio > targetAspectRatio) {
              drawWidth = widthNum;
              drawHeight = widthNum / imgAspectRatio;
            } else {
              drawHeight = heightNum;
              drawWidth = heightNum * imgAspectRatio;
            }
          } else {
            drawWidth = widthNum;
            drawHeight = heightNum;
          }
          
          // Draw image centered
          ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
          
          // Restore the context state
          ctx.restore();
        } else {
          // No rotation - draw normally
          if (maintainAspectRatio) {
            // Calculate aspect ratio to fit within bounds
            const imgAspectRatio = img.width / img.height;
            const targetAspectRatio = widthNum / heightNum;
            
            let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
            
            if (imgAspectRatio > targetAspectRatio) {
              // Image is wider than target, fit to width
              drawWidth = widthNum;
              drawHeight = widthNum / imgAspectRatio;
              offsetY = (heightNum - drawHeight) / 2;
            } else {
              // Image is taller than target, fit to height
              drawHeight = heightNum;
              drawWidth = heightNum * imgAspectRatio;
              offsetX = (widthNum - drawWidth) / 2;
            }
            
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          } else {
            // Force exact dimensions (may distort image)
            ctx.drawImage(img, 0, 0, widthNum, heightNum);
          }
        }

        // Convert to base64 with specified format and quality
        let mimeType = 'image/jpeg';
        if (format === 'PNG') mimeType = 'image/png';
        if (format === 'WEBP') mimeType = 'image/webp';
        
        const qualityValue = quality / 100;
        const resizedDataUrl = canvas.toDataURL(mimeType, qualityValue);
        
        setResizedUrl(resizedDataUrl);
        console.log(`✅ Image successfully resized to EXACT ${widthNum}×${heightNum} pixels`);
      };

      img.onerror = () => {
        throw new Error('Failed to load image');
      };

      // Load image from file
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      fileReader.readAsDataURL(selectedFile);

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
      const extension = format.toLowerCase();
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
    setWidth('800');
    setHeight('600');
    setOriginalDimensions(null);
    setError('');
    setQuality(90);
    setFormat('JPEG');
    setRotation(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-6 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:text-green-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
            <span className="font-semibold text-lg">Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold">Photo & Signature Resizer</h1>
          <div></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-green-100">
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
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <p className="text-blue-800 text-sm leading-relaxed">
                    <strong>📸 Supported Formats:</strong> JPEG, PNG, GIF, WEBP, BMP<br/>
                    <strong>📏 Max File Size:</strong> 10 MB<br/>
                    <strong>🎯 Perfect For:</strong> Government forms, passport photos, ID cards, profile pictures<br/>
                    <strong>💡 Tip:</strong> Use high-quality images for best results. Clear, well-lit photos work best.
                  </p>
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
                  
                  {/* Dimension Mode Indicator */}
                  <div className={`px-4 py-3 rounded-xl border-2 font-semibold text-lg ${
                    maintainAspectRatio 
                      ? 'bg-blue-50 border-blue-200 text-blue-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {maintainAspectRatio ? (
                      <span>📐 Mode: Aspect Ratio Maintained (Image will fit within {width}×{height})</span>
                    ) : (
                      <span>🎯 Mode: Exact Dimensions (Image will be exactly {width}×{height} pixels)</span>
                    )}
                  </div>
                  
                  {/* Quality and Format Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">
                        Quality
                      </label>
                      <select
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                      >
                        <option value={100}>High (100%)</option>
                        <option value={90}>Good (90%)</option>
                        <option value={80}>Medium (80%)</option>
                        <option value={60}>Low (60%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">
                        Format
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                      >
                        <option value="JPEG">JPEG</option>
                        <option value="PNG">PNG</option>
                        <option value="WEBP">WEBP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">
                        Rotation
                      </label>
                      <select
                        value={rotation}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                      >
                        <option value={0}>0°</option>
                        <option value={90}>90°</option>
                        <option value={180}>180°</option>
                        <option value={270}>270°</option>
                        <option value={360}>360°</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}
                  
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
                        setWidth('1280');
                        setHeight('720');
                      }}
                      className="px-4 py-2 text-sm bg-blue-200 hover:bg-blue-300 text-blue-700 rounded-lg transition-colors font-semibold"
                    >
                      1280×720 (HD)
                    </button>
                    <button
                      onClick={() => {
                        setWidth('1920');
                        setHeight('1080');
                      }}
                      className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-semibold"
                    >
                      1920×1080 (Full HD)
                    </button>
                    <button
                      onClick={() => {
                        setWidth('1460');
                        setHeight('720');
                      }}
                      className="px-4 py-2 text-sm bg-green-200 hover:bg-green-300 text-green-700 rounded-lg transition-colors font-semibold"
                    >
                      1460×720
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

              {/* Reset Button */}
              {selectedFile && (
                <button
                  onClick={resetImage}
                  className="w-full px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <ArrowLeft className="w-6 h-6" />
                  <span>Reset & Upload New Image</span>
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