import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

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

interface NavItem {
  path: string;
  label: string;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Define the specific category sequence
  const categorySequence = ['Results', 'Admit Card', 'Latest Jobs', 'Answer Key', 'Syllabus', 'Admission'];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.dhanlaxmii.com/category/sub');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const subCategories = data.subCategories || [];
        
        // Extract unique main categories and sort them according to the sequence
        const uniqueCategories: string[] = Array.from(
          new Set(subCategories.map((item: SubCategory) => item.mainCategory.title))
        );
        
        // Sort categories according to the predefined sequence
        const sortedCategories = categorySequence.filter(category => 
          uniqueCategories.includes(category)
        );
        
        // Create navigation items from sorted categories
        const categoryNavItems: NavItem[] = sortedCategories.map((category: string) => ({
          path: `/${category.toLowerCase().replace(/\s+/g, '-')}`,
          label: category
        }));
        
        // Add Home as the first item
        const allNavItems: NavItem[] = [
          { path: '/', label: 'Home' },
          ...categoryNavItems
        ];
        
        setNavItems(allNavItems);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Fallback to static categories in the correct sequence
        setNavItems([
          { path: '/', label: 'Home' },
          { path: '/results', label: 'Results' },
          { path: '/admit-card', label: 'Admit Card' },
          { path: '/latest-jobs', label: 'Latest Jobs' },
          { path: '/answer-key', label: 'Answer Key' },
          { path: '/syllabus', label: 'Syllabus' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <nav className="bg-black text-white">
        <div className="w-full min-w-[1200px] px-4">
          <div className="flex items-center justify-center space-x-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="py-6 px-8 text-lg font-bold animate-pulse bg-gray-700 rounded"
                style={{ width: '120px', height: '20px' }}
              ></div>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-black text-white">
      <div className="w-full min-w-[1200px] px-4">
        <div className="flex items-center justify-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => console.log(`🔗 Navbar link clicked: ${item.path}`)}
              className={`py-6 px-8 text-lg font-bold hover:bg-gray-800 transition-colors whitespace-nowrap ${
                location.pathname === item.path ? 'bg-gray-800' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;