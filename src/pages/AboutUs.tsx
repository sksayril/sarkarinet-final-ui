import React from 'react';
import { Users, Target, Award, Globe, TrendingUp, Shield } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-red-600">Sarkari Result</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in government job preparation and career advancement. 
            We provide comprehensive updates on Sarkari Naukri, exam notifications, and career guidance.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Target className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To empower millions of aspirants across India with timely, accurate, and comprehensive 
              information about government job opportunities, exam notifications, and career guidance. 
              We strive to bridge the gap between job seekers and government employment opportunities.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Award className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To become the most trusted and comprehensive platform for government job aspirants, 
              providing end-to-end support from job discovery to successful placement. We envision 
              a future where every deserving candidate has access to government employment opportunities.
            </p>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Latest Job Updates</h3>
              <p className="text-gray-600">
                Real-time notifications for government job openings, exam dates, and application deadlines 
                across all sectors including UPSC, SSC, Railway, Banking, and more.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Exam Resources</h3>
              <p className="text-gray-600">
                Comprehensive study materials, admit cards, answer keys, results, and syllabus 
                for various government examinations to help you prepare effectively.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Guidance</h3>
              <p className="text-gray-600">
                Expert advice, preparation strategies, and success stories to guide you through 
                your government job preparation journey and career development.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Sarkari Result?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Globe className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Nationwide Coverage</h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive coverage of government jobs from all states and central government departments.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                <p className="text-gray-600 text-sm">
                  Instant notifications and updates about new job openings and exam notifications.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Verified Information</h3>
                <p className="text-gray-600 text-sm">
                  All information is verified and sourced directly from official government websites.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">User-Friendly</h3>
                <p className="text-gray-600 text-sm">
                  Easy-to-navigate platform designed for users of all technical backgrounds.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Award className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Quality Content</h3>
                <p className="text-gray-600 text-sm">
                  High-quality, well-researched content to help you make informed decisions.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Target className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Support</h3>
                <p className="text-gray-600 text-sm">
                  Complete support from job discovery to application and preparation guidance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-lg shadow-lg mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-red-100">Years of Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-red-100">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-red-100">Job Updates</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-red-100">Verified Information</div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Have questions about government jobs or need assistance with your preparation? 
            We're here to help you succeed in your career goals.
          </p>
          <a 
            href="/contact-us" 
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
