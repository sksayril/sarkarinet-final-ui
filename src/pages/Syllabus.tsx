import React from 'react';

const Syllabus: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-red-700 text-white p-4">
          <h1 className="text-2xl font-bold text-center">Syllabus</h1>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800">UPSC Civil Services 2024 Final Result</h3>
              <p className="text-sm text-gray-600 mt-1">Updated: 25-01-2025</p>
              <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Download PDF
              </button>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800">RRB ALP / Technician CBT 2 Result 2025</h3>
              <p className="text-sm text-gray-600 mt-1">Updated: 22-01-2025</p>
              <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Download PDF
              </button>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800">UP Board Class 10th / 12th Result 2025</h3>
              <p className="text-sm text-gray-600 mt-1">Updated: 20-01-2025</p>
              <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Syllabus;