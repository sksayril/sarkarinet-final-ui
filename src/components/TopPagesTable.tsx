import React from 'react';

const TopPagesTable: React.FC = () => {
  const pages = [
    ['Bharat Result', 'Up Police Result', 'Bihar Police Result'],
    ['Sarkari Exam', 'SarkariResult Hindi', 'Sarkari Result Ntpc'],
    ['Sarkari Result 2025', 'Sarkari Result', 'Sarkari'],
    ['Sarkari Naukri', 'Sarkari Result 10th', 'Sarkari Result Center'],
    ['Sarkari Result 10+2', 'Sarkariresult', 'Sarkari Result SSC']
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="text-center py-2 bg-gray-50 border-b">
          <h3 className="text-sm font-bold text-green-600">
            ******** <span className="text-red-600 underline">Top Sarkari Result Pages</span> ********
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {pages.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2 text-center border-r border-gray-200 last:border-r-0">
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                        {cell}
                      </a>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopPagesTable;