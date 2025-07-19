import React from 'react';
import { Image, FileText, MessageCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollToTop';

const ActionButtons: React.FC = () => {
  const handleLinkClick = () => {
    scrollToTop();
  };

  return (
    <div className="w-full min-w-[1200px] px-4 py-6">
      <div className="flex items-center justify-center space-x-6">
        <Link to="/photo-resizer" onClick={handleLinkClick}>
          <button 
            className="bg-gradient-to-r from-purple-700 to-purple-800 text-white px-8 py-4 rounded-full flex items-center space-x-3 hover:from-purple-800 hover:to-purple-900 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-purple-600"
          >
            <Image className="w-7 h-7" />
            <span className="text-xl font-bold">Image Resizer</span>
          </button>
        </Link>
        <Link to="/daily-quiz" onClick={handleLinkClick}>
          <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full flex items-center space-x-3 hover:from-red-600 hover:to-red-700 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-red-400">
            <FileText className="w-7 h-7" />
            <span className="text-xl font-bold">Daily Quiz</span>
          </button>
        </Link>
        <Link to="/smartprep-progress-tracker" onClick={handleLinkClick} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full flex items-center space-x-3 hover:from-blue-600 hover:to-blue-700 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-blue-400">
          <TrendingUp className="w-7 h-7" />
          <span className="text-xl font-bold">Student Progress Tracker</span>
        </Link>
      </div>
    </div>
  );
};

export default ActionButtons;