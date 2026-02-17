# Chatbot AI — Vite + React Starter

Minimal Vite + React scaffold created in this workspace.

Getting started:

```powershell
cd "C:\Users\K SANDHYA RANI\OneDrive\Desktop\chatbot-ai"
npm install
npm run dev
```

Open the dev server URL shown by Vite (usually http://localhost:5173).

Server (Gemini proxy):

1. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`, `GEMINI_MODEL`, and `GEMINI_ENDPOINT` appropriately.
2. Start the proxy server in a separate terminal:

```powershell
npm run server
```

The React app will call `POST /api/gemini` on the proxy. The proxy forwards the request to the Gemini endpoint using the `.env` values.

Notes:
- The proxy forwards the JSON request body as-is. Ensure the request shape matches your Gemini model's expected input.
- This scaffold does not store secrets in the frontend; put your API key in `.env` only.
