import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import { useSearch } from '../contexts/SearchContext';

interface TopDataItem {
  _id: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  contentTitle: string;
  contentDescription: string;
  colorCode: string;
}

const RecruitmentCards: React.FC = () => {
  const [cards, setCards] = useState<TopDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { searchQuery, isSearching } = useSearch();

  useEffect(() => {
    const fetchTopData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://7cvccltb-3110.inc1.devtunnels.ms/category/topdata');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCards(data.topDataList || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching top data:', err);
        setError('Failed to load recruitment data');
      } finally {
        setLoading(false);
      }
    };

    fetchTopData();
  }, []);

  // Filter cards based on search query
  const filteredCards = useMemo(() => {
    if (!isSearching || !searchQuery.trim()) {
      return cards;
    }

    const query = searchQuery.toLowerCase();
    return cards.filter(card => {
      return (
        card.contentTitle.toLowerCase().includes(query) ||
        card.metaTitle.toLowerCase().includes(query) ||
        card.metaDescription.toLowerCase().includes(query) ||
        card.contentDescription.toLowerCase().includes(query) ||
        card.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
        card.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });
  }, [cards, searchQuery, isSearching]);

  const handleCardClick = (card: TopDataItem) => {
    const slug = slugify(card.contentTitle);
    navigate(`/recruitment/${slug}`);
  };

  if (loading) {
    return (
      <div className="w-full min-w-[1200px] px-4 py-6">
        <div className="grid grid-cols-4 gap-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 p-6 rounded-xl animate-pulse"
              style={{ minWidth: '250px', height: '120px' }}
            >
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-w-[1200px] px-4 py-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Show message when no search results found
  if (isSearching && filteredCards.length === 0) {
    return (
      <div className="w-full min-w-[1200px] px-4 py-6">
        <div className="text-center text-gray-600">
          <p className="text-lg">No recruitment cards found matching "{searchQuery}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-[1200px] px-4 py-6">
      {isSearching && filteredCards.length > 0 && (
        <div className="mb-4 text-center">
          <p className="text-lg text-gray-700">
            Found <span className="font-bold text-red-600">{filteredCards.length}</span> recruitment card(s) matching your search
          </p>
        </div>
      )}
      <div className="grid grid-cols-4 gap-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {filteredCards.map((card) => (
          <div
            key={card._id}
            className="p-6 rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl text-white"
            style={{ 
              minWidth: '250px', 
              height: '120px',
              backgroundColor: card.colorCode
            }}
            onClick={() => handleCardClick(card)}
          >
            <h3 className="text-lg font-bold text-center leading-tight flex items-center justify-center h-full">
              {card.contentTitle}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruitmentCards;