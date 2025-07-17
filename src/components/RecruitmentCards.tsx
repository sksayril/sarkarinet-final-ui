import React from 'react';

const RecruitmentCards: React.FC = () => {
  const cards = [
    { title: 'SSC LATEST RECRUITMENT', color: 'bg-green-600', textColor: 'text-white' },
    { title: 'UPSC LATEST RECRUITMENT', color: 'bg-cyan-500', textColor: 'text-white' },
    { title: 'RAILWAY (RRB) RECRUITMENT', color: 'bg-orange-600', textColor: 'text-white' },
    { title: 'STATE PCS RECRUITMENT', color: 'bg-red-700', textColor: 'text-white' },
    { title: 'DEFENCE RECRUITMENT', color: 'bg-red-500', textColor: 'text-white' },
    { title: 'STATE GOVT. RECRUITMENT', color: 'bg-green-700', textColor: 'text-white' },
    { title: 'COLLEGE & UNIVERSITY', color: 'bg-purple-600', textColor: 'text-white' },
    { title: 'BANKING RECRUITMENT', color: 'bg-blue-600', textColor: 'text-white' }
  ];

  return (
    <div className="w-full min-w-[1200px] px-4 py-6">
      <div className="grid grid-cols-4 gap-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} ${card.textColor} p-6 rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl`}
            style={{ minWidth: '250px', height: '120px' }}
          >
            <h3 className="text-lg font-bold text-center leading-tight flex items-center justify-center h-full">
              {card.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruitmentCards;