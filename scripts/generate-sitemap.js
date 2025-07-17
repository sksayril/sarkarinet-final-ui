import { generateSitemap, defaultSitemapUrls } from '../src/utils/sitemap.js';

async function generateDynamicSitemap() {
  try {
    // Fetch dynamic content from your APIs
    const [topDataResponse, subcategoriesResponse, homeContentResponse] = await Promise.allSettled([
      fetch('http://localhost:3110/topdata/public/active'),
      fetch('http://localhost:3110/subcategories/public/active'),
      fetch('http://localhost:3110/home-content/public/active')
    ]);

    const dynamicUrls = [...defaultSitemapUrls];

    // Add recruitment URLs from topdata
    if (topDataResponse.status === 'fulfilled' && topDataResponse.value.ok) {
      const topData = await topDataResponse.value.json();
      if (topData.success && topData.data) {
        topData.data.forEach(item => {
          const slug = item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          if (slug) {
            dynamicUrls.push({
              url: `/recruitment/${slug}`,
              changefreq: 'daily',
              priority: 0.8
            });
          }
        });
      }
    }

    // Add subcategory URLs
    if (subcategoriesResponse.status === 'fulfilled' && subcategoriesResponse.value.ok) {
      const subcategories = await subcategoriesResponse.value.json();
      if (subcategories.success && subcategories.data) {
        subcategories.data.forEach(item => {
          const slug = item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          if (slug) {
            dynamicUrls.push({
              url: `/recruitment/${slug}`,
              changefreq: 'weekly',
              priority: 0.7
            });
          }
        });
      }
    }

    // Generate sitemap
    generateSitemap(dynamicUrls);
    console.log('Dynamic sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    // Fallback to default sitemap
    generateSitemap(defaultSitemapUrls);
  }
}

generateDynamicSitemap(); 