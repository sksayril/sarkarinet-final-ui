import React from 'react';

const Admission: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-red-700 text-white p-4">
          <h1 className="text-2xl font-bold text-center">Admission</h1>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800">SSC CGL 2025 Tier I Admit Card</h3>
              <p className="text-sm text-gray-600 mt-1">Admission Date: 20-01-2025</p>
              <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Apply Now
              </button>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800">UPSC NDA II 2025 Admit Card</h3>
              <p className="text-sm text-gray-600 mt-1">Admission Date: 18-01-2025</p>
              <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Apply Now
              </button>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800">IBPS PO Pre Admit Card 2025</h3>
              <p className="text-sm text-gray-600 mt-1">Admission Date: 15-01-2025</p>
              <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admission;