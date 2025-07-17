import React, { useState, useEffect } from 'react';

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

interface HomeContentData {
  _id: string;
  title: string;
  description: string;
  telegramLink: string;
  whatsappLink: string;
  faqs: FAQItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: HomeContentData;
}

const FAQ: React.FC = () => {
  const [faqData, setFaqData] = useState<HomeContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://api.dhanlaxmii.com/home-content/public/active');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (result.success && result.data) {
          setFaqData(result.data);
        } else {
          throw new Error('Failed to fetch FAQ data');
        }
      } catch (err) {
        console.error('Error fetching FAQ data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching FAQ data');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">FAQ – Sarkari Result</h3>
          </div>
          <div className="p-4">
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading FAQs...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">FAQ – Sarkari Result</h3>
          </div>
          <div className="p-4">
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">Error loading FAQs</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!faqData || !faqData.faqs || faqData.faqs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">FAQ – Sarkari Result</h3>
          </div>
          <div className="p-4">
            <div className="text-center py-8">
              <p className="text-gray-600">No FAQs available at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">FAQ – Sarkari Result</h3>
        </div>
        <div className="p-4">
          <div className="space-y-6">
            {faqData.faqs.map((item) => (
              <div key={item._id}>
                <h4 className="text-sm font-bold text-gray-800 mb-2">{item.question}</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;