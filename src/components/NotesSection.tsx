import React from 'react';
import { AlertTriangle } from 'lucide-react';

const NotesSection: React.FC = () => {
  return (
    <div className="w-full min-w-[1200px] px-4 py-4">
      <div className="flex items-center justify-center">
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-6 shadow-lg max-w-6xl">
          <div className="flex items-center justify-center space-x-6">
            <AlertTriangle className="w-30 h-10 text-red-600 flex-shrink-0" />
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-bold text-black">
              महत्वपूर्ण सूचना:
              </h3>
              <p className="text-lg font-semibold text-black">
              हमारी आधिकारिक साइट ( सरकारी रिजल्ट ) कुछ समय के लिए बंद थी, लेकिन अब पूरी तरह से चालू है – कृपया फर्जी साइटों से सावधान रहें!" धन्यवाद!
              </p>
              {/* <p className="text-sm text-black">
                सभी जानकारी सरकारी वेबसाइट से ली गई है
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesSection; 