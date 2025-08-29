import React from 'react';
import Banner from '../components/Banner';
import ActionButtons from '../components/ActionButtons';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import NotesSection from '../components/NotesSection';
import MobileAdSection from '../components/MobileAdSection';
import RecruitmentCards from '../components/RecruitmentCards';
import MainCategoryCards from '../components/MainCategoryCards';
import ContentSections from '../components/ContentSections';
import InfoSections from '../components/InfoSections';
import FAQ from '../components/FAQ';
import ThumbnailPopup from '../components/ThumbnailPopup';
import { useSearch } from '../contexts/SearchContext';

const Home: React.FC = () => {
  const { isSearching, searchQuery } = useSearch();

  return (
    <div>
      <Banner />
      <ActionButtons />
      <SearchBar />
      
      {/* Thumbnail Popup */}
      {/* <ThumbnailPopup /> */}
      
      {/* Show search results when searching */}
      {isSearching && searchQuery && <SearchResults />}
      
      {/* Show regular content when not searching */}
      {(!isSearching || !searchQuery) && (
        <>
          <NotesSection />
          <MobileAdSection />
          <RecruitmentCards />
          {/* <MainCategoryCards /> */}
          <ContentSections />
          <InfoSections />
          <FAQ />
        </>
      )}
    </div>
  );
};

export default Home;