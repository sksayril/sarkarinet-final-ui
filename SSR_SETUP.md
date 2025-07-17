# SSR (Server-Side Rendering) Setup Guide

This project has been configured with Server-Side Rendering (SSR) to improve SEO, performance, and search engine indexing.

## Features Implemented

### 1. Server-Side Rendering (SSR)
- **Server Entry Point**: `src/entry-server.tsx`
- **Client Entry Point**: `src/entry-client.tsx`
- **Express Server**: `server.js`
- **Vite SSR Configuration**: Updated `vite.config.ts`

### 2. SEO Optimization
- **Dynamic Meta Tags**: `src/components/SEO.tsx`
- **React Helmet Async**: For managing document head
- **Structured Data**: JSON-LD schema markup
- **Open Graph Tags**: Social media sharing
- **Twitter Cards**: Twitter sharing optimization

### 3. Sitemap Generation
- **Static Sitemap**: `public/sitemap.xml`
- **Dynamic Sitemap**: `scripts/generate-sitemap.js`
- **Robots.txt**: `public/robots.txt`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install additional SSR dependencies:
```bash
npm install express react-helmet-async
npm install --save-dev @types/express
```

## Development

### Development Mode (Client-side only)
```bash
npm run dev
```

### Production Build with SSR
```bash
npm run build:seo
npm run serve
```

### Generate Sitemap
```bash
npm run sitemap
```

## File Structure

```
├── src/
│   ├── entry-server.tsx      # Server entry point
│   ├── entry-client.tsx      # Client entry point
│   ├── components/
│   │   └── SEO.tsx          # SEO component
│   └── utils/
│       └── sitemap.ts       # Sitemap utilities
├── server.js                 # Express server
├── scripts/
│   └── generate-sitemap.js   # Dynamic sitemap generator
├── public/
│   ├── robots.txt           # Robots file
│   └── sitemap.xml          # Generated sitemap
└── index.html               # HTML template
```

## SEO Features

### 1. Meta Tags
- Dynamic title and description
- Open Graph tags for social sharing
- Twitter Card optimization
- Canonical URLs
- Robots meta tags

### 2. Structured Data
- JSON-LD schema markup
- Organization and WebSite schemas
- Article schemas for content pages

### 3. Sitemap
- XML sitemap generation
- Dynamic URLs from API data
- Proper priority and change frequency

### 4. Performance
- Server-side rendering for faster initial load
- Hydration for interactive features
- Optimized bundle splitting

## Usage

### Adding SEO to Pages

```tsx
import SEO from '../components/SEO';

const MyPage = () => {
  return (
    <>
      <SEO 
        title="Custom Page Title"
        description="Custom page description"
        keywords="custom, keywords"
        url="/custom-page"
      />
      {/* Page content */}
    </>
  );
};
```

### Dynamic SEO for Content Pages

```tsx
const RecruitmentDetail = () => {
  const [data, setData] = useState(null);
  
  return (
    <>
      {data && (
        <SEO 
          title={data.title}
          description={data.description}
          type="article"
          publishedTime={data.createdAt}
          modifiedTime={data.updatedAt}
          tags={data.tags}
        />
      )}
      {/* Page content */}
    </>
  );
};
```

## Deployment

### 1. Build the Application
```bash
npm run build:seo
```

### 2. Start the Server
```bash
npm run serve
```

### 3. Environment Variables
Set the following environment variables:
- `PORT`: Server port (default: 5173)
- `NODE_ENV`: Environment (production/development)

## Performance Benefits

1. **Faster Initial Load**: Server-rendered HTML
2. **Better SEO**: Search engines can crawl content immediately
3. **Social Sharing**: Proper meta tags for social media
4. **Accessibility**: Content available without JavaScript
5. **Mobile Performance**: Reduced time to interactive

## Monitoring

### SEO Monitoring
- Google Search Console
- Google Analytics
- PageSpeed Insights
- Lighthouse audits

### Performance Monitoring
- Core Web Vitals
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)

## Troubleshooting

### Common Issues

1. **Hydration Mismatch**: Ensure server and client render the same content
2. **Meta Tags Not Updating**: Check HelmetProvider setup
3. **Sitemap Not Generating**: Verify API endpoints are accessible
4. **Build Errors**: Check TypeScript types and dependencies

### Debug Mode
```bash
NODE_ENV=development npm run serve
```

## Next Steps

1. **CDN Integration**: Add CDN for static assets
2. **Caching**: Implement Redis caching for API responses
3. **Monitoring**: Add performance monitoring tools
4. **Analytics**: Integrate Google Analytics 4
5. **PWA**: Add Progressive Web App features 