import React, { useState, useEffect } from 'react';
import { Cloud, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { getGoogleCloudConfig } from '../utils/googleCloud';

const TitleSection: React.FC = () => {
  const [googleCloudInfo, setGoogleCloudInfo] = useState<{
    projectId: string;
    serviceAccountEmail: string;
    status: 'loading' | 'connected' | 'error';
  } | null>(null);

  useEffect(() => {
    const loadGoogleCloudInfo = () => {
      const config = getGoogleCloudConfig();
      if (config) {
        setGoogleCloudInfo({
          projectId: config.projectId,
          serviceAccountEmail: config.serviceAccountEmail,
          status: 'connected'
        });
      } else {
        setGoogleCloudInfo({
          projectId: 'Not Configured',
          serviceAccountEmail: 'Not Configured',
          status: 'error'
        });
      }
    };

    loadGoogleCloudInfo();
  }, []);

  const getStatusIcon = () => {
    switch (googleCloudInfo?.status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Loader className="w-5 h-5 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (googleCloudInfo?.status) {
      case 'connected':
        return 'Google Cloud Connected';
      case 'error':
        return 'Google Cloud Error';
      default:
        return 'Google Cloud Loading...';
    }
  };

  return (
    <div className="w-full min-w-[1200px] px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
      <div className="flex items-center justify-between">
        {/* Left Side - Project Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Cloud className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-semibold text-blue-800">Google Cloud Project:</span>
          </div>
          <div className="bg-white px-3 py-1 rounded-lg border border-blue-200">
            <span className="text-sm font-mono text-blue-700">
              {googleCloudInfo?.projectId || 'Loading...'}
            </span>
          </div>
        </div>

        {/* Center - Status */}
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${
            googleCloudInfo?.status === 'connected' ? 'text-green-700' :
            googleCloudInfo?.status === 'error' ? 'text-red-700' : 'text-yellow-700'
          }`}>
            {getStatusText()}
          </span>
        </div>

        {/* Right Side - Service Account */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Service Account:</span>
          <div className="bg-white px-2 py-1 rounded border border-gray-200">
            <span className="text-xs font-mono text-gray-700 truncate max-w-48">
              {googleCloudInfo?.serviceAccountEmail || 'Loading...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleSection; 