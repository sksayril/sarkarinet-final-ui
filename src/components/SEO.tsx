import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title = 'Sarkari Result - Latest Government Jobs, Results, Admit Cards',
  description = 'Find latest Sarkari job vacancies, exam results, admit cards, and government job updates at SarkariResult.com. Get all information about government jobs, online forms, exams, and results in one place.',
  keywords = 'sarkari result, government jobs, sarkari naukri, government exam results, admit card, online form, sarkari job vacancy',
  image = '/PhotoRoom-20250716_202655.png',
  url = 'https://sarkariresult.com',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Sarkari Result',
  section,
  tags = []
}) => {
  const fullUrl = url.startsWith('http') ? url : `https://sarkariresult.com${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `https://sarkariresult.com${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="Sarkari Result" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@sarkariresult" />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? 'Article' : 'WebPage',
          "headline": title,
          "description": description,
          "url": fullUrl,
          "image": fullImageUrl,
          "author": {
            "@type": "Organization",
            "name": author
          },
          "publisher": {
            "@type": "Organization",
            "name": "Sarkari Result",
            "logo": {
              "@type": "ImageObject",
              "url": "https://sarkariresult.com/PhotoRoom-20250716_202655.png"
            }
          },
          ...(type === 'article' && {
            "datePublished": publishedTime,
            "dateModified": modifiedTime,
            "articleSection": section,
            "keywords": keywords
          })
        })}
      </script>
    </Helmet>
  );
};

export default SEO; 