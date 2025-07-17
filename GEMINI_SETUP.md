# Gemini API Setup Guide

## Getting Started with Gemini AI Assistant

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```env
REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Update the Code

In `src/components/AIAssistantModal.tsx`, replace line 108:

```typescript
// Replace this line:
const apiKey = 'YOUR_GEMINI_API_KEY'; // Replace with actual API key

// With this:
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
```

### 4. Install Node Types (if needed)

If you get TypeScript errors about `process.env`, run:

```bash
npm install --save-dev @types/node
```

### 5. Restart Development Server

```bash
npm run dev
```

## Features

- **Voice Input**: Speak in Hindi, automatically converts to text
- **Smart Responses**: AI responds based on government job queries
- **Text-to-Speech**: Listen to responses in Hindi with female voice
- **Fallback System**: Works even without API key (uses mock responses)

## API Endpoint

The integration uses the Gemini 2.5 Flash model:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

## System Prompt

The AI is configured with a comprehensive system prompt for government job assistance, including:
- UPSC, SSC, Railway, Banking exams
- Exam preparation tips
- Application processes
- Admit cards and results
- Hinglish responses

## Troubleshooting

1. **API Key Error**: Make sure your API key is correct and has proper permissions
2. **CORS Issues**: The API should work from browser environments
3. **Rate Limits**: Be aware of Gemini API rate limits
4. **Fallback Mode**: If API fails, the system uses pre-defined responses 