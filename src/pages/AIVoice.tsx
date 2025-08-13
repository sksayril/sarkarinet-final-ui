import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Bot, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
  const [hasWelcomed, setHasWelcomed] = useState<boolean>(false);
  const [currentAnimation, setCurrentAnimation] = useState<string>('welcome');

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

  // Welcome message on first visit
  useEffect(() => {
    if (!hasWelcomed && voiceEnabled && autoSpeak && !isSpeaking && !isListening && !isProcessing) {
      const welcomeMessage = speechLanguage === 'hi-IN' 
        ? 'नमस्ते! मैं सरकारी रिजल्ट AI असिस्टेंट हूं। मैं आपकी सरकारी नौकरियों और परीक्षाओं के बारे में मदद कर सकता हूं। कृपया अपना सवाल पूछें।'
        : 'Hello! I am the Sarkari Result AI Assistant. I can help you with government jobs and exams. Please ask your question.';
      
      const welcomeTimeout = setTimeout(() => {
        if (!hasWelcomed && !isSpeaking && !isListening && !isProcessing) {
          setHasWelcomed(true); // Set this first to prevent duplicate
          speakText(welcomeMessage);
        }
      }, 1000); // Wait 1 second before speaking
      
      return () => clearTimeout(welcomeTimeout); // Cleanup timeout
    }
  }, [hasWelcomed, voiceEnabled, autoSpeak, speechLanguage, isSpeaking, isListening, isProcessing]);

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
    setHasWelcomed(false); // Reset welcome state
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
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

  // Update animation state based on current status
  useEffect(() => {
    if (isListening) {
      setCurrentAnimation('listening');
    } else if (isSpeaking) {
      setCurrentAnimation('speaking');
    } else if (isProcessing) {
      setCurrentAnimation('processing');
    } else if (!hasWelcomed && !isListening && !isSpeaking && !isProcessing) {
      setCurrentAnimation('welcome');
    } else {
      setCurrentAnimation('idle');
    }
  }, [isListening, isSpeaking, hasWelcomed, isProcessing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-6 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:text-green-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
            <span className="font-semibold text-lg">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Sarkari Result AI Assistant</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-4 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                voiceEnabled 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
              }`}
              title={voiceEnabled ? 'Voice Enabled' : 'Voice Disabled'}
            >
              <div className="flex items-center space-x-2">
                {voiceEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                <span className="font-semibold text-sm">{voiceEnabled ? 'ON' : 'OFF'}</span>
              </div>
            </button>
            <button
              onClick={resetVoice}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              title="Clear Chat"
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-6 h-6" />
                <span className="font-semibold text-sm">Reset</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-2xl border border-green-100 overflow-hidden">
          {/* Voice Interaction Area */}
          <div className="h-full flex flex-col items-center justify-center p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sarkari Result AI Assistant</h2>
              <p className="text-gray-600">Ask me about government jobs, exams, recruitment, and more!</p>
              {!hasWelcomed && (
                <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border border-green-200">
                  <p className="text-sm text-green-700 font-medium">
                    🎤 AI will speak a welcome message automatically...
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Animated Voice Status with Lottie */}
            <div className="relative">
              {/* Lottie Animation Container */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Single Lottie Animation - Only one shows at a time */}
                <div className="absolute inset-0">
                  {currentAnimation === 'welcome' && !hasWelcomed && (
                    <DotLottieReact
                      src="/Voice Search.json"
                      loop
                      autoplay
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                  
                  {currentAnimation === 'listening' && isListening && (
                    <DotLottieReact
                      src="/Voice.json"
                      loop
                      autoplay
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                  
                  {currentAnimation === 'speaking' && isSpeaking && (
                    <DotLottieReact
                      src="/Voice.json"
                      loop
                      autoplay
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                  
                  {currentAnimation === 'processing' && isProcessing && (
                    <DotLottieReact
                      src="/Voice.json"
                      loop
                      autoplay
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                  
                  {currentAnimation === 'idle' && !isListening && !isSpeaking && !isProcessing && (
                    <DotLottieReact
                      src="/Voice Search.json"
                      loop
                      autoplay
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                </div>
                
                {/* Main Voice Button */}
                <button
                  onClick={toggleListening}
                  disabled={isProcessing}
                  className={`relative p-10 rounded-full transition-all duration-500 ${
                    isProcessing
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white scale-105 shadow-xl'
                      : continuousMode
                      ? 'bg-transparent hover:bg-white/10 transition-colors'
                      : 'bg-transparent hover:bg-white/10 transition-colors'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isListening ? 'Stop Listening' : 'Start Voice Input'}
                >
                  {isProcessing ? (
                    <div className="w-14 h-14 flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Continuous mode indicator removed */}
                    </div>
                  )}
                </button>
              </div>

              {/* Enhanced Wave Animation for Speaking */}
              {isSpeaking && (
                <div className="absolute -top-24 -left-24 w-48 h-48 flex items-center justify-center">
                  <div className="relative">
                    {/* Continuous Mode Indicator for Speaking - Removed */}
                    {/* Main wave layer */}
                    <div className="absolute inset-0 flex items-end space-x-1.5 h-24">
                      <div className="w-2 bg-green-200 rounded-full wave-bar-micro" style={{ height: '30%' }}></div>
                      <div className="w-2 bg-green-300 rounded-full wave-bar-slow" style={{ height: '50%' }}></div>
                      <div className="w-2 bg-green-400 rounded-full wave-bar" style={{ height: '70%' }}></div>
                      <div className="w-2 bg-green-500 rounded-full wave-bar-fast" style={{ height: '90%' }}></div>
                      <div className="w-2 bg-green-600 rounded-full wave-bar" style={{ height: '100%' }}></div>
                      <div className="w-2 bg-green-500 rounded-full wave-bar-slow" style={{ height: '80%' }}></div>
                      <div className="w-2 bg-green-400 rounded-full wave-bar-fast" style={{ height: '60%' }}></div>
                      <div className="w-2 bg-green-500 rounded-full wave-bar" style={{ height: '95%' }}></div>
                      <div className="w-2 bg-green-600 rounded-full wave-bar-slow" style={{ height: '75%' }}></div>
                      <div className="w-2 bg-green-400 rounded-full wave-bar-fast" style={{ height: '85%' }}></div>
                      <div className="w-2 bg-green-500 rounded-full wave-bar" style={{ height: '65%' }}></div>
                      <div className="w-2 bg-green-300 rounded-full wave-bar-micro" style={{ height: '45%' }}></div>
                    </div>
                    
                    {/* Background wave layer */}
                    <div className="absolute inset-0 flex items-end space-x-1.5 h-24" style={{ transform: 'translateY(-3px)' }}>
                      <div className="w-1 bg-green-100 rounded-full wave-bar-slow" style={{ height: '25%' }}></div>
                      <div className="w-1 bg-green-200 rounded-full wave-bar-micro" style={{ height: '40%' }}></div>
                      <div className="w-1 bg-green-300 rounded-full wave-bar" style={{ height: '60%' }}></div>
                      <div className="w-1 bg-green-400 rounded-full wave-bar-fast" style={{ height: '80%' }}></div>
                      <div className="w-1 bg-green-500 rounded-full wave-bar-slow" style={{ height: '90%' }}></div>
                      <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '70%' }}></div>
                      <div className="w-1 bg-green-300 rounded-full wave-bar-micro" style={{ height: '50%' }}></div>
                      <div className="w-1 bg-green-400 rounded-full wave-bar-fast" style={{ height: '85%' }}></div>
                      <div className="w-1 bg-green-500 rounded-full wave-bar" style={{ height: '65%' }}></div>
                      <div className="w-1 bg-green-300 rounded-full wave-bar-slow" style={{ height: '75%' }}></div>
                      <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '55%' }}></div>
                      <div className="w-1 bg-green-200 rounded-full wave-bar-micro" style={{ height: '35%' }}></div>
                    </div>

                    {/* Floating wave particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute w-1 h-1 bg-green-400 rounded-full wave-flow" style={{ top: '10%', left: '20%' }}></div>
                      <div className="absolute w-1 h-1 bg-green-500 rounded-full wave-flow" style={{ top: '20%', right: '15%', animationDelay: '0.5s' }}></div>
                      <div className="absolute w-1 h-1 bg-green-300 rounded-full wave-flow" style={{ bottom: '15%', left: '10%', animationDelay: '1s' }}></div>
                      <div className="absolute w-1 h-1 bg-green-400 rounded-full wave-flow" style={{ bottom: '25%', right: '20%', animationDelay: '1.5s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Wave Animation for Listening */}
              {isListening && (
                <div className="absolute -top-24 -left-24 w-48 h-48 flex items-center justify-center">
                  <div className="relative">
                    {/* Continuous Mode Indicator for Listening - Removed */}
                    {/* Main wave layer */}
                    <div className="absolute inset-0 flex items-end space-x-1.5 h-24">
                      <div className="w-2 bg-gradient-to-t from-orange-200 to-red-200 rounded-full wave-bar-micro" style={{ height: '40%' }}></div>
                      <div className="w-2 bg-gradient-to-t from-red-300 to-pink-300 rounded-full wave-bar-slow" style={{ height: '60%' }}></div>
                      <div className="w-2 bg-gradient-to-t from-pink-400 to-red-400 rounded-full wave-bar" style={{ height: '80%' }}></div>
                      <div className="w-2 bg-gradient-to-t from-red-500 to-orange-500 rounded-full wave-bar-fast" style={{ height: '100%' }}></div>
                      <div className="w-2 bg-gradient-to-t from-orange-600 to-red-600 rounded-full wave-bar" style={{ height: '90%' }}></div>
                      <div className="w-2 bg-gradient-to-t from-red-500 to-pink-500 rounded-full wave-bar-slow" style={{ height: '70%' }}></div>
                      <div className="w-2 bg-gradient-to-t from-pink-400 to-red-400 rounded-full wave-bar-fast" style={{ height: '85%' }}></div>
                      <div className="w-2 bg-gradient-to-t from-red-500 to-orange-500 rounded-full wave-bar" style={{ height: '95%' }}></div>
                      <div className="w-2 bg-gradient-to-t from-orange-600 to-red-600 rounded-full wave-bar-slow" style={{ height: '75%' }}></div>
                      <div className="w-2 bg-gradient-to-t from-red-400 to-pink-400 rounded-full wave-bar-fast" style={{ height: '80%' }}></div>
                      <div className="w-2 bg-gradient-to-t from-pink-500 to-red-500 rounded-full wave-bar" style={{ height: '65%' }}></div>
                      <div className="w-2 bg-gradient-to-t from-red-300 to-orange-300 rounded-full wave-bar-micro" style={{ height: '55%' }}></div>
                    </div>
                    
                    {/* Background wave layer */}
                    <div className="absolute inset-0 flex items-end space-x-1.5 h-24" style={{ transform: 'translateY(-3px)' }}>
                      <div className="w-1 bg-gradient-to-t from-orange-100 to-red-100 rounded-full wave-bar-slow" style={{ height: '35%' }}></div>
                      <div className="w-1 bg-gradient-to-t from-red-200 to-pink-200 rounded-full wave-bar-micro" style={{ height: '50%' }}></div>
                      <div className="w-1 bg-gradient-to-t from-pink-300 to-red-300 rounded-full wave-bar" style={{ height: '70%' }}></div>
                      <div className="w-1 bg-gradient-to-t from-red-400 to-orange-400 rounded-full wave-bar-fast" style={{ height: '90%' }}></div>
                      <div className="w-1 bg-gradient-to-t from-orange-500 to-red-500 rounded-full wave-bar-slow" style={{ height: '100%' }}></div>
                      <div className="w-1 bg-gradient-to-t from-red-400 to-pink-400 rounded-full wave-bar" style={{ height: '80%' }}></div>
                      <div className="w-1 bg-gradient-to-t from-pink-300 to-red-300 rounded-full wave-bar-micro" style={{ height: '60%' }}></div>
                      <div className="w-1 bg-gradient-to-t from-red-400 to-orange-400 rounded-full wave-bar-fast" style={{ height: '85%' }}></div>
                      <div className="w-1 bg-gradient-to-t from-orange-500 to-red-500 rounded-full wave-bar" style={{ height: '75%' }}></div>
                      <div className="w-1 bg-gradient-to-t from-red-300 to-pink-300 rounded-full wave-bar-slow" style={{ height: '90%' }}></div>
                      <div className="w-1 bg-gradient-to-t from-pink-400 to-red-400 rounded-full wave-bar" style={{ height: '65%' }}></div>
                      <div className="w-1 bg-gradient-to-t from-red-200 to-orange-200 rounded-full wave-bar-micro" style={{ height: '45%' }}></div>
                    </div>

                    {/* Floating wave particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute w-1 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full wave-flow" style={{ top: '15%', left: '25%' }}></div>
                      <div className="absolute w-1 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full wave-flow" style={{ top: '25%', right: '20%', animationDelay: '0.5s' }}></div>
                      <div className="absolute w-1 h-1 bg-gradient-to-r from-pink-300 to-red-300 rounded-full wave-flow" style={{ bottom: '20%', left: '15%', animationDelay: '1s' }}></div>
                      <div className="absolute w-1 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-full wave-flow" style={{ bottom: '30%', right: '25%', animationDelay: '1.5s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Circular Ripple Effects */}
              {(isListening || isSpeaking) && (
                <div className="absolute inset-0 rounded-full">
                  <div className={`absolute inset-0 rounded-full border-2 ${
                    isListening ? 'border-gradient-to-r from-orange-400 to-red-400' : 'border-green-400'
                  } animate-ping opacity-30`}></div>
                  <div className={`absolute inset-2 rounded-full border-2 ${
                    isListening ? 'border-gradient-to-r from-red-300 to-pink-300' : 'border-green-300'
                  } animate-ping opacity-20`} style={{ animationDelay: '0.5s' }}></div>
                  <div className={`absolute inset-4 rounded-full border-2 ${
                    isListening ? 'border-gradient-to-r from-pink-200 to-orange-200' : 'border-green-200'
                  } animate-ping opacity-10`} style={{ animationDelay: '1s' }}></div>
                </div>
              )}

              {/* Floating Particles */}
              {(isListening || isSpeaking) && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Particle 1 */}
                  <div className={`absolute w-2 h-2 rounded-full ${
                    isListening ? 'bg-gradient-to-r from-orange-400 to-red-400' : 'bg-green-400'
                  } animate-bounce`} style={{ 
                    top: '10%', 
                    left: '20%', 
                    animationDelay: '0s',
                    animationDuration: '2s'
                  }}></div>
                  
                  {/* Particle 2 */}
                  <div className={`absolute w-1.5 h-1.5 rounded-full ${
                    isListening ? 'bg-gradient-to-r from-red-300 to-pink-300' : 'bg-green-300'
                  } animate-bounce`} style={{ 
                    top: '30%', 
                    right: '15%', 
                    animationDelay: '0.5s',
                    animationDuration: '2.5s'
                  }}></div>
                  
                  {/* Particle 3 */}
                  <div className={`absolute w-1 h-1 rounded-full ${
                    isListening ? 'bg-gradient-to-r from-pink-500 to-red-500' : 'bg-green-500'
                  } animate-bounce`} style={{ 
                    bottom: '20%', 
                    left: '10%', 
                    animationDelay: '1s',
                    animationDuration: '1.8s'
                  }}></div>
                  
                  {/* Particle 4 */}
                  <div className={`absolute w-1.5 h-1.5 rounded-full ${
                    isListening ? 'bg-gradient-to-r from-red-400 to-orange-400' : 'bg-green-400'
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
                    isListening ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-green-500'
                  } opacity-60 animate-pulse`} style={{ 
                    top: '5%', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    animationDuration: '1.5s'
                  }}></div>
                  
                  <div className={`absolute w-3 h-3 rounded-full ${
                    isListening ? 'bg-gradient-to-r from-red-400 to-pink-400' : 'bg-green-400'
                  } opacity-40 animate-pulse`} style={{ 
                    bottom: '5%', 
                    left: '30%',
                    animationDuration: '2s',
                    animationDelay: '0.5s'
                  }}></div>
                  
                  <div className={`absolute w-3 h-3 rounded-full ${
                    isListening ? 'bg-gradient-to-r from-pink-400 to-red-400' : 'bg-green-400'
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
                  ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 animate-pulse' 
                  : isProcessing
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                  : isSpeaking
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-green-500 to-blue-600'
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
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🎤</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">You said:</p>
                    <p className="text-gray-800 font-semibold">{lastQuestion}</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Response Display */}
            {/* {lastAnswer && (
                                <div className="w-full max-w-md bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-2xl shadow-inner border border-green-200">
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
            <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 shadow-lg">
              <label className="flex items-center space-x-3 cursor-pointer bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={(e) => setAutoSpeak(e.target.checked)}
                  className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-base font-medium text-gray-700">Auto-speak responses</span>
              </label>
              
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`px-6 py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  voiceEnabled 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                }`}
                title={voiceEnabled ? 'Voice Enabled' : 'Voice Disabled'}
              >
                <div className="flex items-center space-x-2">
                  {voiceEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                  <span className="font-semibold">{voiceEnabled ? 'Voice ON' : 'Voice OFF'}</span>
                </div>
              </button>

              {/* Hindi Language Button */}
              <button
                onClick={() => {
                  setSpeechLanguage('hi-IN');
                  setRecognitionLanguage('hi-IN');
                }}
                className={`px-6 py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  speechLanguage === 'hi-IN' 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600'
                }`}
                title="Switch to Hindi"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">🇮🇳</span>
                  <span className="text-lg font-bold">हिंदी</span>
                </div>
              </button>

              {/* English Language Button */}
              <button
                onClick={() => {
                  setSpeechLanguage('en-US');
                  setRecognitionLanguage('en-US');
                }}
                className={`px-6 py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  speechLanguage === 'en-US' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600'
                }`}
                title="Switch to English"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">🇺🇸</span>
                  <span className="text-lg font-bold">English</span>
                </div>
              </button>

              {/* Auto-Listen After Speak Toggle */}
              <label className="flex items-center space-x-3 cursor-pointer bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                <input
                  type="checkbox"
                  checked={autoListenAfterSpeak}
                  onChange={(e) => setAutoListenAfterSpeak(e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-base font-medium text-gray-700">Auto-listen after speak</span>
              </label>

              {/* Continuous Mode Toggle */}
              <button
                onClick={toggleContinuousMode}
                className={`px-6 py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  continuousMode 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                }`}
                title={continuousMode ? 'Disable Continuous Mode' : 'Enable Continuous Mode'}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">
                    {continuousMode ? '🔄' : '⏹️'}
                  </span>
                  <span className="text-lg font-bold">
                    {continuousMode ? 'Continuous' : 'Single'}
                  </span>
                </div>
              </button>

              {/* Welcome Message Button */}
              <button
                onClick={() => {
                  if (!isSpeaking && !isListening && !isProcessing && !hasWelcomed) {
                    const welcomeMessage = speechLanguage === 'hi-IN' 
                      ? 'नमस्ते! मैं सरकारी रिजल्ट AI असिस्टेंट हूं। मैं आपकी सरकारी नौकरियों और परीक्षाओं के बारे में मदद कर सकता हूं। कृपया अपना सवाल पूछें।'
                      : 'Hello! I am the Sarkari Result AI Assistant. I can help you with government jobs and exams. Please ask your question.';
                    setHasWelcomed(true); // Set this first to prevent duplicate
                    speakText(welcomeMessage);
                  }
                }}
                disabled={isSpeaking || isListening || isProcessing || hasWelcomed}
                className="px-6 py-4 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:scale-105"
                title="Play Welcome Message"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🎤</span>
                  <span className="text-lg font-bold">Welcome</span>
                </div>
              </button>
            </div>

            {/* Status Information */}
            {/* <div className="text-center space-y-2">
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
            </div> */}
          </div>

          {/* Features Info */}
          <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200">
            {/* Main Introduction */}
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Sarkari Result AI Assistant – Your Smart Education Partner</h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                In today's fast-paced world, students don't have time to search through dozens of websites to find accurate and timely information about their exams. Whether it's checking Sarkari Result, downloading admit cards, knowing exam dates, or understanding the syllabus of competitive exams, students want instant answers.
              </p>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mt-4">
                To meet this need, we have built something truly innovative – <strong>Sarkari Result AI Assistant</strong>. This is not just a chatbot. It's an intelligent voice-enabled AI assistant that listens to your queries, understands them, and responds instantly – either by text or voice.
              </p>
            </div>

            {/* What is AI Assistant */}
            <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">What is Sarkari Result AI Assistant?</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                The Sarkari Result AI Assistant is an advanced AI-powered virtual education assistant designed to help students get all government exam-related updates instantly. It combines the latest artificial intelligence technology with real-time data so that students never miss important updates.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">🎤</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Voice Recognition</h4>
                    <p className="text-sm text-gray-600">Students can ask questions by speaking.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">🔊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Voice Output</h4>
                    <p className="text-sm text-gray-600">The assistant responds with voice, making it easy to understand.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">⏰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">24/7 Availability</h4>
                    <p className="text-sm text-gray-600">Get answers anytime, anywhere.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">🔄</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Real-Time Updates</h4>
                    <p className="text-sm text-gray-600">Always fetches the latest Sarkari Result and related news.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">👥</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">User-Friendly</h4>
                    <p className="text-sm text-gray-600">No complicated steps; just ask your question.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Key Features of Sarkari Result AI Assistant</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Voice Interaction</h4>
                      <p className="text-sm text-gray-600">No need to type long queries. Just say "When is the SSC CGL result coming?" and get an immediate voice reply.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Instant Sarkari Result Updates</h4>
                      <p className="text-sm text-gray-600">It directly connects to our updated database to fetch the latest exam results.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Exam Date Alerts</h4>
                      <p className="text-sm text-gray-600">Never miss an important date – whether it's an application deadline, admit card release, or exam day.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Syllabus & Preparation Tips</h4>
                      <p className="text-sm text-gray-600">Ask: "What is the syllabus for UPSC Prelims?" and get a complete answer.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">5</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Admit Card Download Guidance</h4>
                      <p className="text-sm text-gray-600">The assistant can guide you on how to download your admit card step-by-step.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">6</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">24/7 Availability</h4>
                      <p className="text-sm text-gray-600">No waiting for office hours – you can get help anytime, day or night.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">How Sarkari Result AI Assistant Works</h3>
              <p className="text-gray-600 text-center mb-8">The process is simple and user-friendly:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-600">Open the Sarkari Result AI Assistant on our website.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-600">Click the microphone icon and speak your query.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-600">The AI processes your voice using Natural Language Processing (NLP).</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <p className="text-sm text-gray-600">It searches verified sources for the correct information.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <p className="text-sm text-gray-600">You receive both text and voice answers instantly.</p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Benefits of Using Sarkari Result AI Assistant</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">⏱️</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Saves Time</h4>
                  <p className="text-sm text-gray-600">No more searching multiple sites.</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">✅</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Accuracy Guaranteed</h4>
                  <p className="text-sm text-gray-600">Only verified results and dates.</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">👥</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Easy to Use</h4>
                  <p className="text-sm text-gray-600">Perfect for all age groups.</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">🎤</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Voice Enabled</h4>
                  <p className="text-sm text-gray-600">Helpful for those who struggle with typing.</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">🔄</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Keeps You Updated</h4>
                  <p className="text-sm text-gray-600">Always in sync with the latest announcements.</p>
                </div>
              </div>
            </div>

            {/* Who Can Use */}
            <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Who Can Use Sarkari Result AI Assistant?</h3>
              <p className="text-gray-600 text-center mb-8">The assistant is designed for:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🎓</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">School Students</h4>
                  <p className="text-sm text-gray-600">For board exam results and scholarship updates.</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🏫</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">College Students</h4>
                  <p className="text-sm text-gray-600">For university results, entrance exam dates, and admissions.</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📚</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Competitive Exam Aspirants</h4>
                  <p className="text-sm text-gray-600">SSC, UPSC, Railway, Bank, Defence, Teaching, etc.</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">👨‍👩‍👧‍👦</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Parents</h4>
                  <p className="text-sm text-gray-600">To check updates for their children.</p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions (FAQs)</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="font-semibold text-gray-800 mb-2">What is the Sarkari Result AI Assistant?</h4>
                  <p className="text-gray-600">It's an AI-powered voice-enabled assistant that provides instant Sarkari Result updates and answers to education-related queries.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="font-semibold text-gray-800 mb-2">How is it different from other Sarkari Result websites?</h4>
                  <p className="text-gray-600">Unlike static sites, it offers interactive voice and text responses with real-time updates.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Can I ask questions in Hindi?</h4>
                  <p className="text-gray-600">Yes, it supports both English and Hindi queries.</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Do I need to install an app?</h4>
                  <p className="text-gray-600">No, you can access it directly from our website, but a mobile app is coming soon.</p>
                </div>
                <div className="border-l-4 border-red-500 pl-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Is the information 100% accurate?</h4>
                  <p className="text-gray-600">Yes, the assistant uses only verified and trusted sources.</p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Is it free to use?</h4>
                  <p className="text-gray-600">Yes, the basic version is free for all users.</p>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Conclusion</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                The Sarkari Result AI Assistant is more than just a tool – it's a reliable study companion for every student preparing for government exams. With features like voice-based queries, instant updates, and 24/7 availability, it ensures you never miss any important information.
              </p>
              <p className="text-gray-600 text-center leading-relaxed mt-4">
                Whether you're a school student, college aspirant, or competitive exam candidate, this AI assistant will save you time, provide accurate details, and make your preparation journey smoother.
              </p>
              <p className="text-gray-600 text-center leading-relaxed mt-4 font-semibold">
                Next time you need a Sarkari Result or any education-related update, don't waste hours searching – just ask the Sarkari Result AI Assistant, and let it do the work for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {/* Feature Card 1 */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🎤</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Voice Recognition</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Advanced speech recognition technology that understands both English and Hindi. 
                  Simply speak your questions about government jobs, exams, and recruitment processes.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">AI Assistant</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Powered by advanced AI technology to provide accurate information about government 
                  jobs, exam dates, application processes, and career guidance.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Voice Response</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Get spoken responses in your preferred language. The AI speaks clearly and 
                  naturally, making it easy to understand complex information.
                </p>
              </div>

              {/* Feature Card 4 */}
              {/* <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">∞</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Continuous Mode</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Enable continuous conversation mode for uninterrupted interaction. 
                  Perfect for extended discussions about career planning and exam preparation.
                </p>
              </div> */}

              {/* Feature Card 5 */}
              {/* <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">हिं</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Bilingual Support</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Full support for both English and Hindi languages. Switch between languages 
                  seamlessly for comfortable communication in your preferred language.
                </p>
              </div> */}

              {/* Feature Card 6 */}
              {/* <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">⚡</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Real-time Updates</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Get instant updates on latest government job notifications, exam dates, 
                  and recruitment processes. Stay informed with real-time information.
                </p>
              </div> */}
            </div>

            {/* Additional Info Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border border-green-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">How to Use AI Voice Assistant</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                    <p className="text-gray-700 text-sm">Click the microphone button to start voice recognition</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                    <p className="text-gray-700 text-sm">Speak your question clearly about government jobs or exams</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                    <p className="text-gray-700 text-sm">Wait for AI to process and respond with voice and text</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                    <p className="text-gray-700 text-sm">Enable continuous mode for ongoing conversation</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">5</div>
                    <p className="text-gray-700 text-sm">Switch between English and Hindi as needed</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">6</div>
                    <p className="text-gray-700 text-sm">Use auto-listen feature for hands-free interaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVoice; 