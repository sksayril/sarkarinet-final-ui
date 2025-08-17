import React from 'react';
import { Mail, Youtube, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="w-full min-w-[1200px] px-4 py-10">
        <div className="grid grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-red-500 mb-4">Sarkari Result</h3>
            <p className="text-gray-300 text-base leading-relaxed">
            SaarkariResult.com for Sarkari Result, Sarkari Result jobs, Sarkari Result admit cards & Sarkari Result online forms. Sarkari Result 2025 live updates.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.youtube.com/channel/UCVT29pLEmQMg2PSWnIaKKdw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                title="YouTube Channel"
              >
                <Youtube className="w-6 h-6" />
              </a>
              <a 
                href="https://whatsapp.com/channel/0029Vb64LpHKbYMM6c72230S" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                title="WhatsApp Channel"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
              <a 
                href="https://t.me/saarkariresult" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                title="Telegram Channel"
              >
                <Send className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/latest-jobs" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Latest Jobs</Link></li>
              <li><Link to="/admit-card" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Admit Cards</Link></li>
              <li><Link to="/results" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Results</Link></li>
              <li><Link to="/answer-key" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Answer Keys</Link></li>
              <li><Link to="/syllabus" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Syllabus</Link></li>
              <li><Link to="/admission" className="text-gray-300 hover:text-red-500 transition-colors text-base font-medium">Admissions</Link></li>
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
                <span className="text-gray-300 text-base font-medium">sarkariresultcollaboration@gmail.com</span>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-gray-400 text-sm leading-relaxed">
              SaarkariResult.com for Sarkari Result, Sarkari Result jobs, Sarkari Result admit cards & Sarkari Result online forms. Sarkari Result 2025 live updates.
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

              <Link to="/privacy-policy" className="text-gray-400 hover:text-red-500 transition-colors text-base font-medium">Privacy Policy</Link>
              <Link to="/contact-us" className="text-gray-400 hover:text-red-500 transition-colors text-base font-medium">Contact us</Link>
              <Link to="/about-us" className="text-gray-400 hover:text-red-500 transition-colors text-base font-medium">About us</Link>
              <Link to="/terms-conditions" className="text-gray-400 hover:text-red-500 transition-colors text-base font-medium">Terms of Service</Link>
              <Link to="/disclaimer" className="text-gray-400 hover:text-red-500 transition-colors text-base font-medium">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 