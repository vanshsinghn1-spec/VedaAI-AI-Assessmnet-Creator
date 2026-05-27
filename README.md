# VedaAI — AI Assessment Creator

An enterprise-grade, AI-powered assessment platform designed for educators. VedaAI allows teachers to seamlessly create assignments, generate comprehensive question papers using artificial intelligence, and manage structured educational content.

![VedaAI](https://img.shields.io/badge/VedaAI-Assessment_Creator-red)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Express](https://img.shields.io/badge/Express-5-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Architecture

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

1. Teacher fills out the assignment form and submits the request.
2. The backend creates an assignment record in MongoDB and adds a job to the BullMQ queue.
3. A background worker picks up the job and calls the Google Gemini API using a structured prompt.
4. The AI generates the question paper. The worker saves the result to MongoDB and caches it in Redis.
5. A WebSocket connection emits real-time progress updates to the frontend.
6. The teacher views the structured paper and can download it as a PDF or request a regeneration.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, TypeScript, Zustand, Socket.IO Client |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB Atlas |
| **Cache/Queue** | Redis Cloud, BullMQ |
| **AI Integration** | Google Gemini 2.0 Flash |
| **Real-time** | WebSocket (Socket.IO) |
| **PDF Generation** | Puppeteer (Server-side rendering) |

## Project Structure

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

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account
- Redis Cloud account
- Google Gemini API key (Available at aistudio.google.com)

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

### 4. Open the Application

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## Features

### Core Features
- **Assignment Creation**: Multi-field form with file upload, question type configuration, and steppers.
- **AI Question Generation**: Translates structured prompts into parsed JSON outputs via the Gemini API.
- **Real-time Updates**: WebSocket notifications keep users informed during the generation process.
- **Structured Output**: Organized sections, difficulty badges, marks distribution, and answer keys.
- **Background Processing**: Reliable BullMQ job queue integrated with Redis.

### Bonus Features
- **PDF Export**: Server-side PDF generation using Puppeteer.
- **Regenerate**: One-click functionality to re-queue document generation.
- **Difficulty Badges**: Color-coded Easy, Moderate, and Hard tags for clear assessment grading.
- **Search & Filter**: Quickly locate assignments by title.
- **Mobile Responsive**: Seamlessly adapts to mobile screens with bottom tab navigation.
- **Redis Caching**: Cached assignment results ensure rapid retrieval and optimal performance.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/assignments` | Create assignment and queue generation |
| `GET` | `/api/assignments` | List all assignments |
| `GET` | `/api/assignments/:id` | Get single assignment details |
| `DELETE` | `/api/assignments/:id` | Delete assignment |
| `POST` | `/api/assignments/:id/regenerate` | Regenerate question paper |
| `GET` | `/api/assignments/:id/pdf` | Download question paper as PDF |
| `GET` | `/api/health` | Service health check |

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join:assignment` | Client → Server | Join room for live updates |
| `generation:started` | Server → Client | Generation process initiated |
| `generation:progress` | Server → Client | Current progress update |
| `generation:completed` | Server → Client | Question paper is ready |
| `generation:failed` | Server → Client | Generation encountered an error |

## Design Approach

The UI faithfully implements the provided design specifications to ensure a premium user experience:
- **Dark Sidebar**: Professional branding and intuitive navigation.
- **Assignment Cards**: Clean, 2-column grid layout with interactive dropdown menus.
- **Create Form**: Modern interface with drag-and-drop uploads, date pickers, and dynamic question type rows.
- **Output Page**: Styled to mirror a physical exam paper, complete with distinct sections and an answer key.
- **Mobile Responsiveness**: Ensures functionality across all devices with dedicated mobile navigation.

Built using vanilla CSS and CSS custom properties for cohesive theming and performance.
