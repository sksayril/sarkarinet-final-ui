import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Use vite's connect instance as middleware. If you use your own
  // express router (express.Router()), you should use router.use
  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // 1. Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      );

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins, e.g. global preambles
      //    from @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template);

      // 3. Load the server entry. vite.ssrLoadModule will automatically
      //    transform your ESM source code to be usable in Node.js! There is no
      //    bundling required, and provides efficient invalidation similar to
      //    HMR.
      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

      // 4. render the app HTML. This assumes entry-server.js's exported `render`
      //    function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString(). Appending a `?html` query
      //    will render the app HTML.
      const { html: appHtml, helmet } = await render(url);

      // 5. Inject the app-rendered HTML and helmet data into the template.
      let html = template.replace(`<!--app-html-->`, appHtml);
      
      // Inject helmet data
      if (helmet) {
        html = html.replace('<title>Sarkari Result - Latest Government Jobs, Results, Admit Cards</title>', helmet.title);
        html = html.replace('</head>', `${helmet.meta}${helmet.link}${helmet.script}</head>`);
        html = html.replace('<html lang="en">', `<html lang="en" ${helmet.htmlAttributes}>`);
        html = html.replace('<body>', `<body ${helmet.bodyAttributes}>`);
      }

      // 6. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(5173, () => {
    console.log('Server running at http://localhost:5173');
  });
}

createServer(); 