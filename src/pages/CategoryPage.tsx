import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { slugify } from '../utils/slugify';
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

const CategoryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug: string }>();
  
  console.log(`📄 CategoryPage loaded with categorySlug: ${categorySlug}, pathname: ${location.pathname}`);
  
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryTitle, setCategoryTitle] = useState<string>('');

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('https://api.mydost.site/category/sub');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const allSubCategories = data.subCategories || [];
        
        // Get category from URL parameter
        const currentSlug = categorySlug || '';
        
        // Convert URL slug back to category title - handle both static and dynamic mappings
        const categoryMap: { [key: string]: string } = {
          'latest-jobs': 'Latest Jobs',
          'admit-card': 'Admit Card',
          'results': 'Results',
          'answer-key': 'Answer Key',
          'syllabus': 'Syllabus',
          'admission': 'Admission'
        };
        
        // First try the static mapping
        let currentCategoryTitle = categoryMap[currentSlug];
        
        // If not found in static mapping, try to find it in the API data
        if (!currentCategoryTitle) {
          // Look for a category that matches the slug
          const matchingCategory = allSubCategories.find((item: SubCategory) => {
            const categorySlugFromTitle = item.mainCategory.title.toLowerCase().replace(/\s+/g, '-');
            return categorySlugFromTitle === currentSlug;
          });
          
          if (matchingCategory) {
            currentCategoryTitle = matchingCategory.mainCategory.title;
          }
        }
        
        // If still not found, use a default
        if (!currentCategoryTitle) {
          currentCategoryTitle = 'Category';
        }
        
        setCategoryTitle(currentCategoryTitle);
        
        // Filter subcategories by main category
        const filteredCategories = allSubCategories.filter(
          (item: SubCategory) => item.mainCategory.title === currentCategoryTitle
        );
        
        // Sort subcategories in descending order (newest first)
        const sortedCategories = filteredCategories.sort((a: SubCategory, b: SubCategory) => {
          // Sort by _id in descending order (newest first)
          return b._id.localeCompare(a._id);
        });
        
        setSubCategories(sortedCategories);
        setError(null);
      } catch (err) {
        console.error('Error fetching sub categories:', err);
        setError('Failed to load category data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [categorySlug]);

  const handleItemClick = (item: SubCategory) => {
    const slug = slugify(item.contentTitle);
    const mainCategorySlug = item.mainCategory.title.toLowerCase().replace(/\s+/g, '-');
    scrollToTop();
    navigate(`/${mainCategorySlug}/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-6"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center text-red-600">
              <h1 className="text-2xl font-bold mb-4">Error</h1>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-red-700 text-white p-6">
            <h1 className="text-3xl font-bold text-center">{categoryTitle}</h1>
          </div>
          
          {/* Content List */}
          <div className="p-6">
            {subCategories.length > 0 ? (
              <ul className="space-y-4">
                {subCategories.map((item) => (
                  <li key={item._id} className="flex items-start space-x-3">
                    <Star className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span 
                      className="text-lg text-blue-600 hover:text-blue-800 cursor-pointer underline"
                      onClick={() => handleItemClick(item)}
                    >
                      {item.contentTitle}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-600 mb-4">No Content Found</h2>
                <p className="text-gray-500">
                  No {categoryTitle.toLowerCase()} content is currently available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 