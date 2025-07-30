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
  const [continuousMode, setContinuousMode] = useState<boolean>(false);
  const [autoListenAfterSpeak, setAutoListenAfterSpeak] = useState<boolean>(true);

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
      
      // In continuous mode, auto-start listening after processing
      if (continuousMode && autoListenAfterSpeak && !isListening) {
        setTimeout(() => {
          if (recognition && !isProcessing) {
            try {
              recognition.start();
              setCurrentStatus('Continuous mode: Listening for next question...');
            } catch (error) {
              console.error('Error starting continuous recognition:', error);
            }
          }
        }, 2000); // Wait 2 seconds in continuous mode
      }
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
        
        // Auto-start listening after speaking if enabled
        if (autoListenAfterSpeak && !isProcessing) {
          setTimeout(() => {
            if (recognition && !isListening && !isProcessing) {
              try {
                recognition.start();
                setCurrentStatus('Auto-listening... Speak now!');
              } catch (error) {
                console.error('Error auto-starting recognition:', error);
              }
            }
          }, 1000); // Wait 1 second before auto-listening
        }
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
    setContinuousMode(false);
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

  const toggleContinuousMode = () => {
    setContinuousMode(!continuousMode);
    if (!continuousMode) {
      setCurrentStatus('Continuous mode enabled - Speak to start conversation');
    } else {
      setCurrentStatus('Continuous mode disabled');
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

            {/* Enhanced Animated Voice Status */}
            <div className="relative">
              {/* Main Voice Button with Enhanced Animation */}
              <button
                onClick={toggleListening}
                disabled={isProcessing}
                className={`relative p-10 rounded-full transition-all duration-500 ${
                  isListening 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white scale-110 shadow-2xl' 
                    : isProcessing
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white scale-105 shadow-xl'
                    : isSpeaking
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-105 shadow-xl'
                    : continuousMode
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isListening ? 'Stop Listening' : 'Start Voice Input'}
              >
                {isListening ? (
                  <MicOff className="w-14 h-14" />
                ) : isProcessing ? (
                  <div className="w-14 h-14 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : isSpeaking ? (
                  <Volume2 className="w-14 h-14" />
                ) : (
                  <div className="relative">
                    <Mic className="w-14 h-14" />
                    {continuousMode && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-xs text-yellow-900 font-bold">∞</span>
                      </div>
                    )}
                  </div>
                )}
               
                {/* Enhanced Pulsing Animation Rings */}
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></div>
                    <div className="absolute inset-2 rounded-full bg-red-300 animate-ping opacity-50" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute inset-4 rounded-full bg-red-200 animate-ping opacity-25" style={{ animationDelay: '0.4s' }}></div>
                    <div className="absolute inset-6 rounded-full bg-red-100 animate-ping opacity-15" style={{ animationDelay: '0.6s' }}></div>
                  </>
                )}
                
                {isProcessing && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-yellow-400 animate-pulse opacity-75"></div>
                    <div className="absolute inset-2 rounded-full bg-yellow-300 animate-pulse opacity-50" style={{ animationDelay: '0.3s' }}></div>
                    <div className="absolute inset-4 rounded-full bg-yellow-200 animate-pulse opacity-25" style={{ animationDelay: '0.6s' }}></div>
                  </>
                )}
                
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-75"></div>
                    <div className="absolute inset-2 rounded-full bg-green-300 animate-pulse opacity-50" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute inset-4 rounded-full bg-green-200 animate-pulse opacity-25" style={{ animationDelay: '0.4s' }}></div>
                  </>
                )}
              </button>

              {/* Enhanced Wave Animation for Speaking */}
              {isSpeaking && (
                <div className="absolute -top-24 -left-24 w-48 h-48 flex items-center justify-center">
                  <div className="relative">
                    {/* Multiple wave layers for 3D effect */}
                    <div className="absolute inset-0 flex items-end space-x-1 h-20">
                      <div className="w-1.5 bg-green-300 rounded-full wave-bar" style={{ height: '50%' }}></div>
                      <div className="w-1.5 bg-green-400 rounded-full wave-bar" style={{ height: '70%' }}></div>
                      <div className="w-1.5 bg-green-500 rounded-full wave-bar" style={{ height: '90%' }}></div>
                      <div className="w-1.5 bg-green-600 rounded-full wave-bar" style={{ height: '100%' }}></div>
                      <div className="w-1.5 bg-green-500 rounded-full wave-bar" style={{ height: '80%' }}></div>
                      <div className="w-1.5 bg-green-400 rounded-full wave-bar" style={{ height: '60%' }}></div>
                      <div className="w-1.5 bg-green-500 rounded-full wave-bar" style={{ height: '95%' }}></div>
                      <div className="w-1.5 bg-green-600 rounded-full wave-bar" style={{ height: '75%' }}></div>
                      <div className="w-1.5 bg-green-400 rounded-full wave-bar" style={{ height: '85%' }}></div>
                      <div className="w-1.5 bg-green-500 rounded-full wave-bar" style={{ height: '65%' }}></div>
                    </div>
                    
                    {/* Second layer for depth */}
                    <div className="absolute inset-0 flex items-end space-x-1 h-20" style={{ transform: 'translateY(-2px)' }}>
                      <div className="w-1 bg-green-200 rounded-full wave-bar" style={{ height: '40%' }}></div>
                      <div className="w-1 bg-green-300 rounded-full wave-bar" style={{ height: '60%' }}></div>
                      <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '80%' }}></div>
                      <div className="w-1 bg-green-500 rounded-full wave-bar" style={{ height: '90%' }}></div>
                      <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '70%' }}></div>
                      <div className="w-1 bg-green-300 rounded-full wave-bar" style={{ height: '50%' }}></div>
                      <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '85%' }}></div>
                      <div className="w-1 bg-green-500 rounded-full wave-bar" style={{ height: '65%' }}></div>
                      <div className="w-1 bg-green-300 rounded-full wave-bar" style={{ height: '75%' }}></div>
                      <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '55%' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Wave Animation for Listening */}
              {isListening && (
                <div className="absolute -top-24 -left-24 w-48 h-48 flex items-center justify-center">
                  <div className="relative">
                    {/* Multiple wave layers for 3D effect */}
                    <div className="absolute inset-0 flex items-end space-x-1 h-20">
                      <div className="w-1.5 bg-red-300 rounded-full wave-bar" style={{ height: '60%' }}></div>
                      <div className="w-1.5 bg-red-400 rounded-full wave-bar" style={{ height: '80%' }}></div>
                      <div className="w-1.5 bg-red-500 rounded-full wave-bar" style={{ height: '100%' }}></div>
                      <div className="w-1.5 bg-red-600 rounded-full wave-bar" style={{ height: '90%' }}></div>
                      <div className="w-1.5 bg-red-500 rounded-full wave-bar" style={{ height: '70%' }}></div>
                      <div className="w-1.5 bg-red-400 rounded-full wave-bar" style={{ height: '85%' }}></div>
                      <div className="w-1.5 bg-red-500 rounded-full wave-bar" style={{ height: '95%' }}></div>
                      <div className="w-1.5 bg-red-600 rounded-full wave-bar" style={{ height: '75%' }}></div>
                      <div className="w-1.5 bg-red-400 rounded-full wave-bar" style={{ height: '80%' }}></div>
                      <div className="w-1.5 bg-red-500 rounded-full wave-bar" style={{ height: '65%' }}></div>
                    </div>
                    
                    {/* Second layer for depth */}
                    <div className="absolute inset-0 flex items-end space-x-1 h-20" style={{ transform: 'translateY(-2px)' }}>
                      <div className="w-1 bg-red-200 rounded-full wave-bar" style={{ height: '50%' }}></div>
                      <div className="w-1 bg-red-300 rounded-full wave-bar" style={{ height: '70%' }}></div>
                      <div className="w-1 bg-red-400 rounded-full wave-bar" style={{ height: '90%' }}></div>
                      <div className="w-1 bg-red-500 rounded-full wave-bar" style={{ height: '100%' }}></div>
                      <div className="w-1 bg-red-400 rounded-full wave-bar" style={{ height: '80%' }}></div>
                      <div className="w-1 bg-red-300 rounded-full wave-bar" style={{ height: '60%' }}></div>
                      <div className="w-1 bg-red-400 rounded-full wave-bar" style={{ height: '85%' }}></div>
                      <div className="w-1 bg-red-500 rounded-full wave-bar" style={{ height: '75%' }}></div>
                      <div className="w-1 bg-red-300 rounded-full wave-bar" style={{ height: '90%' }}></div>
                      <div className="w-1 bg-red-400 rounded-full wave-bar" style={{ height: '55%' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Circular Ripple Effects */}
              {(isListening || isSpeaking) && (
                <div className="absolute inset-0 rounded-full">
                  <div className={`absolute inset-0 rounded-full border-2 ${
                    isListening ? 'border-red-400' : 'border-green-400'
                  } animate-ping opacity-30`}></div>
                  <div className={`absolute inset-2 rounded-full border-2 ${
                    isListening ? 'border-red-300' : 'border-green-300'
                  } animate-ping opacity-20`} style={{ animationDelay: '0.5s' }}></div>
                  <div className={`absolute inset-4 rounded-full border-2 ${
                    isListening ? 'border-red-200' : 'border-green-200'
                  } animate-ping opacity-10`} style={{ animationDelay: '1s' }}></div>
                </div>
              )}

              {/* Floating Particles */}
              {(isListening || isSpeaking) && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Particle 1 */}
                  <div className={`absolute w-2 h-2 rounded-full ${
                    isListening ? 'bg-red-400' : 'bg-green-400'
                  } animate-bounce`} style={{ 
                    top: '10%', 
                    left: '20%', 
                    animationDelay: '0s',
                    animationDuration: '2s'
                  }}></div>
                  
                  {/* Particle 2 */}
                  <div className={`absolute w-1.5 h-1.5 rounded-full ${
                    isListening ? 'bg-red-300' : 'bg-green-300'
                  } animate-bounce`} style={{ 
                    top: '30%', 
                    right: '15%', 
                    animationDelay: '0.5s',
                    animationDuration: '2.5s'
                  }}></div>
                  
                  {/* Particle 3 */}
                  <div className={`absolute w-1 h-1 rounded-full ${
                    isListening ? 'bg-red-500' : 'bg-green-500'
                  } animate-bounce`} style={{ 
                    bottom: '20%', 
                    left: '10%', 
                    animationDelay: '1s',
                    animationDuration: '1.8s'
                  }}></div>
                  
                  {/* Particle 4 */}
                  <div className={`absolute w-1.5 h-1.5 rounded-full ${
                    isListening ? 'bg-red-400' : 'bg-green-400'
                  } animate-bounce`} style={{ 
                    bottom: '10%', 
                    right: '25%', 
                    animationDelay: '1.5s',
                    animationDuration: '2.2s'
                  }}></div>
                </div>
              )}

              {/* Energy Orbs */}
              {(isListening || isSpeaking) && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute w-4 h-4 rounded-full ${
                    isListening ? 'bg-red-500' : 'bg-green-500'
                  } opacity-60 animate-pulse`} style={{ 
                    top: '5%', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    animationDuration: '1.5s'
                  }}></div>
                  
                  <div className={`absolute w-3 h-3 rounded-full ${
                    isListening ? 'bg-red-400' : 'bg-green-400'
                  } opacity-40 animate-pulse`} style={{ 
                    bottom: '5%', 
                    left: '30%',
                    animationDuration: '2s',
                    animationDelay: '0.5s'
                  }}></div>
                  
                  <div className={`absolute w-3 h-3 rounded-full ${
                    isListening ? 'bg-red-400' : 'bg-green-400'
                  } opacity-40 animate-pulse`} style={{ 
                    bottom: '5%', 
                    right: '30%',
                    animationDuration: '2s',
                    animationDelay: '1s'
                  }}></div>
                </div>
              )}
            </div>

            {/* Enhanced Status Display */}
            <div className="text-center">
              <div className={`inline-block px-8 py-4 rounded-full text-white font-semibold text-lg shadow-lg ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' 
                  : isProcessing
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                  : isSpeaking
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600'
              }`}>
                <div className="flex items-center space-x-2">
                  {isListening && (
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  )}
                  {isProcessing && (
                    <div className="w-2 h-2 bg-white rounded-full animate-spin"></div>
                  )}
                  {isSpeaking && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                  <span>{currentStatus}</span>
                  {isListening && (
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  )}
                  {isProcessing && (
                    <div className="w-2 h-2 bg-white rounded-full animate-spin" style={{ animationDelay: '0.3s' }}></div>
                  )}
                  {isSpeaking && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                  )}
                </div>
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

              {/* Auto-Listen After Speak Toggle */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoListenAfterSpeak}
                  onChange={(e) => setAutoListenAfterSpeak(e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">Auto-listen after speak</span>
              </label>

              {/* Continuous Mode Toggle */}
              <button
                onClick={toggleContinuousMode}
                className={`p-2 rounded-lg transition-colors ${
                  continuousMode 
                    ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}
                title={continuousMode ? 'Disable Continuous Mode' : 'Enable Continuous Mode'}
              >
                <span className="text-sm font-medium">
                  {continuousMode ? '🔄 Continuous' : '⏹️ Single'}
                </span>
              </button>
            </div>

            {/* Status Information */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">
                Current Language: {speechLanguage === 'hi-IN' ? 'Hindi (हिंदी)' : 'English'}
              </p>
              {continuousMode && (
                <p className="text-sm text-purple-600 font-medium">
                  🔄 Continuous Mode Active - AI will keep listening for questions
                </p>
              )}
              {autoListenAfterSpeak && (
                <p className="text-sm text-blue-600">
                  🔊 Auto-listen enabled - Will start listening after AI speaks
                </p>
              )}
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