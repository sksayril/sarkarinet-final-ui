import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { slugify } from '../utils/slugify';

interface TopDataItem {
  _id: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  contentTitle: string;
  contentDescription: string;
  colorCode: string;
}

interface SubCategory {
  _id: string;
  mainCategory: {
    _id: string;
    title: string;
  };
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  contentTitle: string;
  contentDescription: string;
}

interface ContentData {
  _id: string;
  contentTitle: string;
  contentDescription: string;
  metaDescription: string;
  colorCode?: string;
  mainCategory?: {
    _id: string;
    title: string;
  };
}

const RecruitmentDetail: React.FC = () => {
  const { mainCategory, subcategorySlug, slug } = useParams<{ 
    mainCategory?: string; 
    subcategorySlug?: string; 
    slug?: string 
  }>();
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        setLoading(true);
        
        // Determine which slug to use
        const targetSlug = subcategorySlug || slug;
        
        if (!targetSlug) {
          setError('No slug provided');
          setLoading(false);
          return;
        }
        
        // Try to find data in both APIs
        let foundData: ContentData | null = null;
        
        // First, try the topdata API
        try {
          const topDataResponse = await fetch('https://api.mydost.site/category/topdata');
          if (topDataResponse.ok) {
            const topData = await topDataResponse.json();
            const topDataItem = topData.topDataList?.find((item: TopDataItem) => 
              slugify(item.contentTitle) === targetSlug
            );
            if (topDataItem) {
              foundData = {
                _id: topDataItem._id,
                contentTitle: topDataItem.contentTitle,
                contentDescription: topDataItem.contentDescription,
                metaDescription: topDataItem.metaDescription,
                colorCode: topDataItem.colorCode
              };
            }
          }
        } catch (err) {
          console.log('Top data API failed, trying sub categories API');
        }
        
        // If not found in topdata, try the sub categories API
        if (!foundData) {
          try {
            const subDataResponse = await fetch('https://api.mydost.site/category/sub');
            if (subDataResponse.ok) {
              const subData = await subDataResponse.json();
              const subDataItem = subData.subCategories?.find((item: SubCategory) => 
                slugify(item.contentTitle) === targetSlug
              );
              if (subDataItem) {
                foundData = {
                  _id: subDataItem._id,
                  contentTitle: subDataItem.contentTitle,
                  contentDescription: subDataItem.contentDescription,
                  metaDescription: subDataItem.metaDescription,
                  mainCategory: subDataItem.mainCategory
                };
              }
            }
          } catch (err) {
            console.log('Sub categories API failed');
          }
        }
        
        if (foundData) {
          setContentData(foundData);
        } else {
          setError('Content not found');
        }
      } catch (err) {
        console.error('Error fetching content data:', err);
        setError('Failed to load content data');
      } finally {
        setLoading(false);
      }
    };

    fetchContentData();
  }, [subcategorySlug, slug]);

  // Disable content editing after content is rendered
  useEffect(() => {
    if (contentRef.current && contentData) {
      const editableElements = contentRef.current.querySelectorAll('[contenteditable="true"], [contenteditable]');
      editableElements.forEach((element) => {
        (element as HTMLElement).contentEditable = 'false';
        (element as HTMLElement).style.cursor = 'default';
      });
    }
  }, [contentData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !contentData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center text-red-600">
              <h1 className="text-2xl font-bold mb-4">Error</h1>
              <p>{error || 'Content not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header with green and blue gradient */}
          <div 
            className="p-8"
            style={{ 
              background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #3b82f6 100%)',
              color: 'white'
            }}
          >
            <h1 className="text-3xl font-bold mb-2 text-white">{contentData.contentTitle}</h1>
            <p className="text-lg opacity-90 text-white">{contentData.metaDescription}</p>
            {contentData.mainCategory && (
              <p className="text-sm opacity-75 mt-2 text-white">Category: {contentData.mainCategory.title}</p>
            )}
          </div>
          
          {/* Content */}
          <div className="p-8">
            <div 
              ref={contentRef}
              dangerouslySetInnerHTML={{ __html: contentData.contentDescription }}
              className="prose prose-lg max-w-none recruitment-content"
              style={{
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.6',
                color: '#333'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDetail; 