import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
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
              <h1 className="text-3xl font-bold">Privacy Policy for SaarkariResult.com</h1>
            </div>
            <p className="text-red-200 mt-2">Last updated: January 2025</p>
          </div>
          
          {/* Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6 leading-relaxed">
                At SaarkariResult.com, accessible from https://saarkariresult.com, the privacy of our visitors is of extreme importance to us. This Privacy Policy document outlines the types of personal information that is received and collected by saarkariResult.com and how it is used.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Personal Information:</strong> Such as your name and email address, only when you voluntarily submit it through contact forms or newsletter subscriptions.</li>
                <li><strong>Non-Personal Information:</strong> Including browser type, IP address, operating system, and date/time of visit, which helps us analyze trends and improve our website.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>To provide, operate, and maintain our website</li>
                <li>To improve, personalize, and expand our services</li>
                <li>To understand and analyze how you use our website</li>
                <li>To send you emails or updates (only if you opt-in)</li>
                <li>To prevent fraudulent activity and enhance security</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Log Files</h2>
              <p className="text-gray-700 mb-4">
                Like many other websites, saarkariResult.com uses log files. These files log visitors to the site — usually a standard procedure for hosting companies and a part of hosting services' analytics. The information inside the log files includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Internet Protocol (IP) addresses</li>
                <li>Browser type</li>
                <li>Internet Service Provider (ISP)</li>
                <li>Date/time stamp</li>
                <li>Referring/exit pages</li>
                <li>Clicks to analyze trends</li>
              </ul>
              <p className="text-gray-700 mb-6">This information is not linked to any information that is personally identifiable.</p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Cookies and Web Beacons</h2>
              <p className="text-gray-700 mb-4">
                saarkariResult.com uses cookies to store information about visitors' preferences, record user-specific information on which pages the user accesses, and personalize or customize our web page content.
              </p>
              <p className="text-gray-700 mb-6">You can choose to disable cookies through your individual browser options.</p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Google AdSense & Third-Party Ads</h2>
              <p className="text-gray-700 mb-4">
                We may use Google AdSense and other third-party advertising companies to serve ads when you visit our website. These companies may use information (not including your name, address, or email address) about your visits to provide advertisements about goods and services of interest to you.
              </p>
              <p className="text-gray-700 mb-4">
                Google uses the DoubleClick DART cookie which enables it to serve ads based on your visit to our site and other sites on the internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy at{' '}
                <a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                  https://policies.google.com/technologies/ads
                </a>
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Links to External Sites</h2>
              <p className="text-gray-700 mb-6">
                Our website may contain links to other websites. We are not responsible for the privacy practices or the content of such websites. We encourage users to read the privacy policies of any third-party websites.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Children's Information</h2>
              <p className="text-gray-700 mb-6">
                We do not knowingly collect any personally identifiable information from children under the age of 13. If a parent or guardian believes that saarkariResult.com has in its database the personally-identifiable information of a child under the age of 13, please contact us immediately and we will use our best efforts to promptly remove such information.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Your Consent</h2>
              <p className="text-gray-700 mb-6">
                By using our website, you hereby consent to our Privacy Policy and agree to its terms.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Updates to This Privacy Policy</h2>
              <p className="text-gray-700 mb-6">
                We may update our Privacy Policy from time to time. We encourage you to review this page periodically. Changes will be effective immediately after they are posted on this page.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions or concerns about this Privacy Policy, you may contact us at:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700">
                  📧 <strong>Email:</strong> <a href="mailto:saarkariresultcollaboration@gmail.com" className="text-blue-600 hover:text-blue-800 underline">saarkariresultcollaboration@gmail.com</a><br />
                  🌐 <strong>Website:</strong> <a href="https://saarkariresult.com" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">https://saarkariresult.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 