import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Disclaimer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-red-700 text-white p-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="bg-red-600 hover:bg-red-800 text-white p-2 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-3xl font-bold">📄 Disclaimer for SaarkariResult.com</h1>
            </div>
            <p className="text-red-200 mt-2">Last updated: January 2025</p>
          </div>
          
          {/* Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  The information provided on SaarkariResult.com is for general informational purposes only. While we strive to keep all content accurate and up to date, we make no warranties of any kind regarding the completeness, accuracy, reliability, or availability of any information published.
                </p>
              </div>

              <div className="space-y-8">
                <div className="border-l-4 border-yellow-500 pl-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">⚠️</span>
                    No Official Affiliation
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We are not associated with any government or official organization. All the information about government job notifications, exam results, admit cards, syllabus, etc., is collected from official sources such as government websites, newspapers, and employment portals.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">📝</span>
                    Verify Before Action
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Visitors are advised to verify the details like application dates, eligibility criteria, and official announcements from the official websites or relevant authorities before taking any action.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">📢</span>
                    External Links
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our website may contain links to external websites. While we strive to provide only quality links, we have no control over the content or nature of these sites.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">🚫</span>
                    Liability
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    SaarkariResult.com will not be liable for any loss or damage arising from the use of our website or the information provided herein.
                  </p>
                </div>
              </div>

              <div className="mt-12 bg-gray-100 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center">
                  <span className="mr-2">📬</span>
                  Contact Us
                </h3>
                <p className="text-gray-700 text-center mb-4">
                  If you have any questions about this disclaimer, please contact us at:
                </p>
                <div className="text-center">
                  <a 
                    href="mailto:sarkariresultcollaboration@gmail.com" 
                    className="text-blue-600 hover:text-blue-800 underline text-lg font-semibold flex items-center justify-center"
                  >
                    <span className="mr-2">📧</span>
                    sarkariresultcollaboration@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer; 