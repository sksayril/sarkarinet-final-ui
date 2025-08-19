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
  title = 'SaarkariResult.com : Sarkari Result 2025, Sarkari Results, saarkariresult.com 2025 , sarkariresult 2025',
  description = 'SaarkariResult.com for Sarkari Result, Sarkari Result jobs, Sarkari Result admit cards & Sarkari Result online forms. Sarkari Result 2025 live updates',
  keywords = 'saarkari result, government jobs, saarkari naukri, government exam results, admit card, online form, saarkari job vacancy',
  image = '/PhotoRoom-20250716_202655.webp',
  url = 'https://saarkariresult.com',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Saarkari Result',
  section,
  tags = []
}) => {
  const fullUrl = url.startsWith('http') ? url : `https://saarkariresult.com${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `https://saarkariresult.com${image}`;

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
      <meta property="og:site_name" content="Saarkari Result" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@saarkariresult" />
      
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
              "url": "https://saarkariresult.com/PhotoRoom-20250716_202655.webp"
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