import React, { useState, useEffect, useMemo } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import { useSearch } from '../contexts/SearchContext';
import { scrollToTop } from '../utils/scrollToTop';
import { waitForGoogleAds, getOptimizedAdConfig } from '../utils/adsHelper';

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

interface Section {
  title: string;
  color: string;
  items: SubCategory[];
  allItems: SubCategory[];
}

const ContentSections: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [adsLoaded, setAdsLoaded] = useState(false);
  const navigate = useNavigate();
  const { searchQuery, isSearching } = useSearch();

  // Define the specific category sequence
  const categorySequence = ['Results', 'Admit Card', 'Latest Jobs', 'Answer Key', 'Syllabus', 'Admission'];

  // Color schemes for top category bars
  const topBarColors = ['bg-red-700', 'bg-blue-700', 'bg-green-700', 'bg-purple-700', 'bg-orange-700', 'bg-teal-700'];

  // Initialize ads when component mounts
  useEffect(() => {
    const initializeAds = () => {
      try {
        // Wait for Google Ads to be available
        if (window.adsbygoogle) {
          const adConfig = getOptimizedAdConfig();
          (window.adsbygoogle = window.adsbygoogle || []).push(adConfig);
          console.log('Google Ads initialized successfully');
          setAdsLoaded(true);
        } else {
          // If adsbygoogle is not available, try again after a delay
          console.log('Google Ads not ready, retrying...');
          setTimeout(initializeAds, 1000);
        }
      } catch (error) {
        console.error('Error initializing Google Ads:', error);
        // Retry after 2 seconds
        setTimeout(initializeAds, 2000);
      }
    };

    // Start initialization
    initializeAds();
  }, []);

  // Manual ads refresh function
  const refreshAds = () => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log('Ads refreshed manually');
        setAdsLoaded(true);
      }
    } catch (error) {
      console.error('Error refreshing ads:', error);
    }
  };

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.mydost.site/category/sub');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const subCategories = data.subCategories || [];
        
        // Group subcategories by main category
        const groupedData: { [key: string]: SubCategory[] } = subCategories.reduce((acc: { [key: string]: SubCategory[] }, item: SubCategory) => {
          const categoryTitle = item.mainCategory.title;
          if (!acc[categoryTitle]) {
            acc[categoryTitle] = [];
          }
          acc[categoryTitle].push(item);
          return acc;
        }, {});

        // Sort subcategories within each category in descending order
        Object.keys(groupedData).forEach(categoryTitle => {
          groupedData[categoryTitle].sort((a: SubCategory, b: SubCategory) => {
            return b._id.localeCompare(a._id);
          });
        });

        // Create sections in the specific sequence
        const sectionsData: Section[] = categorySequence
          .filter(categoryTitle => groupedData[categoryTitle]) // Only include categories that have data
          .map((title, index) => ({
            title,
            color: 'bg-red-700',
            items: groupedData[title].slice(0, 15),
            allItems: groupedData[title]
          }));

        setSections(sectionsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching sub categories:', err);
        setError('Failed to load content data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!isSearching || !searchQuery.trim()) {
      return sections;
    }

    const query = searchQuery.toLowerCase();
    return sections.map(section => {
      const filteredItems = section.allItems.filter(item => {
        return (
          item.contentTitle.toLowerCase().includes(query) ||
          item.metaTitle.toLowerCase().includes(query) ||
          item.metaDescription.toLowerCase().includes(query) ||
          item.contentDescription.toLowerCase().includes(query) ||
          item.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
          item.tags.some(tag => tag.toLowerCase().includes(query)) ||
          item.mainCategory.title.toLowerCase().includes(query)
        );
      });

      return {
        ...section,
        items: filteredItems.slice(0, expandedSections[section.title] ? 25 : 15),
        allItems: filteredItems
      };
    }).filter(section => section.items.length > 0);
  }, [sections, searchQuery, isSearching, expandedSections]);

  const handleItemClick = (item: SubCategory) => {
    const slug = slugify(item.contentTitle);
    const mainCategorySlug = item.mainCategory.title.toLowerCase().replace(/\s+/g, '-');
    scrollToTop();
    navigate(`/${mainCategorySlug}/${slug}?id=${item._id}`);
  };

  const handleViewMore = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const handleViewAll = (sectionTitle: string) => {
    const routeMap: { [key: string]: string } = {
      'Latest Jobs': '/latest-jobs',
      'Results': '/results',
      'Admit Card': '/admit-card',
      'Answer Key': '/answer-key',
      'Syllabus': '/syllabus',
      'Admission': '/admission',
      'Important':'/important',
      'Previous Year Paper':'/previousyearpapers',
      'Private Jobs':'/privatejobs',
    };
    
    const route = routeMap[sectionTitle] || '/';
    scrollToTop();
    navigate(route);
  };

  if (loading) {
    return (
      <div className="w-full min-w-[1200px] px-4 py-6">
        {/* Top Section Loading */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-300 h-16 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* White Gap Section Loading */}
        <div className="bg-white rounded-lg p-4 md:p-8 mb-8 animate-pulse">
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>

        {/* Content Sections Loading */}
        <div className="grid grid-cols-3 gap-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white border-4 border-red-600 rounded-lg overflow-hidden animate-pulse shadow-lg" style={{ minWidth: '380px' }}>
              <div className="bg-gray-300 h-16"></div>
              <div className="p-4">
                <div className="space-y-4">
                  {[...Array(15)].map((_, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gray-300 rounded flex-shrink-0"></div>
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="h-12 bg-gray-300 rounded"></div>
                </div>
              </div>
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

  if (isSearching && filteredSections.length === 0) {
    return (
      <div className="w-full min-w-[1200px] px-4 py-6">
        <div className="text-center text-gray-600">
          <p className="text-lg">No content sections found matching "{searchQuery}"</p>
        </div>
      </div>
    );
  }

  const totalResults = filteredSections.reduce((total, section) => total + section.allItems.length, 0);

  return (
    <div className="w-full min-w-[1200px] px-4 py-6 overflow-x-auto">
      {/* Top Section - Colored Category Bars */}
      {/* <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categorySequence.map((category, index) => (
            <div
              key={index}
              className={`${topBarColors[index % topBarColors.length]} text-white p-3 md:p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-center min-h-[60px] md:min-h-[80px] flex items-center justify-center`}
              onClick={() => {
                const routeMap: { [key: string]: string } = {
                  'Latest Jobs': '/latest-jobs',
                  'Results': '/results',
                  'Admit Card': '/admit-card',
                  'Answer Key': '/answer-key',
                  'Syllabus': '/syllabus',
                  'Admission': '/admission',
                };
                const route = routeMap[category] || '/';
                scrollToTop();
                navigate(route);
              }}
            >
              <h3 className="text-sm md:text-lg font-bold tracking-wide leading-tight">{category}</h3>
            </div>
          ))}
        </div>
      </div> */}

      {/* White Gap Section with Ads */}
      <div className="bg-white rounded-lg p-4 md:p-8 mb-8 shadow-lg border-2 border-gray-200">
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Advertisement</h2>
          <p className="text-sm md:text-base text-gray-600">Sponsored content and offers</p>
        </div>
        
        {/* Google Ads Container */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <ins 
              className="adsbygoogle"
              style={{ 
                display: 'block',
                textAlign: 'center',
                minHeight: '250px',
                width: '100%',
                maxWidth: '100%',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px'
              }}
              data-ad-client="ca-pub-8453458415715594"
              data-ad-slot="6506881139"
              data-ad-format="auto"
              data-full-width-responsive="true"
              data-adtest="off"
            />
            
            {/* Ads Status and Refresh Button */}
            <div className="flex items-center justify-between mt-4 mb-2">
              <div className="text-sm text-gray-500">
                {adsLoaded ? (
                  <span className="text-green-600">✓ Ads loaded successfully</span>
                ) : (
                  <span className="text-yellow-600">⏳ Loading advertisements...</span>
                )}
              </div>
              <button
                onClick={refreshAds}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Refresh Ads
              </button>
            </div>
            
            {/* Fallback content if ads don't load */}
            <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300 mt-4">
              <p className="font-medium text-gray-600 mb-2">Advertisement Space</p>
              <p className="text-gray-500">Loading sponsored content...</p>
              <div className="mt-3">
                <div className="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSearching && filteredSections.length > 0 && (
        <div className="mb-4 text-center">
          <p className="text-lg text-gray-700">
            Found <span className="font-bold text-red-600">{totalResults}</span> content item(s) across <span className="font-bold text-red-600">{filteredSections.length}</span> section(s) matching your search
          </p>
        </div>
      )}
      <div className="grid grid-cols-3 gap-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {filteredSections.map((section, index) => {
          const isExpanded = expandedSections[section.title];
          const isFirstRow = index < 3;
          const maxItems = isFirstRow ? (isExpanded ? 25 : 15) : (isExpanded ? 20 : 10);
          const displayItems = section.items.slice(0, maxItems);
          const hasMoreItems = section.allItems.length > maxItems;
          
          return (
            <div key={index} className="bg-white border-4 border-red-600 rounded-lg overflow-hidden shadow-lg flex flex-col relative" style={{ minWidth: '380px' }}>
              {/* Header - Centered */}
              <div className={`${section.color} text-white p-4 text-center border-b-4 border-red-800 relative`}>
                <h3 className="text-3xl font-bold tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>{section.title}</h3>
              </div>
              
              {/* Content Area - Flex grow to fill space */}
              <div className="p-4 flex-1 flex flex-col">
                {/* List Items - Left aligned with proper spacing */}
                <ul className="space-y-4 flex-1">
                  {displayItems.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3 py-1">
                      <div className="w-2 h-2 bg-black rounded-full mt-3 flex-shrink-0"></div>
                      <a 
                        href={`/${item.mainCategory.title.toLowerCase().replace(/\s+/g, '-')}/${slugify(item.contentTitle)}?id=${item._id}`}
                        className="text-xl font-normal text-blue-700 cursor-pointer underline leading-relaxed hover:text-blue-800 transition-colors"
                        style={{ fontFamily: 'Arial, sans-serif' }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleItemClick(item);
                        }}
                      >
                        {item.contentTitle}
                      </a>
                    </li>
                  ))}
                </ul>
                
                {/* Button Area - Bottom aligned */}
                <div className="mt-6 pt-4 border-t-4 border-gray-300 space-y-2">
                  {/* {hasMoreItems && (
                    <button 
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg border-2 border-green-800"
                      onClick={() => handleViewMore(section.title)}
                    >
                      <span className="text-lg font-black">
                        {isExpanded ? 'Show Less' : `View More (${section.allItems.length - maxItems} more)`}
                      </span>
                      <ArrowRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  )} */}
                  
                  {/* View All Button */}
                  <button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg border-2 border-blue-800"
                    onClick={() => handleViewAll(section.title)}
                  >
                    <span className="text-2xl font-black">View All</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentSections;