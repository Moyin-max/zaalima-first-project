# OpsMind AI

OpsMind AI is a Vite + React frontend with an Express backend for SOP search, chat sessions, and document upload/indexing.

## Local Setup

Frontend:
- Copy `.env.example` to `.env` if you want to override the API URL.
- Run `npm install`
- Run `npm run dev`

Backend:
- Copy `backend/.env.example` to `backend/.env`
- Fill in your MongoDB and Google API values
- Run `npm install` inside `backend`
- Run `npm run dev` inside `backend`

## Environment Variables

Frontend:
- `VITE_API_URL`

Backend:
- `PORT`
- `MONGODB_URI`
- `MONGODB_DB`
- `GEMINI_EMBEDDING_MODEL`
- `GEMINI_CHAT_MODEL`
- `GOOGLE_API_KEY`
- `ALLOWED_ORIGIN`

## Deployment

Recommended setup:
- Deploy the frontend on Vercel
- Deploy the backend on Render or Railway

Frontend deployment env:
- `VITE_API_URL=https://your-backend-url`

Backend deployment env:
- `PORT`
- `MONGODB_URI`
- `MONGODB_DB`
- `GEMINI_EMBEDDING_MODEL`
- `GEMINI_CHAT_MODEL`
- `GOOGLE_API_KEY`
- `ALLOWED_ORIGIN=https://your-frontend-url`

## Build

Frontend production build:
- `npm run build`
