# VedaAI — AI Assessment Creator

An AI-powered assessment creator that allows teachers to create assignments, generate question papers using AI, and view/download structured output.

![VedaAI](https://img.shields.io/badge/VedaAI-Assessment_Creator-red)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Express](https://img.shields.io/badge/Express-5-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🏗️ Architecture

```
┌─────────────────────┐     REST + WS     ┌─────────────────────┐
│     Next.js App     │ ◄──────────────► │   Express API       │
│  (Frontend Client)  │                   │  + Socket.IO        │
│  Zustand Store      │                   │  + BullMQ Worker    │
└─────────────────────┘                   └──────────┬──────────┘
                                                     │
                                          ┌──────────┼──────────┐
                                          │          │          │
                                     ┌────▼───┐ ┌───▼────┐ ┌───▼────┐
                                     │MongoDB │ │ Redis  │ │Gemini  │
                                     │ Atlas  │ │ Cloud  │ │  API   │
                                     └────────┘ └────────┘ └────────┘
```

### Request Flow

1. Teacher fills the assignment form → submits
2. Backend creates assignment in MongoDB → adds job to BullMQ queue
3. Worker picks up job → calls Google Gemini API with structured prompt
4. AI generates question paper → worker saves to MongoDB + caches in Redis
5. WebSocket emits real-time updates → frontend auto-refreshes
6. Teacher views structured paper → can download as PDF or regenerate

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, TypeScript, Zustand, Socket.IO Client |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB Atlas |
| **Cache/Queue** | Redis Cloud, BullMQ |
| **AI** | Google Gemini 2.0 Flash |
| **Real-time** | WebSocket (Socket.IO) |
| **PDF** | Puppeteer (server-side rendering) |

## 📁 Project Structure

```
veda_ass/
├── client/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── assignments/    # List, Create, Output pages
│   │   ├── components/         # Reusable UI components
│   │   ├── store/              # Zustand state management
│   │   ├── hooks/              # Custom hooks (WebSocket)
│   │   ├── lib/                # API client, Socket client
│   │   └── types/              # TypeScript definitions
│
├── server/                     # Express Backend
│   ├── src/
│   │   ├── config/             # DB, Redis, env config
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # AI & PDF services
│   │   ├── queues/             # BullMQ queue + worker
│   │   ├── socket/             # Socket.IO server
│   │   └── middleware/         # Error handlers
│
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (free tier)
- Redis Cloud account (free tier)
- Google Gemini API key (free at aistudio.google.com)

### 1. Clone the repository

```bash
git clone <repo-url>
cd veda_ass
```

### 2. Setup Backend

```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials:
# MONGODB_URI=mongodb+srv://...
# REDIS_URL=redis://...
# GEMINI_API_KEY=your_key_here

# Start server
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install

# Start development server
npm run dev
```

### 4. Open the app

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## 🎯 Features

### Core Features
- ✅ **Assignment Creation** — Multi-field form with file upload, question type config, steppers
- ✅ **AI Question Generation** — Structured prompts → Gemini API → parsed JSON output
- ✅ **Real-time Updates** — WebSocket notifications during generation
- ✅ **Structured Output** — Sections, difficulty badges, marks, answer key
- ✅ **Background Processing** — BullMQ job queue with Redis

### Bonus Features
- ✅ **PDF Export** — Server-side PDF generation with Puppeteer
- ✅ **Regenerate** — Re-queue generation with one click
- ✅ **Difficulty Badges** — Color-coded Easy/Moderate/Hard tags
- ✅ **Search & Filter** — Search assignments by title
- ✅ **Mobile Responsive** — Adapts to mobile screens
- ✅ **Redis Caching** — Cached assignment results for fast retrieval

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/assignments` | Create assignment + queue generation |
| `GET` | `/api/assignments` | List all assignments |
| `GET` | `/api/assignments/:id` | Get single assignment |
| `DELETE` | `/api/assignments/:id` | Delete assignment |
| `POST` | `/api/assignments/:id/regenerate` | Regenerate paper |
| `GET` | `/api/assignments/:id/pdf` | Download PDF |
| `GET` | `/api/health` | Health check |

## 🔌 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join:assignment` | Client → Server | Join room for updates |
| `generation:started` | Server → Client | Generation began |
| `generation:progress` | Server → Client | Progress update |
| `generation:completed` | Server → Client | Paper ready |
| `generation:failed` | Server → Client | Generation error |

## 🎨 Design Approach

The UI faithfully implements the provided Figma designs:
- **Dark sidebar** with VedaAI branding and navigation
- **Assignment cards** in a 2-column grid with dropdown menus
- **Create form** with drag-drop upload, date picker, dynamic question type rows
- **Output page** styled like a real exam paper with sections and answer key
- **Mobile responsive** with bottom tab navigation

Built with vanilla CSS using CSS custom properties for theming consistency.
