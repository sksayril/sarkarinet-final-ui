import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Search, FileText, Briefcase, ExternalLink, Calendar, Tag } from 'lucide-react';
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

interface SubCategory {
  _id: string;
  mainCategory: {
    _id: string;
    title: string;
  };
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  contentTitle: string;
  contentDescription: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'recruitment' | 'content';
  colorCode?: string;
  mainCategory?: string;
}

const SearchResults: React.FC = () => {
  const [recruitmentCards, setRecruitmentCards] = useState<TopDataItem[]>([]);
  const [contentSections, setContentSections] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { searchQuery, isSearching } = useSearch();

  // Function to strip HTML tags and get clean text
  const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    // Create a temporary div to parse HTML and extract text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Function to truncate text to a certain length
  const truncateText = (text: string, maxLength: number = 150): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch recruitment cards
        const recruitmentResponse = await fetch('https://api.dhanlaxmii.com/category/topdata');
        const recruitmentData = await recruitmentResponse.json();
        
        // Fetch content sections
        const contentResponse = await fetch('https://api.dhanlaxmii.com/category/sub');
        const contentData = await contentResponse.json();
        
        setRecruitmentCards(recruitmentData.topDataList || []);
        setContentSections(contentData.subCategories || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching search data:', err);
        setError('Failed to load search data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and combine search results
  const searchResults = useMemo(() => {
    if (!isSearching || !searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Filter recruitment cards
    recruitmentCards.forEach(card => {
      if (
        card.contentTitle.toLowerCase().includes(query) ||
        card.metaTitle.toLowerCase().includes(query) ||
        card.metaDescription.toLowerCase().includes(query) ||
        card.contentDescription.toLowerCase().includes(query) ||
        card.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
        card.tags.some(tag => tag.toLowerCase().includes(query))
      ) {
        results.push({
          id: card._id,
          title: card.contentTitle,
          description: truncateText(stripHtmlTags(card.contentDescription || card.metaDescription)),
          category: 'Recruitment',
          type: 'recruitment',
          colorCode: card.colorCode
        });
      }
    });

    // Filter content sections
    contentSections.forEach(item => {
      if (
        item.contentTitle.toLowerCase().includes(query) ||
        item.metaTitle.toLowerCase().includes(query) ||
        item.metaDescription.toLowerCase().includes(query) ||
        item.contentDescription.toLowerCase().includes(query) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.mainCategory.title.toLowerCase().includes(query)
      ) {
        results.push({
          id: item._id,
          title: item.contentTitle,
          description: truncateText(stripHtmlTags(item.contentDescription || item.metaDescription)),
          category: item.mainCategory.title,
          type: 'content',
          mainCategory: item.mainCategory.title
        });
      }
    });

    return results;
  }, [recruitmentCards, contentSections, searchQuery, isSearching]);

  const handleResultClick = (result: SearchResult) => {
    const slug = slugify(result.title);
    navigate(`/recruitment/${slug}`);
  };

  if (loading) {
    return (
      <div className="w-full min-w-[1200px] px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-3 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-xl flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                      <div className="h-6 bg-gray-300 rounded w-24"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4">
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                      </div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-w-[1200px] px-4 py-6">
        <div className="max-w-4xl mx-auto text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!isSearching || !searchQuery.trim()) {
    return null;
  }

  if (searchResults.length === 0) {
    return (
      <div className="w-full min-w-[1200px] px-4 py-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-12 shadow-lg">
            <Search className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No results found</h3>
            <p className="text-lg text-gray-600 mb-2">
              No results found for <span className="font-bold text-red-600">"{searchQuery}"</span>
            </p>
            <p className="text-gray-500 mb-6">
              Try different keywords or check your spelling
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Briefcase className="w-4 h-4" />
                <span>Search in recruitment cards</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Search in content sections</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-[1200px] px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Search Results
          </h2>
          <p className="text-lg text-gray-600">
            Found <span className="font-bold text-red-600">{searchResults.length}</span> result(s) for <span className="font-semibold">"{searchQuery}"</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {searchResults.map((result, index) => (
            <div
              key={`${result.type}-${result.id}`}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-red-300 transition-all duration-300 cursor-pointer transform hover:scale-105 group"
              onClick={() => handleResultClick(result)}
            >
              <div className="flex items-start space-x-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow"
                  style={{ 
                    backgroundColor: result.type === 'recruitment' && result.colorCode 
                      ? result.colorCode 
                      : '#dc2626' 
                  }}
                >
                  {result.type === 'recruitment' ? (
                    <Briefcase className="w-8 h-8" />
                  ) : (
                    <FileText className="w-8 h-8" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
                        {result.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200">
                          {result.category}
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                          {result.type === 'recruitment' ? 'Recruitment' : 'Content'}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0" />
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {result.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-gray-500 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{result.type === 'recruitment' ? 'Recruitment Card' : 'Content Section'}</span>
                      </div>
                      {result.mainCategory && (
                        <div className="flex items-center space-x-1">
                          <Tag className="w-4 h-4" />
                          <span>{result.mainCategory}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      Click to view details
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 