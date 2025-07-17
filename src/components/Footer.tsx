import React from 'react';
import { Mail, Youtube, MessageCircle, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="w-full min-w-[1200px] px-4 py-10">
        <div className="grid grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-red-500 mb-4">Sarkari Result</h3>
            <p className="text-gray-300 text-base leading-relaxed">
              India's leading platform for government job updates, exam results, admit cards, and all Sarkari Naukri information. Get latest updates on UPSC, SSC, Railway, Banking and more.
            </p>
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Youtube className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Send className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Latest Jobs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Admit Cards</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Results</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Answer Keys</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Syllabus</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Admissions</a></li>
            </ul>
          </div>

          {/* Government Exams */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white mb-4">Government Exams</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">UPSC</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">SSC</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Railway</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Banking</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Teaching</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Defence</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-red-500" />
                <span className="text-gray-300 text-base font-medium">info@sarkariresult.com</span>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-gray-400 text-sm leading-relaxed">
                Stay updated with latest government job notifications, exam dates, and results. Join our community for instant updates.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-base">
              © 2025 Sarkari Result. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors text-base font-medium">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors text-base font-medium">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors text-base font-medium">Disclaimer</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 