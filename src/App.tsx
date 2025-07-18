import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEO from './components/SEO';
import Home from './pages/Home';
import LatestJobs from './pages/LatestJobs';
import AdmitCard from './pages/AdmitCard';
import Results from './pages/Results';
import AnswerKey from './pages/AnswerKey';
import Syllabus from './pages/Syllabus';
import Admission from './pages/Admission';
import RecruitmentDetail from './pages/RecruitmentDetail';
import CategoryPage from './pages/CategoryPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Disclaimer from './pages/Disclaimer';
import DailyQuiz from './pages/DailyQuiz';
import PhotoResizer from './pages/PhotoResizer';
import SmartPrepProgressTracker from './pages/SmartPrepProgressTracker';
import { SearchProvider } from './contexts/SearchContext';

function App() {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-white overflow-x-auto" style={{ minWidth: '1200px' }}>
        <SEO />
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/latest-jobs" element={<CategoryPage />} />
            <Route path="/admit-card" element={<CategoryPage />} />
            <Route path="/results" element={<CategoryPage />} />
            <Route path="/answer-key" element={<CategoryPage />} />
            <Route path="/syllabus" element={<CategoryPage />} />
            <Route path="/admission" element={<CategoryPage />} />
            <Route path="/recruitment/:slug" element={<RecruitmentDetail />} />
            <Route path="/daily-quiz" element={<DailyQuiz />} />
            <Route path="/photo-resizer" element={<PhotoResizer />} />
            <Route path="/smartprep-progress-tracker" element={<SmartPrepProgressTracker />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
        <Footer />
      </div>
    </SearchProvider>
  );
}

export default App;