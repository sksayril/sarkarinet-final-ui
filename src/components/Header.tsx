import React from 'react';
import { Youtube, Send, MessageCircle, Linkedin, } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-red-700 text-white">
      <div className="w-full min-w-[1200px] px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="w-30 h-30 bg-white rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img 
              src="/PhotoRoom-20250716_202655.png" 
              alt="Sarkari Result Logo" 
              className="w-40 h-40 object-contain"
            />
          </div>
          
          {/* Centered Title */}
          <div className="flex-1 text-center">
            <h1 className="text-6xl font-bold tracking-wider whitespace-nowrap">SARKARI RESULT</h1>
            <p className="text-4xl mt-2">www.sarkariresult.com</p>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center cursor-pointer hover:from-red-700 hover:to-red-800 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 border-2 border-white shadow-black/50">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:from-blue-700 hover:to-blue-800 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 border-2 border-white shadow-black/50">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center cursor-pointer hover:from-green-700 hover:to-green-800 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 border-2 border-white shadow-black/50">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;