import express from 'express';
import path from 'path';

const app = express();
const __dirname = path.resolve();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// For SPA: serve index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
}); 