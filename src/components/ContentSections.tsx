import React from 'react';
import { Star, ArrowRight } from 'lucide-react';

const ContentSections: React.FC = () => {
  const sections = [
    {
      title: 'Latest Jobs',
      color: 'bg-red-700',
      items: [
        'UPSSSC Junior Engineer Online Form 2025',
        'IBPS Clerk XIII Online Form 2025',
        'Railway RPF Constable / SI Apply Online',
        'SSC CHSL 10+2 Online Form 2025',
        'Bihar BPSC Head Teacher Online Form'
      ]
    },
    {
      title: 'Results',
      color: 'bg-red-700',
      items: [
        'UPSC Civil Services 2024 Final Result',
        'RRB ALP / Technician CBT 2 Result 2025',
        'UP Board Class 10th / 12th Result 2025',
        'SBI PO Final Result 2025'
      ]
    },
    {
      title: 'Admit Card',
      color: 'bg-red-700',
      items: [
        'SSC CGL 2025 Tier I Admit Card',
        'UPSC NDA II 2025 Admit Card',
        'IBPS PO Pre Admit Card 2025',
        'UPTET 2025 Admit Card'
      ]
    },
    {
      title: 'Answer Key',
      color: 'bg-red-700',
      items: [
        'UPSSSC Junior Engineer Online Form 2025',
        'IBPS Clerk XIII Online Form 2025',
        'Railway RPF Constable / SI Apply Online',
        'SSC CHSL 10+2 Online Form 2025',
        'Bihar BPSC Head Teacher Online Form'
      ]
    },
    {
      title: 'Syllabus',
      color: 'bg-red-700',
      items: [
        'UPSC Civil Services 2024 Final Result',
        'RRB ALP / Technician CBT 2 Result 2025',
        'UP Board Class 10th / 12th Result 2025',
        'SBI PO Final Result 2025'
      ]
    },
    {
      title: 'Admission',
      color: 'bg-red-700',
      items: [
        'SSC CGL 2025 Tier I Admit Card',
        'UPSC NDA II 2025 Admit Card',
        'IBPS PO Pre Admit Card 2025',
        'UPTET 2025 Admit Card'
      ]
    }
  ];

  return (
    <div className="w-full min-w-[1200px] px-4 py-6">
      <div className="grid grid-cols-3 gap-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {sections.map((section, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden" style={{ minWidth: '380px' }}>
            <div className={`${section.color} text-white p-4`}>
              <h3 className="text-3xl font-bold text-center">{section.title}</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                {section.items.slice(0, index < 3 ? 5 : 4).map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-2">
                    <Star className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-lg text-blue-600 hover:text-blue-800 cursor-pointer underline">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span className="text-xl font-bold">View More</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentSections;