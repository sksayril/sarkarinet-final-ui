import React, { useState, useEffect, useMemo } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import { useSearch } from '../contexts/SearchContext';
import { scrollToTop } from '../utils/scrollToTop';

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
  const navigate = useNavigate();
  const { searchQuery, isSearching } = useSearch();

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.dhanlaxmii.com/category/sub');
        
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
        // Sort by _id (assuming newer items have higher _id values) or by creation date
        Object.keys(groupedData).forEach(categoryTitle => {
          groupedData[categoryTitle].sort((a: SubCategory, b: SubCategory) => {
            // Sort by _id in descending order (newest first)
            return b._id.localeCompare(a._id);
          });
        });

        // Convert to sections format with all items stored
        const sectionsData: Section[] = Object.entries(groupedData).map(([title, items]) => ({
          title,
          color: 'bg-red-700',
          items: items.slice(0, 15), // Show 15 items initially for first row
          allItems: items // Store all items for pagination
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
        items: filteredItems.slice(0, expandedSections[section.title] ? 25 : 15), // Show more if expanded
        allItems: filteredItems
      };
    }).filter(section => section.items.length > 0);
  }, [sections, searchQuery, isSearching, expandedSections]);

  const handleItemClick = (item: SubCategory) => {
    const slug = slugify(item.contentTitle);
    const mainCategorySlug = item.mainCategory.title.toLowerCase().replace(/\s+/g, '-');
    scrollToTop();
    navigate(`/${mainCategorySlug}/${slug}`);
  };

  const handleViewMore = (sectionTitle: string) => {
    // Toggle expanded state for this section
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const handleViewAll = (sectionTitle: string) => {
    // Navigate to the appropriate page based on section title
    const routeMap: { [key: string]: string } = {
      'Latest Jobs': '/latest-jobs',
      'Results': '/results',
      'Admit Card': '/admit-card',
      'Answer Key': '/answer-key',
      'Syllabus': '/syllabus',
      'Admission': '/admission'
    };
    
    const route = routeMap[sectionTitle] || '/';
    scrollToTop();
    navigate(route);
  };

  if (loading) {
    return (
      <div className="w-full min-w-[1200px] px-4 py-6">
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

  // Show message when no search results found
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
                {/* <p className="text-sm text-red-200 mt-1">
                  {displayItems.length} of {section.allItems.length} items
                </p> */}
              </div>
              
              {/* Content Area - Flex grow to fill space */}
              <div className="p-4 flex-1 flex flex-col">
                {/* List Items - Left aligned with proper spacing */}
                <ul className="space-y-4 flex-1">
                  {displayItems.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3 py-1">
                      <div className="w-2 h-2 bg-black rounded-full mt-3 flex-shrink-0"></div>
                      <span 
                        className="text-xl font-normal text-blue-700 cursor-pointer underline leading-relaxed hover:text-blue-800 transition-colors"
                        style={{ fontFamily: 'Arial, sans-serif' }}
                        onClick={() => handleItemClick(item)}
                      >
                        {item.contentTitle}
                      </span>
                    </li>
                  ))}
                </ul>
                
                {/* Button Area - Bottom aligned */}
                <div className="mt-6 pt-4 border-t-4 border-gray-300 space-y-2">
                  {/* View More/Less Button */}
                  {hasMoreItems && (
                    <button 
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg border-2 border-green-800"
                      onClick={() => handleViewMore(section.title)}
                    >
                      <span className="text-lg font-black">
                        {isExpanded ? 'Show Less' : `View More (${section.allItems.length - maxItems} more)`}
                      </span>
                      <ArrowRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  )}
                  
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