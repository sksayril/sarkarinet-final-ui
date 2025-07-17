import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/latest-jobs', label: 'Latest Jobs' },
    { path: '/admit-card', label: 'Admit Card' },
    { path: '/results', label: 'Results' },
    { path: '/answer-key', label: 'Answer Key' },
    { path: '/syllabus', label: 'Syllabus' },
    { path: '/admission', label: 'Admission' }
  ];

  return (
    <nav className="bg-black text-white">
      <div className="w-full min-w-[1200px] px-4">
        <div className="flex items-center justify-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
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