import React from 'react';
import { AlertTriangle, Star, Shield, CheckCircle } from 'lucide-react';

const NotesSection: React.FC = () => {
  return (
    <div className="w-full min-w-[1200px] px-4 py-4">
      <div className="flex items-center justify-center">
        <div className="bg-yellow-100 border-4 border-red-500 rounded-xl p-6 shadow-lg max-w-6xl relative">
          {/* Decorative icons at the top */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <div className="bg-red-500 text-white rounded-full p-2 shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div className="bg-red-500 text-white rounded-full p-2 shadow-lg">
              <Star className="w-6 h-6" />
            </div>
            <div className="bg-red-500 text-white rounded-full p-2 shadow-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          
          <div className="flex items-start justify-center space-x-6">
            {/* <AlertTriangle className="w-12 h-12 text-red-600 flex-shrink-0 mt-2" /> */}
            <div className="flex flex-col space-y-4">
              {/* English Text */}
              <div className="border-b-2 border-red-400 pb-3">
                <h3 className="text-2xl font-bold text-red-700 mb-2">
                  IMPORTANT NOTICE:
                </h3>
                <p className="text-small font-bold text-black leading-relaxed">
                  "Our Official Site : [ SARKARI RESULT ] Was Temporarily Down, But Now its Fully Active – So Kindly Beware Of Fake Sites!" THANKYOU!
                </p>
              </div>
              
              {/* Hindi Text */}
              <div>
                <h3 className="text-2xl font-bold text-red-700 mb-2">
                  महत्वपूर्ण सूचना:
                </h3>
                <p className="text-lg font-semibold text-black leading-relaxed">
                  "हमारी आधिकारिक साइट(सरकारी रिजल्ट)कुछ समय के लिए बंद थी, लेकिन अब पूरी तरह से चालू है – कृपया फर्जी साइटों से सावधान रहें!" धन्यवाद!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesSection; 