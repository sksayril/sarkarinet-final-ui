import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Calendar, Briefcase, CheckCircle, BookOpen, Folder } from 'lucide-react';
import { scrollToTop } from '../utils/scrollToTop';

interface MainCategoryCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  itemCount?: number;
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

const MainCategoryCards: React.FC = () => {
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState<MainCategoryCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Define the specific category sequence for main categories
  const mainCategorySequence = ['Results', 'Admit Card', 'Latest Jobs', 'Answer Key', 'Syllabus'];

  // Color schemes for different categories
  const colorSchemes = [
    'bg-gradient-to-br from-green-600 to-green-700',
    'bg-gradient-to-br from-blue-600 to-blue-700',
    'bg-gradient-to-br from-purple-600 to-purple-700',
    'bg-gradient-to-br from-orange-600 to-orange-700',
    'bg-gradient-to-br from-red-600 to-red-700',
    'bg-gradient-to-br from-indigo-600 to-indigo-700',
    'bg-gradient-to-br from-pink-600 to-pink-700',
    'bg-gradient-to-br from-teal-600 to-teal-700',
    'bg-gradient-to-br from-yellow-600 to-yellow-700',
    'bg-gradient-to-br from-gray-600 to-gray-700'
  ];

  // Icon mapping for categories
  const getIconForCategory = (categoryTitle: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Results': <FileText className="w-12 h-12" />,
      'Admit Card': <Calendar className="w-12 h-12" />,
      'Latest Jobs': <Briefcase className="w-12 h-12" />,
      'Answer Key': <CheckCircle className="w-12 h-12" />,
      'Syllabus': <BookOpen className="w-12 h-12" />,
      'Admission': <FileText className="w-12 h-12" />,
      'default': <Folder className="w-12 h-12" />
    };
    return iconMap[categoryTitle] || iconMap['default'];
  };

  // Description mapping for categories
  const getDescriptionForCategory = (categoryTitle: string) => {
    const descriptionMap: { [key: string]: string } = {
      'Results': 'Latest exam results, scorecards, and merit lists for government examinations',
      'Admit Card': 'Download admit cards, hall tickets, and exam date notifications',
      'Latest Jobs': 'New government job vacancies, recruitment notifications, and career opportunities',
      'Answer Key': 'Official answer keys, solutions, and question papers for various exams',
      'Syllabus': 'Complete exam syllabus, study materials, and preparation guides',
      'Admission': 'Admission forms, application processes, and enrollment information',
      'default': 'Explore government job opportunities and exam information'
    };
    return descriptionMap[categoryTitle] || descriptionMap['default'];
  };

  useEffect(() => {
    const fetchCategories = async () => {
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

        // Create category cards
        const categories: MainCategoryCard[] = [];
        
        // First, add main categories in the specific sequence
        mainCategorySequence.forEach((categoryTitle, index) => {
          if (groupedData[categoryTitle]) {
            categories.push({
              title: categoryTitle,
              description: getDescriptionForCategory(categoryTitle),
              icon: getIconForCategory(categoryTitle),
              color: colorSchemes[index % colorSchemes.length],
              route: `/${categoryTitle.toLowerCase().replace(/\s+/g, '-')}`,
              itemCount: groupedData[categoryTitle].length
            });
          }
        });

        // Then, add all other categories
        Object.keys(groupedData).forEach((categoryTitle, index) => {
          if (!mainCategorySequence.includes(categoryTitle)) {
            categories.push({
              title: categoryTitle,
              description: getDescriptionForCategory(categoryTitle),
              icon: getIconForCategory(categoryTitle),
              color: colorSchemes[(index + mainCategorySequence.length) % colorSchemes.length],
              route: `/${categoryTitle.toLowerCase().replace(/\s+/g, '-')}`,
              itemCount: groupedData[categoryTitle].length
            });
          }
        });

        setAllCategories(categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Fallback to static categories
        const fallbackCategories: MainCategoryCard[] = [
          {
            title: 'Results',
            description: 'Latest exam results, scorecards, and merit lists for government examinations',
            icon: <FileText className="w-12 h-12" />,
            color: 'bg-gradient-to-br from-green-600 to-green-700',
            route: '/results'
          },
          {
            title: 'Admit Card',
            description: 'Download admit cards, hall tickets, and exam date notifications',
            icon: <Calendar className="w-12 h-12" />,
            color: 'bg-gradient-to-br from-blue-600 to-blue-700',
            route: '/admit-card'
          },
          {
            title: 'Latest Jobs',
            description: 'New government job vacancies, recruitment notifications, and career opportunities',
            icon: <Briefcase className="w-12 h-12" />,
            color: 'bg-gradient-to-br from-purple-600 to-purple-700',
            route: '/latest-jobs'
          },
          {
            title: 'Answer Key',
            description: 'Official answer keys, solutions, and question papers for various exams',
            icon: <CheckCircle className="w-12 h-12" />,
            color: 'bg-gradient-to-br from-orange-600 to-orange-700',
            route: '/answer-key'
          },
          {
            title: 'Syllabus',
            description: 'Complete exam syllabus, study materials, and preparation guides',
            icon: <BookOpen className="w-12 h-12" />,
            color: 'bg-gradient-to-br from-red-600 to-red-700',
            route: '/syllabus'
          }
        ];
        setAllCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCardClick = (route: string) => {
    scrollToTop();
    navigate(route);
  };

  if (loading) {
    return (
      <div className="w-full min-w-[1200px] px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Main Categories</h2>
          <p className="text-xl text-gray-600">Loading categories...</p>
        </div>
        <div className="grid grid-cols-5 gap-6" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {[...Array(10)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg animate-pulse border-2 border-gray-200 overflow-hidden">
              <div className="bg-gray-300 h-32"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-[1200px] px-4 py-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">All Categories</h2>
        <p className="text-xl text-gray-600">Explore government job opportunities and exam information</p>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-5 gap-6" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {allCategories.map((category, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-gray-200 hover:border-gray-300 overflow-hidden"
            onClick={() => handleCardClick(category.route)}
          >
            {/* Card Header with Icon */}
            <div className={`${category.color} text-white p-6 text-center`}>
              <div className="flex justify-center mb-3">
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold">{category.title}</h3>
              {category.itemCount && (
                <p className="text-sm opacity-90 mt-1">{category.itemCount} items</p>
              )}
            </div>

            {/* Card Content */}
            <div className="p-6">
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {category.description}
              </p>

              {/* Action Button */}
              <button
                className={`w-full ${category.color.replace('bg-gradient-to-br', 'bg')} text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 hover:opacity-90`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(category.route);
                }}
              >
                <span>Explore {category.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">
          Click on any category to view detailed information and latest updates
        </p>
      </div>
    </div>
  );
};

export default MainCategoryCards;