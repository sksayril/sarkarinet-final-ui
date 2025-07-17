import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';

// Type declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('initializing');
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [lastResponse, setLastResponse] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isProcessingRef = useRef(false);
  const hasSpokenWelcomeRef = useRef(false);

  // System prompt for Gemini
  const systemPrompt = `You are Sarkari Result AI Assistant, a helpful voice AI designed to assist users with government job-related queries. You should:

1. Provide accurate information about government jobs, exams, and recruitment
2. Help with exam preparation tips and strategies
3. Guide users about application processes and deadlines
4. Share information about various government departments and positions
5. Be friendly, professional, and encouraging
6. Respond in a mix of Hindi and English (Hinglish) when appropriate
7. Keep responses concise but informative (2-3 sentences max for voice)
8. Always verify information accuracy and suggest checking official websites

Remember: You are here to help users navigate the complex world of government jobs and exams. Keep responses conversational and brief since this is voice interaction.`;

  // Load and setup voices with better female voice detection
  const loadVoices = () => {
    const voices = speechSynthesis.getVoices();
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang}) - ${v.default ? 'default' : ''}`));
    setAvailableVoices(voices);
    
    // Find the best female voice
    const bestFemaleVoice = findBestFemaleVoice(voices);
    setSelectedVoice(bestFemaleVoice);
    
    if (bestFemaleVoice) {
      console.log('Selected female voice:', bestFemaleVoice.name, bestFemaleVoice.lang);
    } else {
      console.log('No female voice found, using default');
    }
  };

  const findBestFemaleVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (voices.length === 0) return null;

    // Priority order for female voice selection
    const femaleVoicePreferences = [
      // Hindi female voices (highest priority)
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('hi') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('woman') ||
         voice.name.toLowerCase().includes('girl') ||
         voice.name.toLowerCase().includes('sita') ||
         voice.name.toLowerCase().includes('priya') ||
         voice.name.toLowerCase().includes('neha')),
      
      // English female voices for Hindi text
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('woman') ||
         voice.name.toLowerCase().includes('girl') ||
         voice.name.toLowerCase().includes('samantha') ||
         voice.name.toLowerCase().includes('victoria') ||
         voice.name.toLowerCase().includes('alexandra') ||
         voice.name.toLowerCase().includes('zira')),
      
      // Any Hindi voice as fallback
      (voice: SpeechSynthesisVoice) => voice.lang.includes('hi'),
      
      // Any English voice as fallback
      (voice: SpeechSynthesisVoice) => voice.lang.includes('en'),
      
      // Default voice as last resort
      (voice: SpeechSynthesisVoice) => voice.default
    ];

    for (const preference of femaleVoicePreferences) {
      const voice = voices.find(preference);
      if (voice) {
        return voice;
      }
    }

    return voices[0];
  };

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log('Speech recognized:', transcript);
        if (transcript.trim() && !isProcessingRef.current) {
          setUserInput(transcript);
          setCurrentStatus('processing');
          handleVoiceInput(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          // Continue listening if no speech detected
          setTimeout(() => {
            if (isOpen && !isProcessingRef.current && !isSpeaking) {
              restartListening();
            }
          }, 1000);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        if (isOpen && !isProcessingRef.current && !isSpeaking) {
          // Auto-restart listening when it ends
          setTimeout(() => {
            restartListening();
          }, 500);
        }
      };
    } else {
      console.error('Speech recognition not supported');
    }

    // Load speech synthesis voices
    loadVoices();
    
    // Handle voice loading for different browsers
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Some browsers need a delay to load voices
    setTimeout(loadVoices, 100);
    setTimeout(loadVoices, 500);
    setTimeout(loadVoices, 1000);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-start voice assistant when modal opens (only once)
  useEffect(() => {
    if (isOpen && !hasWelcomed && !hasSpokenWelcomeRef.current && selectedVoice) {
      hasSpokenWelcomeRef.current = true;
      setCurrentStatus('welcoming');
      setTimeout(() => {
        const welcomeMessage = "नमस्ते! मैं Sarkari Result AI Assistant हूं। मैं आपकी सरकारी नौकरियों के बारे में कैसे मदद कर सकता हूं?";
        speakResponse(welcomeMessage, () => {
          setHasWelcomed(true);
          startContinuousListening();
        });
      }, 1000);
    }
  }, [isOpen, selectedVoice]);

  const handleVoiceInput = async (transcript: string) => {
    if (isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    setIsLoading(true);
    setCurrentStatus('thinking');

    try {
      const response = await callGeminiAPI(transcript);
      setCurrentStatus('speaking');
      
      // Extract the actual text content from the response
      const textToSpeak = extractTextFromResponse(response);
      setLastResponse(textToSpeak);
      console.log('AI Response:', textToSpeak);
      
      // Speak the response and then restart listening
      speakResponse(textToSpeak, () => {
        setCurrentStatus('listening');
        isProcessingRef.current = false;
        setIsLoading(false);
        // Auto-restart listening after speaking
        setTimeout(() => {
          if (isOpen && !isSpeaking) {
            restartListening();
          }
        }, 1000);
      });
    } catch (error) {
      console.error('Error calling AI:', error);
      const errorMessage = 'माफ करें, मुझे समस्या आ रही है। कृपया दोबारा कोशिश करें।';
      setLastResponse(errorMessage);
      speakResponse(errorMessage, () => {
        setCurrentStatus('listening');
        isProcessingRef.current = false;
        setIsLoading(false);
        setTimeout(() => {
          if (isOpen) {
            restartListening();
          }
        }, 1000);
      });
    }
  };

  const extractTextFromResponse = (response: any): string => {
    try {
      console.log('Raw API response:', response);
      
      // Handle different response formats
      if (typeof response === 'string') {
        return response;
      }
      
      if (response.candidates && response.candidates[0] && response.candidates[0].content) {
        const text = response.candidates[0].content.parts[0].text;
        console.log('Extracted text from candidates:', text);
        return text;
      }
      
      if (response.content && response.content.parts) {
        const text = response.content.parts[0].text;
        console.log('Extracted text from content:', text);
        return text;
      }
      
      if (response.text) {
        console.log('Extracted text from text field:', response.text);
        return response.text;
      }
      
      console.log('No text found in response, using fallback');
      return 'माफ करें, मुझे जवाब समझने में समस्या आ रही है।';
    } catch (error) {
      console.error('Error extracting text:', error);
      return 'माफ करें, मुझे जवाब समझने में समस्या आ रही है।';
    }
  };

  const callGeminiAPI = async (userInput: string): Promise<any> => {
    const apiKey = 'AIzaSyCxO6A-i4-P-BUmkA0KbqzqQOP7bxYQ0pE';
    
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

    const requestBody = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: userInput }
          ]
        }
      ]
    };

    console.log('Sending request to Gemini:', requestBody);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    return data;
  };

  const speakResponse = (text: string, onComplete?: () => void) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      if (onComplete) onComplete();
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();
    
    // Wait a bit for cancellation to complete
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set optimal speech parameters
      utterance.rate = 0.9;
      utterance.pitch = 1.1; // Slightly higher pitch for female-like voice
      utterance.volume = 1.0;
      
      // Set language based on content
      if (/[\u0900-\u097F]/.test(text)) {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-US';
      }
      
      // Use the selected female voice
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using selected voice:', selectedVoice.name, selectedVoice.lang);
      } else {
        console.log('No selected voice, using default');
      }
      
      utterance.onstart = () => {
        console.log('Speech started with text:', text);
        setIsSpeaking(true);
        // Stop listening while speaking
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
      
      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      };
      
      speechSynthesis.speak(utterance);
      speechRef.current = utterance;
    }, 100);
  };

  const startContinuousListening = () => {
    if (recognitionRef.current && !isSpeaking) {
      setIsListening(true);
      setCurrentStatus('listening');
      try {
        recognitionRef.current.start();
        console.log('Started listening');
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const restartListening = () => {
    if (recognitionRef.current && isOpen && !isSpeaking && !isProcessingRef.current) {
      setTimeout(() => {
        try {
          setIsListening(true);
          setCurrentStatus('listening');
          recognitionRef.current.start();
          console.log('Restarted listening');
        } catch (error) {
          console.error('Error restarting recognition:', error);
        }
      }, 500);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentStatus('listening');
      // Restart listening after stopping speech
      setTimeout(() => {
        if (isOpen) {
          restartListening();
        }
      }, 500);
    }
  };

  const handleClose = () => {
    stopListening();
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    isProcessingRef.current = false;
    setHasWelcomed(false);
    hasSpokenWelcomeRef.current = false;
    setCurrentStatus('initializing');
    setUserInput('');
    setLastResponse('');
    onClose();
  };

  if (!isOpen) return null;

  const getStatusMessage = () => {
    switch (currentStatus) {
      case 'initializing':
        return 'शुरू हो रहा है...';
      case 'welcoming':
        return 'स्वागत संदेश...';
      case 'listening':
        return 'सुन रहा हूं... बोलिए!';
      case 'processing':
        return 'समझ रहा हूं...';
      case 'thinking':
        return 'जवाब सोच रहा हूं...';
      case 'speaking':
        return 'जवाब दे रहा हूं...';
      default:
        return 'तैयार हूं...';
    }
  };

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'listening':
        return 'text-green-600';
      case 'processing':
      case 'thinking':
        return 'text-blue-600';
      case 'speaking':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">🎤</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Sarkari Result Voice AI</h2>
                <p className="text-purple-200 text-sm">Voice Assistant - बोलकर पूछें! (Female Voice)</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Voice Interface Area */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="text-center">
            {/* Main Voice Indicator */}
            <div className="relative mb-8">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                currentStatus === 'listening' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                currentStatus === 'thinking' || currentStatus === 'processing' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                currentStatus === 'speaking' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                'bg-gradient-to-r from-gray-400 to-gray-600'
              }`}>
                {currentStatus === 'listening' ? (
                  <Mic className="w-12 h-12 text-white" />
                ) : currentStatus === 'thinking' || currentStatus === 'processing' ? (
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                ) : currentStatus === 'speaking' ? (
                  <Volume2 className="w-12 h-12 text-white animate-pulse" />
                ) : (
                  <Mic className="w-12 h-12 text-white" />
                )}
              </div>
              
              {/* Animated Rings */}
              {(currentStatus === 'listening' || currentStatus === 'speaking') && (
                <>
                  <div className="absolute inset-0">
                    <div className={`w-32 h-32 border-4 rounded-full animate-ping opacity-75 ${
                      currentStatus === 'listening' ? 'border-green-400' : 'border-purple-400'
                    }`}></div>
                  </div>
                  <div className="absolute inset-0">
                    <div className={`w-32 h-32 border-4 rounded-full animate-ping opacity-50 ${
                      currentStatus === 'listening' ? 'border-green-300' : 'border-purple-300'
                    }`} style={{animationDelay: '0.5s'}}></div>
                  </div>
                  <div className="absolute inset-0">
                    <div className={`w-32 h-32 border-4 rounded-full animate-ping opacity-25 ${
                      currentStatus === 'listening' ? 'border-green-200' : 'border-purple-200'
                    }`} style={{animationDelay: '1s'}}></div>
                  </div>
                  <div className="absolute inset-0">
                    <div className={`w-32 h-32 border-4 rounded-full animate-ping opacity-10 ${
                      currentStatus === 'listening' ? 'border-green-100' : 'border-purple-100'
                    }`} style={{animationDelay: '1.5s'}}></div>
                  </div>
                </>
              )}
            </div>
            
            {/* Status Message */}
            <h3 className={`text-2xl font-bold mb-2 ${getStatusColor()}`}>
              {getStatusMessage()}
            </h3>
            
            {/* Last User Input */}
            {userInput && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">आपने कहा:</p>
                <p className="text-blue-800 font-medium">{userInput}</p>
              </div>
            )}

            {/* Last AI Response */}
            {lastResponse && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">AI का जवाब:</p>
                <p className="text-purple-800 font-medium">{lastResponse}</p>
              </div>
            )}
            
            {/* Instructions */}
            <div className="max-w-md mx-auto">
              {currentStatus === 'listening' && (
                <div className="space-y-2">
                  <p className="text-gray-700 text-lg">
                    🎤 <strong>आपकी बात सुन रहा हूं</strong>
                  </p>
                  <p className="text-gray-600 text-sm">
                    सरकारी नौकरी के बारे में कुछ भी पूछें
                  </p>
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              )}
              
              {currentStatus === 'thinking' && (
                <div className="space-y-2">
                  <p className="text-blue-700 text-lg">
                    🤔 <strong>आपके सवाल का जवाब सोच रहा हूं</strong>
                  </p>
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              )}
              
              {currentStatus === 'speaking' && (
                <div className="space-y-2">
                  <p className="text-purple-700 text-lg">
                    🗣️ <strong>जवाब दे रहा हूं</strong>
                  </p>
                  <p className="text-purple-600 text-sm">
                    ध्यान से सुनें... (Female Voice)
                  </p>
                </div>
              )}
              
              {currentStatus === 'welcoming' && (
                <div className="space-y-2">
                  <p className="text-gray-700 text-lg">
                    👋 <strong>नमस्ते! तैयार हो रहा हूं</strong>
                  </p>
                  <p className="text-gray-600 text-sm">
                    कृपया थोड़ा इंतज़ार करें...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Control Area */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-center space-x-4">
            {/* Stop Speaking Button */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <VolumeX className="w-5 h-5" />
                  <span>बंद करें</span>
                </div>
              </button>
            )}
            
            {/* Restart Listening Button */}
            {!isListening && !isSpeaking && (
              <button
                onClick={restartListening}
                className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <Mic className="w-5 h-5" />
                  <span>दोबारा सुनें</span>
                </div>
              </button>
            )}
            
            {/* Status Indicator */}
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                currentStatus === 'listening' ? 'bg-green-100 text-green-700' :
                currentStatus === 'thinking' ? 'bg-blue-100 text-blue-700' :
                currentStatus === 'speaking' ? 'bg-purple-100 text-purple-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  currentStatus === 'listening' ? 'bg-green-500 animate-pulse' :
                  currentStatus === 'thinking' ? 'bg-blue-500 animate-pulse' :
                  currentStatus === 'speaking' ? 'bg-purple-500 animate-pulse' :
                  'bg-gray-500'
                }`}></div>
                Voice AI Active (♀)
              </div>
            </div>
          </div>
          
          {/* Voice Info */}
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>🎙️ Voice: {selectedVoice ? selectedVoice.name : 'Loading...'} | 
            Language: Hindi/English | 
            Speech: {isSpeaking ? 'Active' : 'Ready'}</p>
          </div>
          
          {/* Tips */}
          <div className="mt-2 text-center text-sm text-gray-600">
            <p>💡 <strong>Tips:</strong> साफ़ आवाज़ में बोलें • सवाल पूरा होने पर रुकें • शांत माहौल में इस्तेमाल करें</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;