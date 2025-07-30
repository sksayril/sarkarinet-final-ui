import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX, Bot, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const AIVoice: React.FC = () => {
  console.log('🎯 AIVoice component loaded! Route /aivoice is working!');
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState<string>('Ready to listen');
  const [lastQuestion, setLastQuestion] = useState<string>('');
  const [lastAnswer, setLastAnswer] = useState<string>('');
  const [speechLanguage, setSpeechLanguage] = useState<string>('en-US');
  const [recognitionLanguage, setRecognitionLanguage] = useState<string>('en-US');

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = recognitionLanguage;
      
      recognitionInstance.onstart = () => {
        console.log('🎤 Speech recognition started');
        setIsListening(true);
        setCurrentStatus('Listening... Speak now!');
      };
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('🎤 Speech recognized:', transcript);
        setLastQuestion(transcript);
        setCurrentStatus('Processing your question...');
        setIsListening(false);
        setIsProcessing(true);
        
        // Auto-process the voice input
        setTimeout(() => {
          handleVoiceQuestion(transcript);
        }, 500);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('🎤 Speech recognition error:', event.error);
        setIsListening(false);
        setCurrentStatus('Error: Please try again');
        if (event.error === 'no-speech') {
          setCurrentStatus('No speech detected. Please try again.');
        }
      };
      
      recognitionInstance.onend = () => {
        console.log('🎤 Speech recognition ended');
        setIsListening(false);
        if (!isProcessing) {
          setCurrentStatus('Ready to listen');
        }
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech recognition not supported in this browser');
      setCurrentStatus('Voice input not supported in your browser');
    }
  }, [isProcessing]);

  const callAIAPI = async (userMessage: string): Promise<string> => {
    try {
      console.log('🤖 Calling AI API with message:', userMessage);
      
      const systemPrompt = `You are Sarkari Result AI Assistant, a helpful voice AI designed to assist users with government job-related queries. You should: 
1. Provide accurate information about government jobs, exams, and recruitment 
2. Help with exam preparation tips and strategies 
3. Guide users about application processes and deadlines 
4. Share information about various government departments and positions 
5. Be friendly, professional, and encouraging 
6. Respond in ${speechLanguage === 'hi-IN' ? 'Hindi (हिंदी)' : 'English'} language as per user preference
7. Keep responses concise but informative (2-3 sentences max for voice) 
8. Always verify information accuracy and suggest checking official websites 

Remember: You are here to help users navigate the complex world of government jobs and exams. Keep responses conversational and brief since this is voice interaction.`;
      
      const response = await fetch('https://api.a0.dev/ai/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🤖 AI API response:', data);
      
      return data.completion || 'Sorry, I couldn\'t generate a response.';
    } catch (error) {
      console.error('🤖 AI API error:', error);
      return 'Sorry, I encountered an error while processing your request. Please try again.';
    }
  };

  const handleVoiceQuestion = async (question: string) => {
    try {
      setCurrentStatus('Getting AI response...');
      
      // Call the real AI API
      const aiResponse = await callAIAPI(question);
      setLastAnswer(aiResponse);
      setCurrentStatus('Speaking response...');
      
      // Auto speak if enabled
      if (autoSpeak && voiceEnabled) {
        speakText(aiResponse);
      } else {
        setCurrentStatus('Response ready. Click speak to hear it.');
      }

    } catch (error) {
      console.error('Error processing voice question:', error);
      setCurrentStatus('Error processing your question. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.lang = speechLanguage;
      
      utterance.onstart = () => {
        setCurrentStatus('Speaking...');
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentStatus('Ready for next question');
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentStatus('Speech error. Please try again.');
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentStatus('Ready to listen');
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setCurrentStatus('Ready to listen');
    } else {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        setCurrentStatus('Error starting voice recognition');
      }
    }
  };

  const speakLastAnswer = () => {
    if (lastAnswer && !isSpeaking) {
      speakText(lastAnswer);
    }
  };

  const resetVoice = () => {
    setLastQuestion('');
    setLastAnswer('');
    setCurrentStatus('Ready to listen');
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  const toggleLanguage = () => {
    if (speechLanguage === 'en-US') {
      setSpeechLanguage('hi-IN');
      setRecognitionLanguage('hi-IN');
    } else {
      setSpeechLanguage('en-US');
      setRecognitionLanguage('en-US');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:text-purple-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
            <span className="font-semibold text-lg">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Sarkari Result AI Assistant</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                voiceEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
              }`}
              title={voiceEnabled ? 'Voice Enabled' : 'Voice Disabled'}
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={resetVoice}
              className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              title="Clear Chat"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
          {/* Voice Interaction Area */}
          <div className="h-full flex flex-col items-center justify-center p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sarkari Result AI Assistant</h2>
              <p className="text-gray-600">Ask me about government jobs, exams, recruitment, and more!</p>
            </div>

            {/* Animated Voice Status */}
            <div className="relative">
              {/* Main Voice Button with Animation */}
              <button
                onClick={toggleListening}
                disabled={isProcessing}
                className={`relative p-8 rounded-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 text-white scale-110 shadow-2xl' 
                    : isProcessing
                    ? 'bg-yellow-500 text-white scale-105 shadow-xl'
                    : isSpeaking
                    ? 'bg-green-500 text-white scale-105 shadow-xl'
                    : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isListening ? 'Stop Listening' : 'Start Voice Input'}
              >
                {isListening ? (
                  <MicOff className="w-12 h-12" />
                ) : isProcessing ? (
                  <div className="w-12 h-12 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : isSpeaking ? (
                  <Volume2 className="w-12 h-12" />
                ) : (
                  <Mic className="w-12 h-12" />
                )}
               
                {/* Pulsing Animation Rings */}
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></div>
                    <div className="absolute inset-2 rounded-full bg-red-300 animate-ping opacity-50"></div>
                    <div className="absolute inset-4 rounded-full bg-red-200 animate-ping opacity-25"></div>
                  </>
                )}
                
                {isProcessing && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-yellow-400 animate-pulse opacity-75"></div>
                    <div className="absolute inset-2 rounded-full bg-yellow-300 animate-pulse opacity-50"></div>
                  </>
                )}
                
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-75"></div>
                    <div className="absolute inset-2 rounded-full bg-green-300 animate-pulse opacity-50"></div>
                  </>
                )}
              </button>

              {/* Wave Animation for Speaking */}
              {isSpeaking && (
                <div className="absolute -top-20 -left-20 w-40 h-40 flex items-center justify-center">
                  <div className="relative">
                    {/* Wave bars */}
                    <div className="flex items-end space-x-1 h-16">
                      <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '60%' }}></div>
                      <div className="w-1 bg-green-500 rounded-full wave-bar" style={{ height: '80%' }}></div>
                      <div className="w-1 bg-green-600 rounded-full wave-bar" style={{ height: '100%' }}></div>
                      <div className="w-1 bg-green-500 rounded-full wave-bar" style={{ height: '70%' }}></div>
                      <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '90%' }}></div>
                      <div className="w-1 bg-green-500 rounded-full wave-bar" style={{ height: '60%' }}></div>
                      <div className="w-1 bg-green-600 rounded-full wave-bar" style={{ height: '85%' }}></div>
                      <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '75%' }}></div>
                      <div className="w-1 bg-green-500 rounded-full wave-bar" style={{ height: '95%' }}></div>
                      <div className="w-1 bg-green-600 rounded-full wave-bar" style={{ height: '65%' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wave Animation for Listening */}
              {isListening && (
                <div className="absolute -top-20 -left-20 w-40 h-40 flex items-center justify-center">
                  <div className="relative">
                    {/* Wave bars */}
                    <div className="flex items-end space-x-1 h-16">
                      <div className="w-1 bg-red-400 rounded-full wave-bar" style={{ height: '70%' }}></div>
                      <div className="w-1 bg-red-500 rounded-full wave-bar" style={{ height: '90%' }}></div>
                      <div className="w-1 bg-red-600 rounded-full wave-bar" style={{ height: '100%' }}></div>
                      <div className="w-1 bg-red-500 rounded-full wave-bar" style={{ height: '80%' }}></div>
                      <div className="w-1 bg-red-400 rounded-full wave-bar" style={{ height: '95%' }}></div>
                      <div className="w-1 bg-red-500 rounded-full wave-bar" style={{ height: '75%' }}></div>
                      <div className="w-1 bg-red-600 rounded-full wave-bar" style={{ height: '85%' }}></div>
                      <div className="w-1 bg-red-400 rounded-full wave-bar" style={{ height: '90%' }}></div>
                      <div className="w-1 bg-red-500 rounded-full wave-bar" style={{ height: '65%' }}></div>
                      <div className="w-1 bg-red-600 rounded-full wave-bar" style={{ height: '100%' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status Display */}
            <div className="text-center">
              <div className={`inline-block px-6 py-3 rounded-full text-white font-semibold ${
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : isProcessing
                  ? 'bg-yellow-500'
                  : isSpeaking
                  ? 'bg-green-500'
                  : 'bg-purple-500'
              }`}>
                {currentStatus}
              </div>
            </div>

            {/* Voice Input Display */}
            {lastQuestion && (
              <div className="w-full max-w-md bg-gray-100 p-4 rounded-2xl shadow-inner">
                <div className="flex items-center space-x-3">
                  <Mic className="w-6 h-6 text-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">You said:</p>
                    <p className="text-gray-800 font-semibold">{lastQuestion}</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Response Display */}
            {/* {lastAnswer && (
              <div className="w-full max-w-md bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-2xl shadow-inner border border-purple-200">
                <div className="flex items-start space-x-3">
                  <Bot className="w-6 h-6 text-purple-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">AI Response:</p>
                    <p className="text-gray-800">{lastAnswer}</p>
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={speakLastAnswer}
                        disabled={isSpeaking}
                        className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                        title="Speak AI Response"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span className="text-sm">Speak</span>
                      </button>
                      {isSpeaking && (
                        <button
                          onClick={stopSpeaking}
                          className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          title="Stop Speaking"
                        >
                          <VolumeX className="w-4 h-4" />
                          <span className="text-sm">Stop</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {/* Voice Controls */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={(e) => setAutoSpeak(e.target.checked)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">Auto-speak responses</span>
              </label>
              
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  voiceEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
                title={voiceEnabled ? 'Voice Enabled' : 'Voice Disabled'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Language Toggle Button */}
              <button
                onClick={toggleLanguage}
                className={`p-2 rounded-lg transition-colors ${
                  speechLanguage === 'hi-IN' 
                    ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                    : 'bg-blue-100 text-blue-700 border border-blue-300'
                }`}
                title={speechLanguage === 'hi-IN' ? 'Switch to English' : 'Switch to Hindi'}
              >
                <span className="text-sm font-medium">
                  {speechLanguage === 'hi-IN' ? 'हिंदी' : 'EN'}
                </span>
              </button>
            </div>

            {/* Language Status */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Current Language: {speechLanguage === 'hi-IN' ? 'Hindi (हिंदी)' : 'English'}
              </p>
            </div>
          </div>

          {/* Features Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <div className="flex items-center space-x-3 mb-4">
                <Mic className="w-8 h-8 text-purple-500" />
                <h3 className="text-lg font-bold text-gray-800">Voice Queries</h3>
              </div>
              <p className="text-gray-600">Ask questions about government jobs, exams, and recruitment in your own voice.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <div className="flex items-center space-x-3 mb-4">
                <Volume2 className="w-8 h-8 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-800">Voice Responses</h3>
              </div>
              <p className="text-gray-600">Get spoken answers about exam dates, application processes, and job updates.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <div className="flex items-center space-x-3 mb-4">
                <Bot className="w-8 h-8 text-green-500" />
                <h3 className="text-lg font-bold text-gray-800">Government Job Expert</h3>
              </div>
              <p className="text-gray-600">Specialized in government jobs, exams, recruitment, and career guidance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVoice; 