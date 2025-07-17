import React from 'react';

const FAQ: React.FC = () => {
  const faqItems = [
    {
      question: 'What is Sarkari Result?',
      answer: 'Sarkari Result : Find Latest Sarkari Job Vacancies And Sarkari Exam Results At Sarkariresult.Com.Cm Get All The Information You Need On Govt Jobs And Online From, Exam, Results, Admit Card In One Place.'
    },
    {
      question: 'How can I check the latest government job vacancies?',
      answer: 'You can visit the Sarkari Result website and navigate to the "Latest Jobs" section to check the latest government job vacancies.'
    },
    {
      question: 'Is Sarkari Result free to use?',
      answer: 'Yes, Sarkari Result is completely free to use. You can access all the information on the website without any charges.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">FAQ – Sarkari Result</h3>
        </div>
        <div className="p-4">
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index}>
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