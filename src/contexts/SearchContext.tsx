import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
  searchResults: {
    recruitmentCards: any[];
    contentSections: any[];
  };
  setSearchResults: (results: any) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({
    recruitmentCards: [],
    contentSections: []
  });

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults({
      recruitmentCards: [],
      contentSections: []
    });
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        isSearching,
        setIsSearching,
        searchResults,
        setSearchResults,
        clearSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}; 