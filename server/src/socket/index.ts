import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from '../config/env';

let io: Server | null = null;

export function initSocket(httpServer: HTTPServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join a room for a specific assignment
    socket.on('join:assignment', (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
      console.log(`📋 Socket ${socket.id} joined room: assignment:${assignmentId}`);
    });

    // Leave assignment room
    socket.on('leave:assignment', (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
      console.log(`📋 Socket ${socket.id} left room: assignment:${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  console.log('✅ Socket.IO initialized');
  return io;
}

export function getIO(): Server | null {
  return io;
}

// Helper to emit to an assignment room
export function emitToAssignment(
  assignmentId: string,
  event: string,
  data: any
): void {
  if (io) {
    io.to(`assignment:${assignmentId}`).emit(event, data);
  }
}
