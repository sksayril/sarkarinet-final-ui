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
        if (maintainAspectRatio) {
          const aspectRatio = img.width / img.height;
          setWidth(800);
          setHeight(Math.round(800 / aspectRatio));
        }
      };
      img.src = url;
    }
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const resizeImage = () => {
    if (!selectedFile) return;

    setIsResizing(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-800">Photo Resizer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-200 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">Choose Image</span>
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Supports JPG, PNG, GIF (Max 10MB)
              </p>
            </div>
          </div>

          {selectedFile && (
            <>
              {/* Original Image Preview */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Original Image</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="max-w-full max-h-48 mx-auto rounded shadow-sm"
                  />
                  {originalDimensions && (
                    <p className="text-sm text-gray-600 mt-3 text-center font-medium">
                      Original size: {originalDimensions.width} × {originalDimensions.height} pixels
                    </p>
                  )}
                </div>
              </div>

              {/* Resize Controls */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Resize Settings</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Width (pixels)
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => handleWidthChange(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="1"
                        max="4000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height (pixels)
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => handleHeightChange(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="1"
                        max="4000"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 font-medium">Maintain aspect ratio</span>
                  </div>
                </div>
              </div>

              {/* Resized Image Preview */}
              {resizedUrl && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Resized Image</h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <img
                      src={resizedUrl}
                      alt="Resized"
                      className="max-w-full max-h-48 mx-auto rounded shadow-sm"
                    />
                    <p className="text-sm text-gray-600 mt-3 text-center font-medium">
                      New size: {width} × {height} pixels
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer - Fixed with Action Buttons */}
        <div className="border-t bg-gray-50 p-6 rounded-b-lg">
          <div className="flex items-center justify-center space-x-4">
            {selectedFile && (
              <>
                <button
                  onClick={resizeImage}
                  disabled={isResizing}
                  className="flex items-center justify-center space-x-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl font-medium"
                >
                  {isResizing ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" />
                      <span>Resizing...</span>
                    </>
                  ) : (
                    <span>Resize Image</span>
                  )}
                </button>

                {resizedUrl && (
                  <button
                    onClick={downloadImage}
                    className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl font-medium"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Image</span>
                  </button>
                )}

                <button
                  onClick={resetImage}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  Upload New Image
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoResizerModal; 