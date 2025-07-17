import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import AIAssistantModal from './AIAssistantModal';

const SearchBar: React.FC = () => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <>
      <div className="w-full min-w-[1200px] px-4 py-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-1/2 relative">
            <input
              type="text"
              placeholder="Search for jobs, results, admit cards..."
              className="w-full px-6 py-4 border-2 border-gray-400 rounded-full focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Search className="w-6 h-6" />
            </button>
          </div>
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-full flex items-center space-x-3 hover:from-purple-700 hover:to-purple-800 whitespace-nowrap shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-500"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-lg font-bold">Ask S.R AI Assistant</span>
          </button>
        </div>
      </div>
      
      <AIAssistantModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
      />
    </>
  );
};

export default SearchBar;