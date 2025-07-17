import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Search, FileText, Briefcase } from 'lucide-react';
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
          description: card.contentDescription || card.metaDescription,
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
          description: item.contentDescription || item.metaDescription,
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
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
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
        <div className="max-w-4xl mx-auto text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
          <p className="text-gray-500">
            No results found for <span className="font-semibold">"{searchQuery}"</span>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try different keywords or check your spelling
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-[1200px] px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Search Results
          </h2>
          <p className="text-gray-600">
            Found <span className="font-bold text-red-600">{searchResults.length}</span> result(s) for <span className="font-semibold">"{searchQuery}"</span>
          </p>
        </div>

        <div className="space-y-4">
          {searchResults.map((result, index) => (
            <div
              key={`${result.type}-${result.id}`}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleResultClick(result)}
            >
              <div className="flex items-start space-x-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ 
                    backgroundColor: result.type === 'recruitment' && result.colorCode 
                      ? result.colorCode 
                      : '#dc2626' 
                  }}
                >
                  {result.type === 'recruitment' ? (
                    <Briefcase className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-red-600 transition-colors">
                      {result.title}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                      {result.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {result.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-1 text-gray-500 text-sm">
                      <Star className="w-4 h-4" />
                      <span>{result.type === 'recruitment' ? 'Recruitment Card' : 'Content Section'}</span>
                    </div>
                    {result.mainCategory && (
                      <div className="text-gray-500 text-sm">
                        Category: {result.mainCategory}
                      </div>
                    )}
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