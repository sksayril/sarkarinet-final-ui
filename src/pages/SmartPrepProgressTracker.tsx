import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Clock, BookOpen, Trophy, Target, TrendingUp, Award, Users, Settings, CheckCircle, XCircle, Star, Brain, Zap, Flame, Plus, Edit, Trash2, Save, FileText, HelpCircle, GraduationCap, Timer, CalendarDays, BookOpenCheck, BrainCircuit, Rocket, Crown, Shield, Heart, Sparkles, Lightbulb, BookMarked, Activity, PieChart, LineChart, TrendingDown, AlertCircle, Info, Coffee, Music, Volume2, VolumeX, Mic, MicOff, Video, VideoOff, Wifi, WifiOff, Battery, BatteryCharging, Lock, Unlock, Key, User, UserCheck, UserX, Users2, UserPlus, UserMinus, Home, Menu, Grid, List, Columns, Rows, Layout, Sidebar, SidebarClose, PanelLeft, PanelRight, PanelTop, PanelBottom, Split, FlipVertical, FlipHorizontal, Columns2, Columns3, Columns4, Rows2, Rows3, Rows4, SquareStack, Circle, Triangle, Square, Hexagon, Pentagon, Octagon, Diamond, Cross, Divide, Percent, Infinity, Pi, Sigma, Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  subject: string;
}

interface Topic {
  id: string;
  name: string;
  subject: string;
  completed: boolean;
  completedAt?: Date;
}

