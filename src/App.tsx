import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LatestJobs from './pages/LatestJobs';
import AdmitCard from './pages/AdmitCard';
import Results from './pages/Results';
import AnswerKey from './pages/AnswerKey';
import Syllabus from './pages/Syllabus';
import Admission from './pages/Admission';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white overflow-x-auto" style={{ minWidth: '1200px' }}>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/latest-jobs" element={<LatestJobs />} />
          <Route path="/admit-card" element={<AdmitCard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/answer-key" element={<AnswerKey />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/admission" element={<Admission />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;