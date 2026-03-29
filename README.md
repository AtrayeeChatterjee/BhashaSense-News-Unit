# BhashaSense Intelligence Unit

BhashaSense is an AI-powered MERN-stack platform designed to solve information overload. It synthesizes global news into hyper-personalized professional intelligence using the **Gemini 3 Flash** model.

##  Project Overview
Unlike standard news aggregators, BhashaSense uses a "Digital Context" (User Occupation, Location, and Career Goals) to filter and summarize news. If you are a B.Tech student, the "Guru" (AI) will highlight technical and academic implications of global events.

##  Tech Stack
- Frontend: React.js, Tailwind CSS, Vite
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- AI Integration: Google Gemini API
- Auth: JWT (JSON Web Tokens)

##  Folder Structure
- `/backend`: Express server, MongoDB models, and AI route logic.
- `/frontend`: React components, Context API for user state, and Tailwind styling.

##  Setup Instructions
1. Clone the repository.
2. Inside `/backend`, create a `.env` file based on `.env.example`.
3. Run `npm install` in both `/frontend` and `/backend` folders.
4. Use `npm start` for backend and `npm run dev` for frontend.