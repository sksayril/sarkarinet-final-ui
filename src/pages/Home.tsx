import React from 'react';
import Banner from '../components/Banner';
import ActionButtons from '../components/ActionButtons';
import SearchBar from '../components/SearchBar';
import SocialMediaAdSection from '../components/SocialMediaAdSection';
import SearchResults from '../components/SearchResults';
import MobileAdSection from '../components/MobileAdSection';
import RecruitmentCards from '../components/RecruitmentCards';
import ContentSections from '../components/ContentSections';
import InfoSections from '../components/InfoSections';
import FAQ from '../components/FAQ';
import { useSearch } from '../contexts/SearchContext';

const Home: React.FC = () => {
  const { isSearching, searchQuery } = useSearch();

  return (
    <div>
      <Banner />
      <ActionButtons />
      <SearchBar />
      <SocialMediaAdSection />
      
      {/* Thumbnail Popup */}
      {/* <ThumbnailPopup /> */}
      
      {/* Show search results when searching */}
      {isSearching && searchQuery && <SearchResults />}
      
      {/* Show regular content when not searching */}
      {(!isSearching || !searchQuery) && (
        <>
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