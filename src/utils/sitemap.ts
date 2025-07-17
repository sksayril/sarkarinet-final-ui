import { writeFileSync } from 'fs';
import { resolve } from 'path';

interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemap(urls: SitemapUrl[], outputPath: string = 'public/sitemap.xml') {
  const baseUrl = 'https://sarkariresult.com';
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.url}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  writeFileSync(resolve(outputPath), sitemap);
  console.log(`Sitemap generated at ${outputPath}`);
}

// Default sitemap URLs for your application
export const defaultSitemapUrls: SitemapUrl[] = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/latest-jobs', changefreq: 'hourly', priority: 0.9 },
  { url: '/admission', changefreq: 'daily', priority: 0.8 },
  { url: '/admit-card', changefreq: 'daily', priority: 0.8 },
  { url: '/answer-key', changefreq: 'daily', priority: 0.8 },
  { url: '/results', changefreq: 'daily', priority: 0.8 },
  { url: '/syllabus', changefreq: 'weekly', priority: 0.7 },
]; 