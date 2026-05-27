import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { config, validateEnv } from './config/env';
import { connectDB } from './config/db';
import { getRedis } from './config/redis';
import { initSocket } from './socket';
import { startWorker } from './queues/worker';
import assignmentRoutes from './routes/assignments';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import fs from 'fs';

// Validate environment
validateEnv();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/assignments', assignmentRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected',
      redis: getRedis() ? 'connected' : 'disconnected',
    },
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize services and start server
async function start(): Promise<void> {
  // Connect to MongoDB
  await connectDB();

  // Initialize Redis (lazy, connects on first use)
  getRedis();

  // Initialize Socket.IO
  initSocket(httpServer);

  // Start BullMQ worker
  startWorker();

  // Start HTTP server
  httpServer.listen(config.port, () => {
    console.log(`
╔══════════════════════════════════════════╗
║          VedaAI Server Started           ║
╠══════════════════════════════════════════╣
║  🚀 Server:  http://localhost:${config.port}      ║
║  📡 Socket:  ws://localhost:${config.port}        ║
║  🌐 Client:  ${config.clientUrl}    ║
╚══════════════════════════════════════════╝
    `);
  });
}

start().catch(console.error);