interface QuizResult {
  id: string;
  date: Date;
  category: string;
  score: number;
  totalQuestions: number;
  timeTaken: number; // in minutes
  accuracy: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface UserProgressData {
  id: string;
  date: Date;
  studyHours: number;
  topicsCovered: number;
  subjects: string[];
  mockTestsSolved: number;
  averageScore: number;
  learningTime: number; // in hours
  jobPreparation: string;
  notes?: string;
}

interface GeminiAnalysis {
  timeNeeded: number;
  recommendedTopics: string[];
  suggestions: string[];
  overallProgress: number;
  nextSteps: string[];
  weakAreas: string[];
  strengths: string[];
  studyPlan: string;
}

const SmartPrepProgressTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'quizzes' | 'badges' | 'leaderboard'>('tracker');
  const [isStudying, setIsStudying] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [userProgressData, setUserProgressData] = useState<UserProgressData[]>([]);
  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editingProgress, setEditingProgress] = useState<UserProgressData | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    studyHours: '',
    topicsCovered: '',
    subjects: [] as string[],
    mockTestsSolved: '',
    averageScore: '',
    learningTime: '',
    jobPreparation: '',
    notes: ''
  });

  const subjects = [
    { id: 'maths', name: 'Mathematics', hindiName: 'गणित', color: 'from-blue-500 to-blue-600' },
    { id: 'english', name: 'English', hindiName: 'अंग्रेजी', color: 'from-green-500 to-green-600' },
    { id: 'reasoning', name: 'Reasoning', hindiName: 'तर्कशक्ति', color: 'from-purple-500 to-purple-600' },
    { id: 'gk', name: 'General Knowledge', hindiName: 'सामान्य ज्ञान', color: 'from-orange-500 to-orange-600' },
    { id: 'computer', name: 'Computer', hindiName: 'कंप्यूटर', color: 'from-red-500 to-red-600' }
  ];

  const jobPreparations = [
    { id: 'ssc', name: 'SSC CGL/CHSL', hindiName: 'एसएससी सीजीएल/सीएचएसएल' },
    { id: 'upsc', name: 'UPSC Civil Services', hindiName: 'यूपीएससी सिविल सेवा' },
    { id: 'banking', name: 'Banking (IBPS/SBI)', hindiName: 'बैंकिंग (आईबीपीएस/एसबीआई)' },
    { id: 'railway', name: 'Railway (RRB)', hindiName: 'रेलवे (आरआरबी)' },
    { id: 'defense', name: 'Defense (NDA/CDS)', hindiName: 'रक्षा (एनडीए/सीडीएस)' },
    { id: 'teaching', name: 'Teaching (CTET/TET)', hindiName: 'शिक्षण (सीटीईटी/टीईटी)' },
    { id: 'police', name: 'Police (Constable/SI)', hindiName: 'पुलिस (कांस्टेबल/एसआई)' },
    { id: 'other', name: 'Other Government Jobs', hindiName: 'अन्य सरकारी नौकरियां' }
  ];

  const sampleTopics = [
    { id: '1', name: 'Algebra', subject: 'maths', completed: true, completedAt: new Date('2024-01-15') },
    { id: '2', name: 'Geometry', subject: 'maths', completed: true, completedAt: new Date('2024-01-20') },
    { id: '3', name: 'Trigonometry', subject: 'maths', completed: false },
    { id: '4', name: 'Grammar', subject: 'english', completed: true, completedAt: new Date('2024-01-18') },
    { id: '5', name: 'Vocabulary', subject: 'english', completed: false },
    { id: '6', name: 'Logical Reasoning', subject: 'reasoning', completed: true, completedAt: new Date('2024-01-22') },
    { id: '7', name: 'Verbal Reasoning', subject: 'reasoning', completed: false },
    { id: '8', name: 'Current Affairs', subject: 'gk', completed: true, completedAt: new Date('2024-01-25') },
    { id: '9', name: 'History', subject: 'gk', completed: false },
    { id: '10', name: 'MS Office', subject: 'computer', completed: false }
  ];

  const sampleQuizResults = [
    { id: '1', date: new Date('2024-01-25'), category: 'SSC', score: 18, totalQuestions: 20, timeTaken: 25, accuracy: 90 },
    { id: '2', date: new Date('2024-01-24'), category: 'UPSC', score: 15, totalQuestions: 20, timeTaken: 30, accuracy: 75 },
    { id: '3', date: new Date('2024-01-23'), category: 'Banking', score: 16, totalQuestions: 20, timeTaken: 28, accuracy: 80 },
    { id: '4', date: new Date('2024-01-22'), category: 'Railway', score: 19, totalQuestions: 20, timeTaken: 22, accuracy: 95 },
    { id: '5', date: new Date('2024-01-21'), category: 'Police', score: 14, totalQuestions: 20, timeTaken: 35, accuracy: 70 }
  ];

  const sampleBadges = [
    { id: '1', name: 'First Steps', description: 'Complete your first study session', icon: '🎯', unlocked: true, unlockedAt: new Date('2024-01-15') },
    { id: '2', name: 'Sharp Mind', description: 'Score 90% or above in any quiz', icon: '🏅', unlocked: true, unlockedAt: new Date('2024-01-25') },
    { id: '3', name: 'Topic Master', description: 'Complete 10 topics', icon: '🔥', unlocked: true, unlockedAt: new Date('2024-01-20') },
    { id: '4', name: 'Study Warrior', description: 'Study for 50 hours total', icon: '⚡', unlocked: false },
    { id: '5', name: 'Quiz Champion', description: 'Complete 20 quizzes', icon: '👑', unlocked: false },
    { id: '6', name: 'Perfect Score', description: 'Get 100% accuracy in any quiz', icon: '💎', unlocked: false }
  ];

  // Local Storage Functions
  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const loadFromLocalStorage = (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  };

  // Gemini AI Analysis
  const analyzeProgressWithGemini = async (progressData: UserProgressData[]) => {
    setIsAnalyzing(true);
    try {
      const latestData = progressData[progressData.length - 1];
      const totalStudyHours = progressData.reduce((sum, data) => sum + data.studyHours, 0);
      const averageScore = progressData.reduce((sum, data) => sum + data.averageScore, 0) / progressData.length;
      const totalTopics = progressData.reduce((sum, data) => sum + data.topicsCovered, 0);
      const totalMockTests = progressData.reduce((sum, data) => sum + data.mockTestsSolved, 0);

      // Get subject names from IDs
      const subjectNames = latestData.subjects.map(subjectId => {
        const subject = subjects.find(s => s.id === subjectId);
        return subject ? subject.name : subjectId;
      });

      const prompt = `Analyze this student's comprehensive progress data for government job preparation and provide detailed, personalized recommendations.

STUDENT PROGRESS DATA:
- Total Study Hours: ${totalStudyHours} hours
- Latest Study Session: ${latestData.studyHours} hours
- Total Topics Covered: ${totalTopics}
- Latest Topics Covered: ${latestData.topicsCovered}
- Subjects Studied: ${subjectNames.join(', ')}
- Total Mock Tests Solved: ${totalMockTests}
- Latest Mock Tests: ${latestData.mockTestsSolved}
- Average Score: ${averageScore.toFixed(1)}%
- Job Preparation Target: ${latestData.jobPreparation}
- Learning Time: ${latestData.learningTime} hours
- Study Consistency: ${progressData.length} days of tracking

JOB PREPARATION CONTEXT:
The student is preparing for ${latestData.jobPreparation}. This requires:
- Strong foundation in Mathematics, English, Reasoning, and General Knowledge
- Current affairs awareness
- Time management skills
- Mock test practice
- Subject-specific preparation

ANALYSIS REQUIREMENTS:
1. Calculate realistic time needed based on current progress and job requirements
2. Identify weak areas and recommend specific topics to focus on
3. Provide actionable study suggestions
4. Assess overall progress percentage (0-100)
5. Suggest immediate next steps
6. Consider the specific job preparation context

IMPORTANT: Provide response in EXACT JSON format:
{
  "timeNeeded": number (estimated hours needed to complete preparation),
  "recommendedTopics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4"],
  "overallProgress": number (0-100 percentage),
  "nextSteps": ["step1", "step2", "step3", "step4"],
  "weakAreas": ["area1", "area2"],
  "strengths": ["strength1", "strength2"],
  "studyPlan": "detailed study plan recommendation"
}

Make the analysis practical, specific to ${latestData.jobPreparation}, and actionable for government job preparation. Consider the student's current level and provide realistic recommendations.`;

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
          try {
            const analysis = JSON.parse(jsonMatch[0]);
            setGeminiAnalysis(analysis);
          } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            // Fallback analysis
            setGeminiAnalysis({
              timeNeeded: 200,
              recommendedTopics: ['Advanced Mathematics', 'Current Affairs', 'Reasoning', 'English Grammar', 'General Knowledge'],
              suggestions: ['Increase study hours to 6-8 hours daily', 'Focus on weak subjects', 'Take more mock tests', 'Practice previous year papers'],
              overallProgress: 65,
              nextSteps: ['Complete remaining topics', 'Practice previous year papers', 'Join study group', 'Focus on time management'],
              weakAreas: ['Mathematics', 'Current Affairs'],
              strengths: ['Consistent study habit', 'Good mock test performance'],
              studyPlan: 'Focus on weak areas while maintaining strengths. Practice daily mock tests and review previous year papers.'
            });
          }
        } else {
          // Fallback analysis if no JSON found
          setGeminiAnalysis({
            timeNeeded: 200,
            recommendedTopics: ['Advanced Mathematics', 'Current Affairs', 'Reasoning', 'English Grammar', 'General Knowledge'],
            suggestions: ['Increase study hours to 6-8 hours daily', 'Focus on weak subjects', 'Take more mock tests', 'Practice previous year papers'],
            overallProgress: 65,
            nextSteps: ['Complete remaining topics', 'Practice previous year papers', 'Join study group', 'Focus on time management'],
            weakAreas: ['Mathematics', 'Current Affairs'],
            strengths: ['Consistent study habit', 'Good mock test performance'],
            studyPlan: 'Focus on weak areas while maintaining strengths. Practice daily mock tests and review previous year papers.'
          });
        }
      } else {
        // Fallback analysis if API response is invalid
        setGeminiAnalysis({
          timeNeeded: 200,
          recommendedTopics: ['Advanced Mathematics', 'Current Affairs', 'Reasoning', 'English Grammar', 'General Knowledge'],
          suggestions: ['Increase study hours to 6-8 hours daily', 'Focus on weak subjects', 'Take more mock tests', 'Practice previous year papers'],
          overallProgress: 65,
          nextSteps: ['Complete remaining topics', 'Practice previous year papers', 'Join study group', 'Focus on time management'],
          weakAreas: ['Mathematics', 'Current Affairs'],
          strengths: ['Consistent study habit', 'Good mock test performance'],
          studyPlan: 'Focus on weak areas while maintaining strengths. Practice daily mock tests and review previous year papers.'
        });
      }
    } catch (error) {
      console.error('Error analyzing with Gemini:', error);
      // Fallback analysis
      setGeminiAnalysis({
        timeNeeded: 200,
        recommendedTopics: ['Advanced Mathematics', 'Current Affairs', 'Reasoning', 'English Grammar', 'General Knowledge'],
        suggestions: ['Increase study hours to 6-8 hours daily', 'Focus on weak subjects', 'Take more mock tests', 'Practice previous year papers'],
        overallProgress: 65,
        nextSteps: ['Complete remaining topics', 'Practice previous year papers', 'Join study group', 'Focus on time management'],
        weakAreas: ['Mathematics', 'Current Affairs'],
        strengths: ['Consistent study habit', 'Good mock test performance'],
        studyPlan: 'Focus on weak areas while maintaining strengths. Practice daily mock tests and review previous year papers.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    setTopics(sampleTopics);
    setQuizResults(sampleQuizResults);
    setBadges(sampleBadges);
    
    // Load saved progress data
    const savedProgress = loadFromLocalStorage('userProgressData');
    if (savedProgress) {
      setUserProgressData(savedProgress.map((item: any) => ({
        ...item,
        date: new Date(item.date)
      })));
    }
  }, []);

  // Calculate total study time from user progress data
  const totalStudyTime = userProgressData.reduce((total, data) => total + data.studyHours, 0);
  const totalStudyHours = Math.floor(totalStudyTime);
  const totalStudyMinutes = Math.round((totalStudyTime - totalStudyHours) * 60);

  // Calculate level based on study hours
  const getLevel = (hours: number) => {
    if (hours < 10) return { level: 1, progress: (hours / 10) * 100 };
    if (hours < 20) return { level: 2, progress: ((hours - 10) / 10) * 100 };
    if (hours < 30) return { level: 3, progress: ((hours - 20) / 10) * 100 };
    if (hours < 50) return { level: 4, progress: ((hours - 30) / 20) * 100 };
    return { level: 5, progress: 100 };
  };

  const levelInfo = getLevel(totalStudyHours);

  // Calculate topic completion from user progress data
  const totalTopicsCovered = userProgressData.reduce((total, data) => total + data.topicsCovered, 0);
  const totalTopicsFromSample = topics.filter(topic => topic.completed).length;
  const totalTopics = totalTopicsCovered + totalTopicsFromSample;

  // Calculate total mock tests from user progress data
  const totalMockTests = userProgressData.reduce((total, data) => total + data.mockTestsSolved, 0);
  const totalQuizzes = totalMockTests + quizResults.length;

  // Calculate average score from user progress data
  const userAverageScore = userProgressData.length > 0 
    ? userProgressData.reduce((sum, data) => sum + data.averageScore, 0) / userProgressData.length 
    : 0;
  const quizAverageAccuracy = quizResults.length > 0 
    ? quizResults.reduce((sum, quiz) => sum + quiz.accuracy, 0) / quizResults.length 
    : 0;
  const overallAverageScore = userProgressData.length > 0 && quizResults.length > 0
    ? (userAverageScore + quizAverageAccuracy) / 2
    : userAverageScore || quizAverageAccuracy;

  // Calculate badges earned based on actual achievements
  const calculateEarnedBadges = () => {
    const earnedBadges = [];
    
    // First Steps - Complete first study session
    if (userProgressData.length > 0) {
      earnedBadges.push({ id: '1', name: 'First Steps', description: 'Complete your first study session', icon: '🎯', unlocked: true, unlockedAt: userProgressData[0].date });
    }
    
    // Sharp Mind - Score 90% or above in any quiz
    if (userProgressData.some(data => data.averageScore >= 90) || quizResults.some(quiz => quiz.accuracy >= 90)) {
      earnedBadges.push({ id: '2', name: 'Sharp Mind', description: 'Score 90% or above in any quiz', icon: '🏅', unlocked: true, unlockedAt: new Date() });
    }
    
    // Topic Master - Complete 10 topics
    if (totalTopics >= 10) {
      earnedBadges.push({ id: '3', name: 'Topic Master', description: 'Complete 10 topics', icon: '🔥', unlocked: true, unlockedAt: new Date() });
    }
    
    // Study Warrior - Study for 50 hours total
    if (totalStudyTime >= 50) {
      earnedBadges.push({ id: '4', name: 'Study Warrior', description: 'Study for 50 hours total', icon: '⚡', unlocked: true, unlockedAt: new Date() });
    }
    
    // Quiz Champion - Complete 20 quizzes
    if (totalQuizzes >= 20) {
      earnedBadges.push({ id: '5', name: 'Quiz Champion', description: 'Complete 20 quizzes', icon: '👑', unlocked: true, unlockedAt: new Date() });
    }
    
    // Perfect Score - Get 100% accuracy in any quiz
    if (userProgressData.some(data => data.averageScore === 100) || quizResults.some(quiz => quiz.accuracy === 100)) {
      earnedBadges.push({ id: '6', name: 'Perfect Score', description: 'Get 100% accuracy in any quiz', icon: '💎', unlocked: true, unlockedAt: new Date() });
    }
    
    return earnedBadges;
  };

  const earnedBadges = calculateEarnedBadges();

  const startStudySession = () => {
    const session: StudySession = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration: 0,
      subject: selectedSubject === 'all' ? 'General' : subjects.find(s => s.id === selectedSubject)?.name || 'General'
    };
    
    setCurrentSession(session);
    setStudyStartTime(new Date());
    setIsStudying(true);
    
    // Set inactivity timer (30 minutes)
    const timer = setTimeout(() => {
      stopStudySession();
    }, 30 * 60 * 1000);
    
    setInactivityTimer(timer);
  };

  const stopStudySession = () => {
    if (currentSession && studyStartTime) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - studyStartTime.getTime()) / (1000 * 60));
      
      const completedSession: StudySession = {
        ...currentSession,
        endTime,
        duration
      };
      
      setStudySessions(prev => [...prev, completedSession]);
      setCurrentSession(null);
      setStudyStartTime(null);
      setIsStudying(false);
      
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        setInactivityTimer(null);
      }
    }
  };

  const toggleTopicCompletion = (topicId: string) => {
    setTopics(prev => prev.map(topic => 
      topic.id === topicId 
        ? { ...topic, completed: !topic.completed, completedAt: !topic.completed ? new Date() : undefined }
        : topic
    ));
  };

  const filteredTopics = selectedSubject === 'all' 
    ? topics 
    : topics.filter(topic => topic.subject === selectedSubject);

  const filteredQuizResults = selectedSubject === 'all' 
    ? quizResults 
    : quizResults.filter(quiz => quiz.category.toLowerCase().includes(selectedSubject));

  // Form handling functions
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectToggle = (subjectId: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter(s => s !== subjectId)
        : [...prev.subjects, subjectId]
    }));
  };

  const handleSubmitProgress = () => {
    const newProgress: UserProgressData = {
      id: editingProgress?.id || Date.now().toString(),
      date: new Date(),
      studyHours: parseFloat(formData.studyHours) || 0,
      topicsCovered: parseInt(formData.topicsCovered) || 0,
      subjects: formData.subjects,
      mockTestsSolved: parseInt(formData.mockTestsSolved) || 0,
      averageScore: parseFloat(formData.averageScore) || 0,
      learningTime: parseFloat(formData.learningTime) || 0,
      jobPreparation: formData.jobPreparation,
      notes: formData.notes
    };

    if (editingProgress) {
      // Update existing progress
      setUserProgressData(prev => prev.map(p => p.id === editingProgress.id ? newProgress : p));
    } else {
      // Add new progress
      setUserProgressData(prev => [...prev, newProgress]);
    }

    // Save to localStorage
    const updatedData = editingProgress 
      ? userProgressData.map(p => p.id === editingProgress.id ? newProgress : p)
      : [...userProgressData, newProgress];
    saveToLocalStorage('userProgressData', updatedData);

    // Reset form
    setFormData({
      studyHours: '',
      topicsCovered: '',
      subjects: [],
      mockTestsSolved: '',
      averageScore: '',
      learningTime: '',
      jobPreparation: '',
      notes: ''
    });
    setShowProgressForm(false);
    setEditingProgress(null);

    // Analyze with Gemini after adding new data
    if (!editingProgress) {
      analyzeProgressWithGemini(updatedData);
    }
  };

  const handleEditProgress = (progress: UserProgressData) => {
    setEditingProgress(progress);
    setFormData({
      studyHours: progress.studyHours.toString(),
      topicsCovered: progress.topicsCovered.toString(),
      subjects: progress.subjects,
      mockTestsSolved: progress.mockTestsSolved.toString(),
      averageScore: progress.averageScore.toString(),
      learningTime: progress.learningTime.toString(),
      jobPreparation: progress.jobPreparation,
      notes: progress.notes || ''
    });
    setShowProgressForm(true);
  };

  const handleDeleteProgress = (progressId: string) => {
    const updatedData = userProgressData.filter(p => p.id !== progressId);
    setUserProgressData(updatedData);
    saveToLocalStorage('userProgressData', updatedData);
  };

  const resetForm = () => {
    setFormData({
      studyHours: '',
      topicsCovered: '',
      subjects: [],
      mockTestsSolved: '',
      averageScore: '',
      learningTime: '',
      jobPreparation: '',
      notes: ''
    });
    setShowProgressForm(false);
    setEditingProgress(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:text-blue-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
            <span className="font-semibold text-lg">Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold">Students Progress Tracker </h1>
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 rounded-full px-4 py-2 backdrop-blur-sm">
              <span className="font-bold">Level {levelInfo.level}</span>
            </div>
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Main Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalStudyHours}h {totalStudyMinutes}m</div>
                <div className="text-gray-600">Total Study Time</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalTopics}</div>
                <div className="text-gray-600">Topics Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalQuizzes}</div>
                <div className="text-gray-600">Quizzes Taken</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{earnedBadges.length}</div>
                <div className="text-gray-600">Badges Earned</div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Level Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Level Progress</h2>
            <div className="text-3xl font-bold text-purple-600">Level {levelInfo.level}</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${levelInfo.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Level {levelInfo.level - 1}</span>
            <span>{levelInfo.progress.toFixed(1)}%</span>
            <span>Level {levelInfo.level + 1}</span>
          </div>
        </div>

        {/* Progress Input Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Progress Tracker</h2>
              <p className="text-gray-600">Add your daily study progress and get AI-powered analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowProgressForm(!showProgressForm)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>{showProgressForm ? 'Cancel' : 'Add Progress'}</span>
              </button>
              {userProgressData.length > 0 && (
                <button
                  onClick={() => analyzeProgressWithGemini(userProgressData)}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Brain className="w-5 h-5" />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Get AI Analysis'}</span>
                </button>
              )}
            </div>
          </div>

          {showProgressForm && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {editingProgress ? 'Edit Progress Entry' : 'Add New Progress Entry'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Study Hours Today</label>
                  <input
                    type="number"
                    value={formData.studyHours}
                    onChange={(e) => handleFormChange('studyHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 4.5"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Topics Covered</label>
                  <input
                    type="number"
                    value={formData.topicsCovered}
                    onChange={(e) => handleFormChange('topicsCovered', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mock Tests Solved</label>
                  <input
                    type="number"
                    value={formData.mockTestsSolved}
                    onChange={(e) => handleFormChange('mockTestsSolved', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Average Score (%)</label>
                  <input
                    type="number"
                    value={formData.averageScore}
                    onChange={(e) => handleFormChange('averageScore', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 75"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Learning Time (hours)</label>
                  <input
                    type="number"
                    value={formData.learningTime}
                    onChange={(e) => handleFormChange('learningTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 6"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Preparation</label>
                  <select
                    value={formData.jobPreparation}
                    onChange={(e) => handleFormChange('jobPreparation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Job Preparation</option>
                    {jobPreparations.map(job => (
                      <option key={job.id} value={job.name}>{job.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subjects Studied</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {subjects.map(subject => (
                    <button
                      key={subject.id}
                      type="button"
                      onClick={() => handleSubjectToggle(subject.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.subjects.includes(subject.id)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-sm">{subject.name}</div>
                        <div className="text-xs text-gray-500">{subject.hindiName}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add any additional notes about your study session..."
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-500 text-white rounded-full font-bold transition-all duration-300 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitProgress}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingProgress ? 'Update Progress' : 'Save Progress'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gemini AI Analysis */}
        {geminiAnalysis && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">AI Progress Analysis</h2>
                  <p className="text-gray-600">Personalized recommendations from Gemini AI</p>
                </div>
              </div>
              {isAnalyzing && (
                <div className="flex items-center space-x-2 text-purple-600">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  <span className="font-semibold">Analyzing...</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span className="font-semibold">Overall Progress</span>
                <span className="font-semibold">{geminiAnalysis.overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                <div
                  className={`h-6 rounded-full transition-all duration-2000 ease-out ${
                    geminiAnalysis.overallProgress >= 90 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                    geminiAnalysis.overallProgress >= 80 ? 'bg-gradient-to-r from-green-400 to-blue-500' :
                    geminiAnalysis.overallProgress >= 70 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                    geminiAnalysis.overallProgress >= 60 ? 'bg-gradient-to-r from-blue-400 to-yellow-500' :
                    geminiAnalysis.overallProgress >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    'bg-gradient-to-r from-red-400 to-red-600'
                  }`}
                  style={{ width: `${geminiAnalysis.overallProgress}%` }}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Overall Progress</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{geminiAnalysis.overallProgress}%</div>
                  <div className="text-gray-600">Current preparation level</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Time Needed</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{geminiAnalysis.timeNeeded}h</div>
                  <div className="text-gray-600">Estimated hours to complete preparation</div>
                </div>
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mr-2">✓</div>
                  Your Strengths
                </h3>
                <div className="space-y-2">
                  {geminiAnalysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-green-100 rounded-lg">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-green-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm mr-2">⚠</div>
                  Areas to Improve
                </h3>
                <div className="space-y-2">
                  {geminiAnalysis.weakAreas.map((area, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-red-100 rounded-lg">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-red-800">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recommended Topics</h3>
                <div className="space-y-2">
                  {geminiAnalysis.recommendedTopics.map((topic, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-800">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Next Steps</h3>
                <div className="space-y-2">
                  {geminiAnalysis.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-800">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Study Plan */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recommended Study Plan</h3>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                    📚
                  </div>
                  <p className="text-gray-800 leading-relaxed">{geminiAnalysis.studyPlan}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">AI Suggestions</h3>
              <div className="space-y-3">
                {geminiAnalysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                      💡
                    </div>
                    <span className="text-gray-800">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Study Session Control */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Study Timer</h2>
              <p className=" text-2xl text-gray-600">Track your study time and progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
              <button
                onClick={isStudying ? stopStudySession : startStudySession}
                className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3 ${
                  isStudying 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                }`}
              >
                {isStudying ? (
                  <>
                    <Pause className="w-6 h-6" />
                    <span>Stop Study</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    <span>Start Study</span>
                  </>
                )}
              </button>
            </div>
          </div>
          {isStudying && (
            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-semibold">Study session in progress...</span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          {/* <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'tracker', name: 'Study Tracker', icon: TrendingUp },
                { id: 'quizzes', name: 'Quizzes', icon: Target },
                { id: 'badges', name: 'Badges', icon: Award },
                { id: 'leaderboard', name: 'Leaderboard', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-lg transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div> */}

          <div className="p-6">
            {/* Study Tracker Tab */}
            {activeTab === 'tracker' && (
              <div className="space-y-6">
                {/* <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Topic Completion Progress</h3>
                  <div className="space-y-4">
                    {filteredTopics.map((topic) => (
                      <div key={topic.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => toggleTopicCompletion(topic.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              topic.completed 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300 hover:border-green-500'
                            }`}
                          >
                            {topic.completed && <CheckCircle className="w-4 h-4" />}
                          </button>
                          <div>
                            <div className="font-semibold text-gray-800">{topic.name}</div>
                            <div className="text-sm text-gray-600">
                              {subjects.find(s => s.id === topic.subject)?.name}
                            </div>
                          </div>
                        </div>
                        {topic.completed && (
                          <div className="text-sm text-green-600">
                            Completed {topic.completedAt?.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div> */}

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Study Sessions</h3>
                  <div className="space-y-3">
                    {studySessions.slice(-5).reverse().map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-800">{session.subject}</div>
                          <div className="text-sm text-gray-600">
                            {session.startTime.toLocaleDateString()} at {session.startTime.toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-blue-600">{session.duration} min</div>
                      </div>
                    ))}
                    {studySessions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No study sessions yet. Start your first session!
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Progress History</h3>
                  <div className="space-y-4">
                    {userProgressData.slice(-5).reverse().map((progress) => (
                      <div key={progress.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {progress.date.getDate()}
                            </div>
                            <div>
                              <div className="font-bold text-gray-800">{progress.date.toLocaleDateString()}</div>
                              <div className="text-sm text-gray-600">{progress.jobPreparation}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditProgress(progress)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProgress(progress.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{progress.studyHours}h</div>
                            <div className="text-xs text-gray-600">Study Hours</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{progress.topicsCovered}</div>
                            <div className="text-xs text-gray-600">Topics</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{progress.mockTestsSolved}</div>
                            <div className="text-xs text-gray-600">Mock Tests</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-600">{progress.averageScore}%</div>
                            <div className="text-xs text-gray-600">Avg Score</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {progress.subjects.map(subjectId => {
                            const subject = subjects.find(s => s.id === subjectId);
                            return subject ? (
                              <span key={subjectId} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                {subject.name}
                              </span>
                            ) : null;
                          })}
                        </div>

                        {progress.notes && (
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <strong>Notes:</strong> {progress.notes}
                          </div>
                        )}
                      </div>
                    ))}
                    {userProgressData.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No progress entries yet. Add your first progress entry!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quizzes Tab */}
            {activeTab === 'quizzes' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{quizResults.length}</div>
                    <div className="text-blue-800">Total Quizzes</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{overallAverageScore.toFixed(1)}%</div>
                    <div className="text-green-800">Average Accuracy</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.max(...quizResults.map(q => q.accuracy), 0)}%
                    </div>
                    <div className="text-purple-800">Best Score</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Quiz History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Score</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Accuracy</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredQuizResults.map((quiz) => (
                          <tr key={quiz.id} className="border-b border-gray-100">
                            <td className="px-4 py-3">{quiz.date.toLocaleDateString()}</td>
                            <td className="px-4 py-3 font-semibold">{quiz.category}</td>
                            <td className="px-4 py-3">{quiz.score}/{quiz.totalQuestions}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                                quiz.accuracy >= 90 ? 'bg-green-100 text-green-800' :
                                quiz.accuracy >= 80 ? 'bg-blue-100 text-blue-800' :
                                quiz.accuracy >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {quiz.accuracy}%
                              </span>
                            </td>
                            <td className="px-4 py-3">{quiz.timeTaken} min</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'badges' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {earnedBadges.map((badge) => (
                    <div key={badge.id} className="p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
                      <div className="text-center">
                        <div className="text-4xl mb-4">{badge.icon}</div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                          {badge.name}
                        </h3>
                        <p className="text-sm mb-4 text-gray-600">
                          {badge.description}
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Unlocked</span>
                        </div>
                        {badge.unlockedAt && (
                          <div className="text-xs text-gray-500 mt-2">
                            Earned on {badge.unlockedAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {earnedBadges.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <div className="text-6xl mb-4">🏆</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">No Badges Yet</h3>
                      <p className="text-gray-600">Start studying and taking quizzes to earn your first badges!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Topper</h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl">
                        🏆
                      </div>
                      <div>
                        <div className="font-bold text-lg">Rahul Kumar</div>
                        <div className="text-gray-600">45 hours studied</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Most Active</h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                        ⚡
                      </div>
                      <div>
                        <div className="font-bold text-lg">Priya Sharma</div>
                        <div className="text-gray-600">32 quizzes completed</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Top Performers</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Rahul Kumar', hours: 45, rank: 1, emoji: '🥇' },
                      { name: 'Priya Sharma', hours: 38, rank: 2, emoji: '🥈' },
                      { name: 'Amit Singh', hours: 32, rank: 3, emoji: '🥉' },
                      { name: 'Neha Patel', hours: 28, rank: 4, emoji: '4️⃣' },
                      { name: 'Vikram Mehta', hours: 25, rank: 5, emoji: '5️⃣' }
                    ].map((student) => (
                      <div key={student.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{student.emoji}</div>
                          <div>
                            <div className="font-semibold text-gray-800">{student.name}</div>
                            <div className="text-sm text-gray-600">Rank #{student.rank}</div>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-blue-600">{student.hours} hours</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comprehensive Guide Section */}
        <div className="mt-12 bg-white rounded-3xl shadow-2xl p-8 border border-green-100">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-800">📈 Student Progress Tracker – Your Smart Sarkari Result Study Partner</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Master the art of tracking your study progress for Sarkari Result exams, competitive tests, and academic success
            </p>
          </div>

          {/* Introduction Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">1. Introduction – Why Tracking Your Study Matters 🎯</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Every student dreams of success — whether it's scoring top marks in school, cracking a competitive exam, or just improving in a subject they find tough. But here's the truth: studying without tracking your progress is like travelling without a map.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You may be putting in hours every day, but are you moving in the right direction? Are you improving, or just repeating the same mistakes? Without proper tracking, it's easy to get lost, demotivated, or feel like your efforts are not paying off.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  That's where the SARKARI RESULT Student Progress Tracker comes in — your personal, AI-powered companion that helps you study smarter and easier, not just harder.
                </p>
              </div>
            </div>
          </div>

          {/* Common Struggles Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">2. The Common Struggles Students Face 📚</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Before we talk about the solution, let's look at some real challenges students go through:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="text-gray-700 font-semibold">No clear plan</p>
                      <p className="text-gray-600 text-sm">Many students don't have a fixed timetable. They study randomly and miss important topics.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="text-gray-700 font-semibold">Losing track of time</p>
                      <p className="text-gray-600 text-sm">Hours pass by, but at the end of the day, it's hard to say exactly what was achieved.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="text-gray-700 font-semibold">Low motivation</p>
                      <p className="text-gray-600 text-sm">Without visible results, students lose interest and give up.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="text-gray-700 font-semibold">Difficulty in balancing subjects</p>
                      <p className="text-gray-600 text-sm">Some subjects get too much attention, while others are ignored.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                    <div>
                      <p className="text-gray-700 font-semibold">Not knowing strengths & weaknesses</p>
                      <p className="text-gray-600 text-sm">Without tracking, it's hard to identify what needs more focus.</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  These problems are common, but they can be fixed with the right strategy — and that's exactly what our AI tool does.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border border-green-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">3. How Student Progress Tracker Works 🧠</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our Student Progress Tracker is designed to make studying organised, measurable, and motivating. Here's what it does for you:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 font-semibold">Helps you set your study timetable</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <Clock className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 font-semibold">Tracks your study hours</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 font-semibold">Shows your progress visually</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <Target className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700 font-semibold">Identifies areas of improvement</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-700 font-semibold">Keeps you motivated</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Think of it like a fitness tracker — but for your brain. Just like athletes track their workouts, students can now track their study workouts too! with the help of Sarkari Result AI Tools.
                </p>
              </div>
            </div>
          </div>

          {/* Step by Step Guide */}
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">4. Step-by-Step Guide to Using the Tool 🛠</h3>
                <p className="text-gray-700 leading-relaxed">
                  Using Student Progress Tracker is super simple:
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Create Your Plan</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Decide your study goals (daily hours, chapters, subjects)</li>
                    <li>• Break them into smaller, achievable targets</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Start Tracking</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Every time you study, log the subject and duration</li>
                    <li>• Add quick notes about what you studied</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Check Your Dashboard</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• View your progress chart to see how you're performing</li>
                    <li>• Identify if you are on track or need to adjust your timetable</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Make Improvements</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Focus more on weaker areas</li>
                    <li>• Balance subjects so that no topic gets ignored</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Stay Consistent</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Tracking only works if you update it daily</li>
                    <li>• Even 10 minutes of study should be recorded</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">5. Benefits of Using Student Progress Tracker 🌟</h3>
                <p className="text-gray-700 leading-relaxed">
                  This is not just about studying harder — it's about studying smarter.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 font-semibold">Better Time Management – You'll know exactly where your time goes</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <Rocket className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-semibold">Higher Productivity – No more wasted hours</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <Target className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 font-semibold">Clear Focus – You'll know which topics matter most</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700 font-semibold">Improved Motivation – Progress charts keep you excited to achieve more</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <Crown className="w-5 h-5 text-orange-500" />
                <span className="text-gray-700 font-semibold">Confidence Boost – You'll feel more prepared for exams</span>
              </div>
            </div>
          </div>

          {/* Real Life Example */}
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">6. Real-Life Example – How It Helps Students 👩‍🎓👨‍🎓</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Meet Rohan, a Class 12 student preparing for his board exams and JEE entrance. Before using the tracker, he studied for hours but couldn't figure out why his mock test scores were stuck at 60%.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  After using Student sarkariresult.com Students Progress Tracker Tool for two months:
                </p>
                <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
                  <ul className="text-gray-700 space-y-2">
                    <li>• He realised he was giving too much time to Physics and ignoring Chemistry</li>
                    <li>• He rebalanced his timetable, spent more hours on weak topics, and improved steadily</li>
                    <li>• His mock test scores went from 60% to 78% in just 8 weeks</li>
                  </ul>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  It's not magic — it's just smart tracking and adjustment.
                </p>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">7. Tips to Get the Most Out of the Tracker 💡</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-gray-700 font-semibold">Be honest</p>
                  <p className="text-gray-600 text-sm">Always log your actual study hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <p className="text-gray-700 font-semibold">Update daily</p>
                  <p className="text-gray-600 text-sm">Don't skip tracking, even if it's a short session</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <Target className="w-5 h-5 text-purple-500 mt-1" />
                <div>
                  <p className="text-gray-700 font-semibold">Set realistic goals</p>
                  <p className="text-gray-600 text-sm">Don't overcommit</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <BarChart3 className="w-5 h-5 text-indigo-500 mt-1" />
                <div>
                  <p className="text-gray-700 font-semibold">Review weekly</p>
                  <p className="text-gray-600 text-sm">Check your dashboard every week to see your growth</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <Trophy className="w-5 h-5 text-yellow-500 mt-1" />
                <div>
                  <p className="text-gray-700 font-semibold">Reward yourself</p>
                  <p className="text-gray-600 text-sm">Celebrate small achievements to stay motivated</p>
                </div>
              </div>
            </div>
          </div>

          {/* Motivation Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">8. Motivation – Your Study Journey 🚀</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Remember, success doesn't come overnight. It's the result of small, consistent efforts. The Student Progress Tracker is not here to judge you — it's here to guide you.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Every hour you study, every page you read, every topic you master — it all counts. With the right tracking, you'll not just prepare for exams, you'll prepare for life.
                </p>
              </div>
            </div>
          </div>

          {/* Final Words */}
          <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Final Words ❤️</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your dreams deserve planning, effort, and smart execution. The Student Progress Tracker is like having a personal coach who keeps you on the right path. Use it daily, stay consistent, and watch your hard work turn into results.
                </p>
                <p className="text-gray-700 leading-relaxed font-semibold text-lg">
                  Start today. Track your progress. Own your success. 📈
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-3">Start Your Smart Study Journey Today</h3>
            <p className="text-lg mb-4">Track, improve, and succeed with our AI-powered progress tracker</p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Free Forever</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>AI-Powered</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Secure & Private</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartPrepProgressTracker; 