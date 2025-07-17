import React from 'react';
import { AlertTriangle } from 'lucide-react';

const NotesSection: React.FC = () => {
  return (
    <div className="w-full min-w-[1200px] px-4 py-4">
      <div className="flex items-center justify-center">
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-6 shadow-lg max-w-6xl">
          <div className="flex items-center justify-center space-x-6">
            <AlertTriangle className="w-10 h-10 text-red-600 flex-shrink-0" />
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-bold text-black">
                ⚠️ महत्वपूर्ण सूचना:
              </h3>
              <p className="text-lg font-semibold text-black">
                यही Sarkari Result है, किसी के धोखाधड़ी में न फंसे!
              </p>
              <p className="text-sm text-black">
                सभी जानकारी सरकारी वेबसाइट से ली गई है
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesSection; 