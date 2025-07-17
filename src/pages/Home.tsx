import React from 'react';
import Banner from '../components/Banner';
import ActionButtons from '../components/ActionButtons';
import SearchBar from '../components/SearchBar';
import NotesSection from '../components/NotesSection';
import RecruitmentCards from '../components/RecruitmentCards';
import ContentSections from '../components/ContentSections';
// import TopPagesTable from '../components/TopPagesTable';
import InfoSections from '../components/InfoSections';
import FAQ from '../components/FAQ';

const Home: React.FC = () => {
  return (
    <div>
      <Banner />
      <ActionButtons />
      <SearchBar />
      <NotesSection />
      <RecruitmentCards />
      <ContentSections />
      {/* <TopPagesTable /> */}
      <InfoSections />
      <FAQ />
    </div>
  );
};

export default Home;