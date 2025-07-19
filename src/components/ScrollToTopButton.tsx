import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '../utils/scrollToTop';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const handleClick = () => {
    scrollToTop();
  };

  if (!isVisible) {
    return null;
  }

  // return (
  //   <button
  //     onClick={handleClick}
  //     className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 transform hover:scale-110"
  //     aria-label="Scroll to top"
  //   >
  //     <ArrowUp className="w-6 h-6" />
  //   </button>
  // );
};

export default ScrollToTopButton; 