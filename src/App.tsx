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
        </Routes>
        <Footer />
      </div>
    </SearchProvider>
  );
}

export default App;