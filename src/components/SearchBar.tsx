import React, { useState, useEffect } from 'react';
import { Search, Sparkles, X, RotateCcw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../contexts/SearchContext';

const SearchBar: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { searchQuery, setSearchQuery, isSearching, setIsSearching, clearSearch } = useSearch();
  const navigate = useNavigate();

  // Update input value when search query changes
  useEffect(() => {
    setInputValue(searchQuery || '');
  }, [searchQuery]);

  const handleSearch = () => {
    if (inputValue && inputValue.trim()) {
      setSearchQuery(inputValue.trim());
      setIsSearching(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setInputValue('');
    clearSearch();
    navigate('/');
  };

  return (
    <>
      <div className="w-full min-w-[1200px] px-4 pt-4 pb-0">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-1/2 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for jobs, results, admit cards..."
              className="w-full px-6 py-4 border-2 border-gray-400 rounded-full focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
            />
            {inputValue && !isSearching && (
              <button 
                onClick={handleClearSearch}
                className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {isSearching && (
              <button 
                onClick={handleClearSearch}
                className="absolute right-16 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
          <button 
            onClick={() => navigate('/aivoice')}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-full flex items-center space-x-3 hover:from-purple-700 hover:to-purple-800 whitespace-nowrap shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-500"
          >
            <span className="text-2xl">🎤</span>
            <span className="text-lg font-bold">Ask S.R AI Assistant</span>
          </button>
        </div>
        
        {/* Search Results Summary */}
        {isSearching && searchQuery && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-4">
              <p className="text-lg text-gray-700">
                Showing search results for: <span className="font-bold text-red-600">"{searchQuery || ''}"</span>
              </p>
              <button 
                onClick={handleClearSearch}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
                title="Back to Home"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
    </>
  );
};

export default SearchBar;