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
import AIVoice from './pages/AIVoice';
import SmartPrepProgressTracker from './pages/SmartPrepProgressTracker';
import { SearchProvider } from './contexts/SearchContext';
import { useScrollToTop } from './hooks/useScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import ThumbnailPopup from './components/ThumbnailPopup';
// import TitleSection from './components/TitleSection';

function App() {
  // Auto scroll to top on route change
  useScrollToTop();
  
  console.log('🚀 App component loaded, routes configured');

  return (
    <SearchProvider>
      <div className="min-h-screen bg-white overflow-x-auto" style={{ minWidth: '1200px' }}>
        <SEO />
        <ThumbnailPopup />
        <Header />
        {/* <TitleSection /> */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Specific routes for detailed pages - must come before dynamic route */}
          <Route path="/daily-quiz" element={<DailyQuiz />} />
          <Route path="/photo-resizer" element={<PhotoResizer />} />
          <Route path="/smartprep-progress-tracker" element={<SmartPrepProgressTracker />} />
          <Route path="/aivoice" element={<AIVoice />} />
          <Route path="/test-aivoice" element={<div>Test AI Voice Route Working!</div>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          
          {/* Dynamic subcategory route - handles URLs like /results/aryan-testing */}
          <Route path="/:mainCategory/:subcategorySlug" element={<RecruitmentDetail />} />
          
          {/* Recruitment route for recruitment cards (no main category) */}
          <Route path="/recruitment/:slug" element={<RecruitmentDetail />} />
          
          {/* Dynamic category route - handles all category pages */}
          <Route path="/:categorySlug" element={<CategoryPage />} />
        </Routes>
        <Footer />
        <ScrollToTopButton />
      </div>
    </SearchProvider>
  );
}

export default App;