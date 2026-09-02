# Learning Platform with RAG AI Doubt Solver

A full-stack learning platform that combines a student/mentor workflow with a retrieval-augmented generation (RAG) powered AI doubt solver. The project includes a React frontend and an Express backend with MongoDB integration.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT + bcrypt
- File upload support: Multer
- AI support: RAG-ready architecture for document-based Q&A

## Project Structure

```bash
.
├── client/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── upload/
│   ├── .env
│   ├── app.js
│   ├── package.json
│   └── server.js
├── .gitignore
├── package.json
├── README.md
└── package-lock.json
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB instance or MongoDB Atlas connection

## Setup

1. Clone the repository:

```bash
git clone https://github.com/ShreyasPanjala/Learning-Platform-with-RAG-AI-Doubt-Solver.git
cd Learning-Platform-with-RAG-AI-Doubt-Solver
```

2. Install dependencies for both apps:

```bash
npm install
npm run install:client
npm run install:server
```

3. Configure environment variables.

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/learning-platform
JWT_SECRET=your_jwt_secret_here
```

4. Start the project:

```bash
npm run dev
```

This will run the backend and frontend together.

## Available Scripts

### Root level

```bash
npm run dev        # Start frontend + backend together
npm run build      # Build the frontend for production
npm run start      # Start the backend
```

### Backend

```bash
cd server
npm run dev
npm run start
```

### Frontend

```bash
cd client
npm run dev
npm run build
```

## Notes

- The backend is structured for authentication, document management, and future RAG-based AI features.
- The project is ready to be extended with vector search, chatbot workflows, and course document ingestion.

## License

MIT
