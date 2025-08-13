import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Download, RotateCw, Image as ImageIcon, FileText, CheckCircle, Clock, Smartphone, Monitor, Zap, Target, Users, Award, BookOpen, Shield, HelpCircle } from 'lucide-react';
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

        {/* Comprehensive Guide Section */}
        <div className="mt-12 bg-white rounded-3xl shadow-2xl p-8 border border-green-100">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <BookOpen className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-800">Complete Guide: Image Resizer for Government Forms</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Master the art of resizing photos and signatures for Sarkari Result exams, job applications, and government forms
            </p>
          </div>

          {/* Introduction Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Why Image Resizing is Essential for Government Forms</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In today's digital age, we all fill online forms—whether it's for Sarkari Result exams, job applications, or identity card registrations. And one thing almost every form demands? Perfectly sized photos and signatures.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you've ever faced that frustrating moment when your form says "Image size must be 100KB" or "Signature should be 140×60 pixels", you know the struggle. That's exactly why an Image Resizer Tool can feel like a life-saver.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  In this guide, I'm going to walk you through how to use an online image resizer (like the one we've created), and why it's essential for things like government exam forms and Sarkari Result applications—all in simple, human language. Let's make your form-filling stress disappear.
                </p>
              </div>
            </div>
          </div>

          {/* Why Important Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Why Image Resizing is So Important for Government Forms</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Government websites like sarkariresult.com list hundreds of recruitment exams every year—SSC, UPSC, Railway, Banking, State Police, and more. Almost every single one of them asks you to upload your photo and signature in a specific size, for example:
                </p>
                <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
                  <p className="text-gray-700 font-semibold">
                    📸 Photo: 200×230 pixels, 20–50KB<br/>
                    ✍️ Signature: 140×60 pixels, 10–20KB
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  If you upload an image that's too big, the form won't accept it. If it's too small or unclear, your application might even get rejected. The worst part? These forms usually have a strict deadline, so you can't afford to waste time figuring out Photoshop or complicated editing software.
                </p>
              </div>
            </div>
          </div>

          {/* What is Tool Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border border-green-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">What is an Image Resizer Tool?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  An Image Resizer Tool is a free online service that helps you change the dimensions and size of a photo without losing quality. Think of it as a smart assistant that adjusts your photo so it fits exactly what the government form requires.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The resizer I've built is mobile-friendly, works instantly, and supports multiple formats like JPG, PNG, and JPEG. It's designed especially for people filling out Sarkari Result exam forms, passport applications, and any government service.
                </p>
              </div>
            </div>
          </div>

          {/* Step by Step Guide */}
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Step-by-Step: How to Use the Image Resizer</h3>
                <p className="text-gray-700 leading-relaxed">
                  Let's walk through the process, step-by-step, so even if you're using this for the first time, you'll feel confident.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Open the Tool</h4>
                  <p className="text-gray-700">Visit our Image Resizer Tool on your phone or computer browser. No app download, no login—just open and start.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Upload Your Photo</h4>
                  <p className="text-gray-700 mb-2">Click on the "Upload Image" button. Select the photo you want to resize—whether it's a passport-size picture, a scanned signature, or a document.</p>
                  <p className="text-gray-600 italic">💡 Tip: For government forms, use a clear, front-facing photo with a plain background.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Choose Your Size</h4>
                  <p className="text-gray-700 mb-2">Here's where the magic happens. Most government exams mention the required size in pixels or KBs. Example:</p>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 mb-2">
                    <p className="text-gray-700 text-sm">
                      🎯 SSC CGL: Photo 200×230 px, 20–50KB<br/>
                      🚂 Railway RRB: Signature 140×60 px, 10–20KB
                    </p>
                  </div>
                  <p className="text-gray-700">Enter the exact dimensions in the tool, or use our preset sizes for popular exams (yes, I've already added those to make your life easier!).</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Adjust and Preview</h4>
                  <p className="text-gray-700">Before downloading, you can crop, zoom, and adjust the image to ensure your face or signature is centered.</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Download Your Resized Image</h4>
                  <p className="text-gray-700">Once you're happy, click Download. Your perfectly resized photo will be ready to upload on the government form.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Our Tool Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Why Our Image Resizer is Perfect for Sarkari Result Applicants</h3>
                <p className="text-gray-700 leading-relaxed">
                  I created this tool because I've seen friends and students struggle every year with form rejections due to wrong photo sizes. Here's why this tool is different:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-semibold">One-click resize – No need to learn Photoshop</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 font-semibold">Preset exam sizes – Save time searching requirements</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <Smartphone className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 font-semibold">Works on mobile & PC – Fill forms from anywhere</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-semibold">Free forever – Because something this important should be accessible</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <Monitor className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 font-semibold">Maintains clarity – Your photo stays sharp and professional</span>
              </div>
            </div>
          </div>

          {/* Real Life Example */}
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Real-Life Example: How an Image Resizer Saved the Day</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Last year, my cousin was filling out a UP Police Recruitment form. The website needed a 20KB signature, but his scanned signature was 2MB—way too big. He spent hours trying random "resize" apps that either made the signature blurry or added a watermark.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  In the end, we used this Image Resizer tool—it took less than 2 minutes, and the form was accepted instantly. That's when I realized—resizing images isn't just a "tech skill", it's a life skill for anyone applying to government jobs.
                </p>
              </div>
            </div>
          </div>

          {/* Common Exams Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Common Government Exam Forms That Need Image Resizing</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you've ever checked Sarkari Result 2025 updates, you know the variety of forms out there. Here are some popular ones where our Image Resizer can help:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">📚 SSC Exams</h4>
                <p className="text-gray-600 text-sm">CHSL, CGL, MTS, GD Constable</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">🏛️ UPSC</h4>
                <p className="text-gray-600 text-sm">Civil Services, CDS, NDA</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">🚂 Railway Recruitment Board (RRB)</h4>
                <p className="text-gray-600 text-sm">Various railway positions</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">🏦 Banking Exams</h4>
                <p className="text-gray-600 text-sm">SBI PO, IBPS Clerk, RBI Grade B</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">👮 State Police Recruitment</h4>
                <p className="text-gray-600 text-sm">Various state police forces</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">📖 Teacher Eligibility Tests (TET)</h4>
                <p className="text-gray-600 text-sm">Teaching positions</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">🛂 Passport & PAN Card Applications</h4>
                <p className="text-gray-600 text-sm">Identity documents</p>
              </div>
            </div>
            <p className="text-gray-700 mt-4 font-semibold">In each of these, a correctly sized photo and signature are non-negotiable.</p>
          </div>

          {/* SEO Pro Tip */}
          <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">SEO Pro Tip: Why Image Resizing Matters for Online Document Uploads</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you run a government result website or blog like sarkariresult.com, you can add an image resizer link to help your visitors. This not only boosts your website's SEO (because people search for "photo resize for SSC form", "online signature resizer", etc.), but also improves user trust.
                </p>
              </div>
            </div>
          </div>

          {/* Final Words */}
          <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Final Words – Don't Let Photo Size Stop Your Dreams</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Imagine working hard for months to prepare for an exam, only to get rejected because your photo was 5KB too big. It sounds small, but for lakhs of students, this small detail makes the difference between applying on time and missing the deadline.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  With our Online Image Resizer, you don't have to worry about that ever again. Just upload, resize, and apply—without stress.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Whether it's Sarkari Result forms, passport applications, or ID card registrations, this tool is here to make your journey smoother. Because your dreams deserve more than getting stuck at "Upload Photo" errors.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-3">Try the Image Resizer Tool Now</h3>
            <p className="text-lg mb-4">It's free, fast, and made for you.</p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Free Forever</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>Instant Results</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Secure & Private</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoResizer; 