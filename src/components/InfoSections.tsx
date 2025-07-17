import React from 'react';

const InfoSections: React.FC = () => {
  const sections = [
    {
      title: 'Sarkari Results 10+2 Latest Job',
      color: 'bg-red-700',
      content: 'Most Recent Sarkari Work, Sarkari Test Result, Most Recent On The Web And Disconnected Structure, Concede Card, Prospectus, Affirmation, Answer Key, Grant, Notice Etc If You Need To Get Refreshes Connected With Sarkari Occupations On Sarkari Result.Com.Cm Like Concede Warning Like Govt. Test, Sarkari Result, Most Recent Bord Result, Bihar Result Tenth And So On You Could Sarkari Result 10+2 Most Recent Occupation At Any Point Website Page Consistently.'
    },
    {
      title: 'Sarkari Results',
      color: 'bg-red-700',
      content: 'Sarkari Results Is A Famous Site In India That Gives Data About Sarkari Work Tests, Sarkari Result 2025, And Other Related Refreshes. It Is One Of The Notable Entries That Many Work Searchers Use To Secure Data About Government Position Opening, Concede Cards, Test Dates, And Results.'
    },
    {
      title: 'Sarkari Result Bihar',
      color: 'bg-red-700',
      content: 'Each Data Connected With Sarkari Test Result In Bihar Can Be Seen As Here Like: OFSS Bihar, Bihar Board Tenth Outcome, Sarkari Result Bihar Board 2025, Bihar Board Matric 2025, Bihar Police 2025, Bihar Board Tenth, Bihar Ssc, Bihar Je, Bihar Common Court, Sarkari Result Bihar Board Result, Bihar Work, Bihar Result, Bihar 10+2 Most Recent Work, Bihar Sarkari Result, Bihar Sarkari Test, Bihar Govt Work, Concede Card, Bihar Sarkari Result, Eleventh Affirmation And So Forth.'
    },
    {
      title: 'Sarkari Result Hindi',
      color: 'bg-red-700',
      content: 'Uttar Pradesh (Sarkariresult.Com.Cm UP Board) Is A State Where Lakhs Of Young People Give Sarkari Test Consistently To Land Government Positions, So Here UP Board Plays A Significant Part, So Here You Will Get Sarkari Result Up Board 2024, Up Barricade Result, Board 2025 Up Board Result, Sarkari Result Up Board Class Tenth, Up Board Result Date, Sarkari Result Up Board 2024 In Hindi And So On. Will Continue To Get Refreshes.'
    },
    {
      title: 'Sarkariresult',
      color: 'bg-red-700',
      content: 'Sarkariresult: Data Presents To You All The Most Recent News Like Outcome, Online Structure, Naukri, Test Result 2025, Work Result, Information Hindi Test, Government Work Data, And Updates, Notice And Output Gives.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className={`${section.color} text-white p-3`}>
              <h3 className="text-lg font-bold text-center">{section.title}</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-700 leading-relaxed text-justify">
                {section.content}
              </p>
              {index === 1 && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>• This Website Is Not Associated With Official Websites.</strong> All Information Provided Is For General Informational Purposes Only.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSections;