import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, BookOpen, Languages, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizState {
  language: 'hindi' | 'english' | null;
  category: string | null;
  questions: Question[];
  currentQuestion: number;
  selectedAnswers: number[];
  score: number;
  timeLeft: number;
  isStarted: boolean;
  isFinished: boolean;
  isLoading: boolean;
}

const DailyQuiz: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    language: null,
    category: null,
    questions: [],
    currentQuestion: 0,
    selectedAnswers: [],
    score: 0,
    timeLeft: 600, // 10 minutes
    isStarted: false,
    isFinished: false,
    isLoading: false
  });

  const jobCategories = [
    { id: 'ssc', name: 'SSC', hindiName: 'एसएससी' },
    { id: 'upsc', name: 'UPSC', hindiName: 'यूपीएससी' },
    { id: 'railway', name: 'Railway Exam', hindiName: 'रेलवे परीक्षा' },
    { id: 'police', name: 'Police', hindiName: 'पुलिस' },
    { id: 'defense', name: 'Defense', hindiName: 'रक्षा' },
    { id: 'state', name: 'State Jobs', hindiName: 'राज्य नौकरियां' },
    { id: 'teacher', name: 'Government Teacher', hindiName: 'सरकारी शिक्षक' },
    { id: 'banking', name: 'Banking Jobs', hindiName: 'बैंकिंग नौकरियां' },
    { id: 'sbi', name: 'SBI PO', hindiName: 'एसबीआई पीओ' },
    { id: 'rbi', name: 'RBI Governor', hindiName: 'आरबीआई गवर्नर' },
    { id: 'other', name: 'Other Exams', hindiName: 'अन्य परीक्षाएं' }
  ];

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizState.isStarted && !quizState.isFinished && quizState.timeLeft > 0) {
      timer = setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (quizState.timeLeft === 0 && quizState.isStarted) {
      finishQuiz();
    }
    return () => clearTimeout(timer);
  }, [quizState.isStarted, quizState.isFinished, quizState.timeLeft]);

  const generateQuestions = async () => {
    if (!quizState.language || !quizState.category) return;

    setQuizState(prev => ({ ...prev, isLoading: true }));

    try {
      const category = jobCategories.find(cat => cat.id === quizState.category);
      const language = quizState.language === 'hindi' ? 'Hindi' : 'English';
      
      const prompt = `Generate 20 extremely difficult multiple choice questions for ${category?.name} (${category?.hindiName}) exam preparation in ${language}. 

      IMPORTANT REQUIREMENTS:
      - Make ALL questions VERY DIFFICULT and EXPERT-LEVEL
      - Questions should be so challenging that even well-prepared candidates would struggle
      - Include complex scenarios, advanced concepts, and tricky reasoning
      - Focus on the most difficult topics and advanced-level content
      - Questions should test deep understanding, not just basic knowledge
      - Include questions that require multiple-step reasoning and analysis
      - Make options very close and confusing to increase difficulty
      - Include questions on the most challenging aspects of ${category?.name} syllabus
      - Questions should be at the level that only top 5% of candidates could answer correctly
      - Include questions that require cross-topic knowledge and application
      - Focus on recent trends, advanced concepts, and complex problem-solving
      - Make questions progressively harder from difficult to extremely difficult
      - Include questions that test analytical skills, critical thinking, and deep subject knowledge

      EXAM-SPECIFIC FOCUS:
      - For SSC: Focus on advanced reasoning, complex mathematical problems, advanced English grammar, and difficult general knowledge
      - For UPSC: Focus on complex current affairs, advanced polity, difficult economics, and challenging geography
      - For Railway: Focus on advanced technical questions, complex reasoning, and difficult general awareness
      - For Police: Focus on complex law questions, advanced reasoning, and difficult current affairs
      - For Defense: Focus on advanced general knowledge, complex reasoning, and difficult current events
      - For Banking: Focus on complex financial concepts, advanced reasoning, and difficult current affairs
      - For Teaching: Focus on advanced pedagogy, complex educational psychology, and difficult subject knowledge
      - For State Jobs: Focus on complex state-specific knowledge, advanced reasoning, and difficult current affairs

      Format the response as JSON:
      {
        "questions": [
          {
            "question": "Very difficult question text with complex scenario",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Detailed explanation of why this is correct and why others are wrong"
          }
        ]
      }

      Make sure ALL questions are at the highest difficulty level possible for ${category?.name} exam.`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyCdBcfqj-PWcIQ5g8jfOrQJqAUdKhDlPdk'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const responseText = data.candidates[0].content.parts[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0]);
          setQuizState(prev => ({
            ...prev,
            questions: parsedData.questions || [],
            isLoading: false,
            isStarted: true
          }));
        } else {
          // Fallback questions if API fails
          setQuizState(prev => ({
            ...prev,
            questions: generateFallbackQuestions(),
            isLoading: false,
            isStarted: true
          }));
        }
      } else {
        // Fallback questions if API fails
        setQuizState(prev => ({
          ...prev,
          questions: generateFallbackQuestions(),
          isLoading: false,
          isStarted: true
        }));
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback questions if API fails
      setQuizState(prev => ({
        ...prev,
        questions: generateFallbackQuestions(),
        isLoading: false,
        isStarted: true
      }));
    }
  };

  const generateFallbackQuestions = (): Question[] => {
    const category = jobCategories.find(cat => cat.id === quizState.category);
    const language = quizState.language === 'hindi' ? 'Hindi' : 'English';
    
    // Generate category-specific difficult questions
    const getCategoryQuestions = () => {
      switch (category?.id) {
        case 'ssc':
          return language === 'Hindi' ? [
            {
              question: `एक जटिल गणितीय समस्या में, यदि x² + y² = 25 और xy = 12 है, तो (x + y)² का मान क्या होगा?`,
              options: ['37', '49', '25', '13'],
              correctAnswer: 1,
              explanation: 'यह एक जटिल बीजगणितीय समस्या है जिसमें (x + y)² = x² + y² + 2xy = 25 + 2(12) = 49'
            },
            {
              question: `किसी परीक्षा में 60% छात्र गणित में उत्तीर्ण हुए, 70% अंग्रेजी में और 50% दोनों में। कितने प्रतिशत छात्र कम से कम एक विषय में उत्तीर्ण हुए?`,
              options: ['80%', '85%', '90%', '95%'],
              correctAnswer: 0,
              explanation: 'सेट थ्योरी के अनुसार: P(A∪B) = P(A) + P(B) - P(A∩B) = 60 + 70 - 50 = 80%'
            }
          ] : [
            {
              question: `In a complex mathematical problem, if x² + y² = 25 and xy = 12, what is the value of (x + y)²?`,
              options: ['37', '49', '25', '13'],
              correctAnswer: 1,
              explanation: 'This is a complex algebraic problem where (x + y)² = x² + y² + 2xy = 25 + 2(12) = 49'
            },
            {
              question: `In an examination, 60% students passed in Mathematics, 70% in English, and 50% in both. What percentage of students passed in at least one subject?`,
              options: ['80%', '85%', '90%', '95%'],
              correctAnswer: 0,
              explanation: 'Using set theory: P(A∪B) = P(A) + P(B) - P(A∩B) = 60 + 70 - 50 = 80%'
            }
          ];

        case 'upsc':
          return language === 'Hindi' ? [
            {
              question: `भारतीय संविधान के अनुच्छेद 356 के तहत राष्ट्रपति शासन लगाने के लिए कौन सी शर्तें पूरी होनी चाहिए?`,
              options: ['राज्य सरकार का पतन', 'संवैधानिक तंत्र का विफल होना', 'कानून और व्यवस्था की विफलता', 'सभी उपरोक्त'],
              correctAnswer: 1,
              explanation: 'अनुच्छेद 356 केवल संवैधानिक तंत्र के विफल होने पर ही लगाया जा सकता है, न कि सरकार के पतन पर'
            },
            {
              question: `भारत के आर्थिक सर्वेक्षण 2023-24 के अनुसार, भारत की वास्तविक GDP वृद्धि दर क्या है?`,
              options: ['6.5%', '7.2%', '7.8%', '8.1%'],
              correctAnswer: 1,
              explanation: 'आर्थिक सर्वेक्षण 2023-24 में भारत की वास्तविक GDP वृद्धि दर 7.2% अनुमानित है'
            }
          ] : [
            {
              question: `Under Article 356 of the Indian Constitution, what conditions must be met for imposing President's Rule?`,
              options: ['Collapse of state government', 'Failure of constitutional machinery', 'Failure of law and order', 'All of the above'],
              correctAnswer: 1,
              explanation: 'Article 356 can only be imposed when constitutional machinery fails, not when government collapses'
            },
            {
              question: `According to India's Economic Survey 2023-24, what is India's real GDP growth rate?`,
              options: ['6.5%', '7.2%', '7.8%', '8.1%'],
              correctAnswer: 1,
              explanation: 'Economic Survey 2023-24 estimates India\'s real GDP growth rate at 7.2%'
            }
          ];

        case 'banking':
          return language === 'Hindi' ? [
            {
              question: `RBI के बेसल III नियमों के अनुसार, बैंकों को कितना न्यूनतम पूंजी पर्याप्तता अनुपात (CAR) बनाए रखना होता है?`,
              options: ['8%', '10.5%', '12%', '15%'],
              correctAnswer: 1,
              explanation: 'बेसल III के अनुसार बैंकों को 10.5% न्यूनतम CAR बनाए रखना होता है'
            },
            {
              question: `भारत में NPA (Non-Performing Assets) की परिभाषा क्या है?`,
              options: ['90 दिनों से अधिक बकाया', '180 दिनों से अधिक बकाया', '365 दिनों से अधिक बकाया', 'कोई भी बकाया राशि'],
              correctAnswer: 0,
              explanation: 'RBI के अनुसार 90 दिनों से अधिक बकाया राशि को NPA माना जाता है'
            }
          ] : [
            {
              question: `According to RBI's Basel III norms, what is the minimum Capital Adequacy Ratio (CAR) that banks must maintain?`,
              options: ['8%', '10.5%', '12%', '15%'],
              correctAnswer: 1,
              explanation: 'According to Basel III, banks must maintain a minimum CAR of 10.5%'
            },
            {
              question: `What is the definition of NPA (Non-Performing Assets) in India?`,
              options: ['Overdue for more than 90 days', 'Overdue for more than 180 days', 'Overdue for more than 365 days', 'Any overdue amount'],
              correctAnswer: 0,
              explanation: 'According to RBI, any amount overdue for more than 90 days is considered NPA'
            }
          ];

        default:
          return language === 'Hindi' ? [
            {
              question: `${category?.hindiName} परीक्षा में सबसे कठिन विषय कौन सा माना जाता है?`,
              options: ['सामान्य ज्ञान', 'गणित', 'अंग्रेजी', 'तर्कशक्ति'],
              correctAnswer: 1,
              explanation: 'गणित सभी सरकारी परीक्षाओं में सबसे कठिन विषय माना जाता है'
            },
            {
              question: `${category?.hindiName} परीक्षा की तैयारी के लिए कितने घंटे पढ़ना चाहिए?`,
              options: ['2-3 घंटे', '4-5 घंटे', '6-8 घंटे', '10-12 घंटे'],
              correctAnswer: 2,
              explanation: 'नियमित रूप से 6-8 घंटे पढ़ना सफलता की कुंजी है'
            }
          ] : [
            {
              question: `Which subject is considered the most difficult in ${category?.name} exam?`,
              options: ['General Knowledge', 'Mathematics', 'English', 'Reasoning'],
              correctAnswer: 1,
              explanation: 'Mathematics is considered the most difficult subject in all government exams'
            },
            {
              question: `How many hours should one study for ${category?.name} exam preparation?`,
              options: ['2-3 hours', '4-5 hours', '6-8 hours', '10-12 hours'],
              correctAnswer: 2,
              explanation: 'Studying 6-8 hours regularly is key to success'
            }
          ];
      }
    };

    return getCategoryQuestions();
  };

  const selectAnswer = (answerIndex: number) => {
    if (quizState.isFinished) return;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [prev.currentQuestion]: answerIndex
      }
    }));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
    }
  };

  const previousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1
      }));
    }
  };

  const finishQuiz = () => {
    let score = 0;
    quizState.questions.forEach((question, index) => {
      if (quizState.selectedAnswers[index] === question.correctAnswer) {
        score++;
      }
    });

    setQuizState(prev => ({
      ...prev,
      score,
      isFinished: true
    }));
  };

  const resetQuiz = () => {
    setQuizState({
      language: null,
      category: null,
      questions: [],
      currentQuestion: 0,
      selectedAnswers: [],
      score: 0,
      timeLeft: 600,
      isStarted: false,
      isFinished: false,
      isLoading: false
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-orange-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-6 animate-bounce">🧠</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Preparing Your Quiz</h1>
              <p className="text-xl text-gray-600">We're cooking up some challenging questions just for you!</p>
            </div>

            {/* Animated Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-lg text-gray-600 mb-4">
                <span className="font-bold">Progress</span>
                <span className="font-bold">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 h-6 rounded-full transition-all duration-2000 ease-out animate-pulse shadow-lg" style={{ width: '75%' }}></div>
              </div>
            </div>

            {/* Loading Animation */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-red-500 rounded-full animate-spin" style={{ animationDelay: '0.5s', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-yellow-500 rounded-full animate-spin" style={{ animationDelay: '1s', animationDuration: '2s' }}></div>
              </div>
            </div>

            {/* Status Messages */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-green-800">Language Selected</div>
                  <div className="text-sm text-green-600">Quiz will be in {quizState.language === 'hindi' ? 'Hindi' : 'English'}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-blue-800">Category Selected</div>
                  <div className="text-sm text-blue-600">
                    {jobCategories.find(cat => cat.id === quizState.category)?.name} 
                    ({jobCategories.find(cat => cat.id === quizState.category)?.hindiName})
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-xl border border-orange-200 animate-pulse">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
                </div>
                <div>
                  <div className="font-bold text-orange-800">Generating Questions</div>
                  <div className="text-sm text-orange-600">Creating challenging questions for you...</div>
                </div>
              </div>
            </div>

            {/* Fun Messages */}
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="text-2xl mb-3">🎯</div>
                <h3 className="text-lg font-bold text-purple-800 mb-2">Expert-Level Questions</h3>
                <p className="text-purple-600">We're preparing questions that will challenge even the most prepared candidates!</p>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
                <div className="text-2xl mb-3">⚡</div>
                <h3 className="text-lg font-bold text-indigo-800 mb-2">AI-Powered Generation</h3>
                <p className="text-indigo-600">Our advanced AI is crafting unique questions tailored to your selected category!</p>
              </div>
            </div>

            {/* Loading Tips */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-full px-6 py-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-yellow-800 font-semibold">Please wait while we prepare your questions...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quizState.isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 hover:text-orange-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold">Daily Quiz</h1>
            <div></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {/* Language Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-orange-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">1. Select Language / भाषा चुनें</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setQuizState(prev => ({ ...prev, language: 'english' }))}
                className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  quizState.language === 'english'
                    ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 shadow-lg'
                    : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">🇺🇸</div>
                  <div className="font-bold text-xl mb-2">English</div>
                  <div className="text-gray-600">Take quiz in English</div>
                  {quizState.language === 'english' && (
                    <div className="mt-3 text-orange-600 font-semibold">✓ Selected</div>
                  )}
                </div>
              </button>
              <button
                onClick={() => setQuizState(prev => ({ ...prev, language: 'hindi' }))}
                className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  quizState.language === 'hindi'
                    ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 shadow-lg'
                    : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">🇮🇳</div>
                  <div className="font-bold text-xl mb-2">हिंदी</div>
                  <div className="text-gray-600">हिंदी में क्विज दें</div>
                  {quizState.language === 'hindi' && (
                    <div className="mt-3 text-orange-600 font-semibold">✓ चयनित</div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Category Selection */}
          {quizState.language && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">2. Select Job Category / नौकरी का क्षेत्र चुनें</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setQuizState(prev => ({ ...prev, category: category.id }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 text-left ${
                      quizState.category === category.id
                        ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-md bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        quizState.category === category.id 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <span className="font-bold text-sm">{category.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.hindiName}</div>
                      </div>
                    </div>
                    {quizState.category === category.id && (
                      <div className="mt-2 text-orange-600 font-semibold text-sm">✓ Selected</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Start Quiz Button */}
          {quizState.language && quizState.category && (
            <div className="text-center mt-8">
              <button
                onClick={generateQuestions}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-6 rounded-full text-2xl font-bold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 animate-pulse"
              >
                🚀 Start Quiz / क्विज शुरू करें
              </button>
              <p className="text-gray-600 mt-4 text-lg">Get ready for an exciting quiz experience!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (quizState.isFinished) {
    const percentage = (quizState.score / quizState.questions.length) * 100;
    const getGrade = (score: number) => {
      if (score >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100', icon: '🏆', message: 'Excellent! Outstanding Performance!' };
      if (score >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100', icon: '🥇', message: 'Great Job! You\'re doing amazing!' };
      if (score >= 70) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-100', icon: '🥈', message: 'Good Work! Keep it up!' };
      if (score >= 60) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100', icon: '🥉', message: 'Well done! You\'re on the right track!' };
      if (score >= 50) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '📚', message: 'Not bad! Practice more to improve!' };
      return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100', icon: '💪', message: 'Keep practicing! You can do better!' };
    };
    const gradeInfo = getGrade(percentage);

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 hover:text-orange-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold">Quiz Results</h1>
            <div></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-orange-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-bounce">{gradeInfo.icon}</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
              <p className="text-xl text-gray-600 mb-4">{gradeInfo.message}</p>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-2">{quizState.score}/{quizState.questions.length}</div>
                  <div className="text-green-600 font-semibold">Correct Answers</div>
                  <div className="text-sm text-green-500 mt-2">🎯 Accuracy</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${gradeInfo.color} mb-2`}>{percentage.toFixed(1)}%</div>
                  <div className="text-blue-600 font-semibold">Score</div>
                  <div className="text-sm text-blue-500 mt-2">📊 Performance</div>
                </div>
              </div>
              <div className={`rounded-2xl p-6 border transform hover:scale-105 transition-all duration-300 ${gradeInfo.bg}`}>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${gradeInfo.color} mb-2`}>{gradeInfo.grade}</div>
                  <div className="text-gray-600 font-semibold">Grade</div>
                  <div className="text-sm text-gray-500 mt-2">🏅 Achievement</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span className="font-semibold">Performance Level</span>
                <span className="font-semibold">{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                    percentage >= 90 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                    percentage >= 80 ? 'bg-gradient-to-r from-green-400 to-blue-500' :
                    percentage >= 70 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                    percentage >= 60 ? 'bg-gradient-to-r from-blue-400 to-yellow-500' :
                    percentage >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    'bg-gradient-to-r from-red-400 to-red-600'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Detailed Question Report */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Detailed Question Report</h3>
              <div className="space-y-6">
                {quizState.questions.map((question, index) => {
                  const userAnswer = quizState.selectedAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  const userAnswerText = userAnswer !== undefined ? question.options[userAnswer] : 'Not answered';
                  const correctAnswerText = question.options[question.correctAnswer];
                  
                  return (
                    <div key={index} className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
                      isCorrect 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            isCorrect ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className={`text-lg font-bold ${
                            isCorrect ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                          isCorrect 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          Question {index + 1}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">{question.question}</h4>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className={`p-3 rounded-lg border-2 ${
                              optionIndex === question.correctAnswer
                                ? 'bg-green-100 border-green-300 text-green-800'
                                : optionIndex === userAnswer && !isCorrect
                                ? 'bg-red-100 border-red-300 text-red-800'
                                : 'bg-gray-50 border-gray-200 text-gray-700'
                            }`}>
                              <div className="flex items-center space-x-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                                  optionIndex === question.correctAnswer
                                    ? 'bg-green-500 text-white'
                                    : optionIndex === userAnswer && !isCorrect
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-300 text-gray-600'
                                }`}>
                                  {String.fromCharCode(65 + optionIndex)}
                                </div>
                                <span className="font-medium">{option}</span>
                                {optionIndex === question.correctAnswer && (
                                  <div className="ml-auto text-green-600 font-bold">✓ Correct Answer</div>
                                )}
                                {optionIndex === userAnswer && !isCorrect && (
                                  <div className="ml-auto text-red-600 font-bold">✗ Your Answer</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Answer Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className={`p-4 rounded-lg ${
                          isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
                        }`}>
                          <div className="font-bold text-gray-800 mb-1">Your Answer:</div>
                          <div className={`font-semibold ${
                            isCorrect ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {userAnswer !== undefined ? userAnswerText : 'Not answered'}
                          </div>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                          <div className="font-bold text-gray-800 mb-1">Correct Answer:</div>
                          <div className="font-semibold text-blue-700">{correctAnswerText}</div>
                        </div>
                      </div>

                      {/* Explanation */}
                      {question.explanation && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="font-bold text-blue-800 mb-2">📚 Explanation:</div>
                          <p className="text-blue-700 leading-relaxed">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Encouraging Message */}
            <div className={`rounded-2xl p-6 mb-8 ${gradeInfo.bg} border border-orange-200`}>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Keep Learning!</h3>
                <p className="text-gray-700">
                  {percentage >= 90 ? "You're a quiz master! Keep up the excellent work!" :
                   percentage >= 80 ? "You're doing fantastic! Continue your great performance!" :
                   percentage >= 70 ? "You're on the right track! Keep practicing to improve further!" :
                   percentage >= 60 ? "Good effort! Regular practice will help you excel!" :
                   percentage >= 50 ? "You have potential! More practice will lead to better results!" :
                   "Don't give up! Every attempt is a step towards success!"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🔄 Take Another Quiz
              </button>
              <Link
                to="/"
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center"
              >
                🏠 Back to Home
              </Link>
            </div>

            {/* Share Results */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Share your achievement with friends!</p>
              <div className="flex justify-center space-x-4">
                <button className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors">
                  📘
                </button>
                <button className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors">
                  📱
                </button>
                <button className="w-12 h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center transition-colors">
                  📧
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestion];
  const selectedAnswer = quizState.selectedAnswers[quizState.currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-3 hover:text-orange-200 transition-colors">
              <ArrowLeft className="w-6 h-6" />
              <span className="font-semibold text-lg">Back</span>
            </Link>
            <div className="flex items-center space-x-4 bg-white bg-opacity-20 rounded-full px-6 py-3 backdrop-blur-sm">
              <Clock className="w-6 h-6" />
              <span className="font-bold text-2xl">{formatTime(quizState.timeLeft)}</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Daily Quiz</h1>
          <div className="text-right">
            <div className="text-lg opacity-90 mb-1">Question {quizState.currentQuestion + 1} of {quizState.questions.length}</div>
            <div className="text-xl font-bold">Score: {quizState.score}</div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-orange-100">
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between text-lg text-gray-600 mb-4">
              <span className="font-bold text-xl">Progress</span>
              <span className="font-bold text-xl">{Math.round(((quizState.currentQuestion + 1) / quizState.questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${((quizState.currentQuestion + 1) / quizState.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 mb-8 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">{quizState.currentQuestion + 1}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Question</h2>
                  <p className="text-gray-600">Choose the correct answer</p>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-relaxed">
                {currentQuestion?.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-5">
              {currentQuestion?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full p-6 text-left rounded-2xl border-4 transition-all duration-300 transform hover:scale-105 ${
                    selectedAnswer === index
                      ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 shadow-2xl ring-4 ring-orange-200 scale-105'
                      : 'border-gray-200 hover:border-orange-300 hover:shadow-lg bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-5">
                    <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-xl transition-all duration-300 ${
                      selectedAnswer === index 
                        ? 'border-orange-500 bg-orange-500 text-white shadow-xl ring-2 ring-orange-300 scale-110' 
                        : 'border-gray-300 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-semibold text-xl sm:text-2xl leading-relaxed">{option}</span>
                  </div>
                  {selectedAnswer === index && (
                    <div className="mt-4 text-orange-600 font-bold text-lg flex items-center">
                      <CheckCircle className="w-6 h-6 mr-3" />
                      Selected Answer
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-10">
            <button
              onClick={previousQuestion}
              disabled={quizState.currentQuestion === 0}
              className="px-8 py-4 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              ← Previous
            </button>

            <div className="text-center">
              <div className="text-lg text-gray-600 mb-3 font-semibold">Question {quizState.currentQuestion + 1} of {quizState.questions.length}</div>
              <div className="flex space-x-2">
                {Array.from({ length: quizState.questions.length }, (_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      i === quizState.currentQuestion 
                        ? 'bg-orange-500 shadow-lg scale-125' 
                        : i < quizState.currentQuestion 
                          ? 'bg-green-500 shadow-md' 
                          : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {quizState.currentQuestion === quizState.questions.length - 1 ? (
              <button
                onClick={finishQuiz}
                className="px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-110"
              >
                🏁 Finish Quiz
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuiz; 