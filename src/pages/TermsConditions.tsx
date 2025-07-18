import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsConditions: React.FC = () => {
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
              <h1 className="text-3xl font-bold">Terms and Conditions for SaarkariResult.com</h1>
            </div>
            <p className="text-red-200 mt-2">Last updated: January 2025</p>
          </div>
          
          {/* Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to SaarkariResult.com!</h2>
                <p className="text-gray-700 text-lg">
                  By accessing this website, you agree to be bound by the following <strong>terms and conditions</strong>. If you do not agree with any part of these terms, please do not use our website.
                </p>
              </div>

              <div className="space-y-8">
                <div className="border-l-4 border-red-600 pl-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">1. Use of the Website</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>The content provided on this website is for <strong>informational purposes only</strong>.</li>
                    <li>You agree not to misuse the site or its content.</li>
                    <li>You must be at least 13 years of age to use this website.</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-600 pl-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">2. Intellectual Property</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>All content, logos, graphics, and materials available on <strong>SaarkariResult.com</strong> are the property of the website unless stated otherwise.</li>
                    <li>You may not copy, reproduce, or distribute any content without prior written permission.</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-600 pl-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">3. No Government Affiliation</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>We are <strong>not affiliated with any government body</strong> or organization.</li>
                    <li>We only <strong>share public job information</strong> collected from official websites and employment news sources.</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-600 pl-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">4. Information Accuracy</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>We try our best to keep the content updated and correct.</li>
                    <li>However, <strong>we do not guarantee the accuracy</strong> of any job-related information.</li>
                    <li>Users must <strong>verify all information</strong> from the official government website before applying.</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-600 pl-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">5. Third-Party Links</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Our website may contain links to external websites.</li>
                    <li>We are <strong>not responsible</strong> for the content, privacy, or accuracy of any third-party websites.</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-600 pl-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">6. Changes to Terms</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>We reserve the right to change or modify these terms at any time.</li>
                    <li>Continued use of the website after changes implies your acceptance of the updated terms.</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-600 pl-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">7. Limitation of Liability</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>We are <strong>not responsible</strong> for any direct, indirect, or incidental loss or damage that may occur from using our website.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 bg-gray-100 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Contact Information</h3>
                <p className="text-gray-700 text-center mb-4">
                  For any queries regarding these Terms and Conditions, please contact us at:
                </p>
                <div className="text-center">
                  <a 
                    href="mailto:sarkariresultcollaboration@gmail.com" 
                    className="text-blue-600 hover:text-blue-800 underline text-lg font-semibold"
                  >
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

export default TermsConditions; 