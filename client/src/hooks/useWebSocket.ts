'use client';

import { useEffect, useCallback } from 'react';
import { getSocket } from '@/lib/socket';
import { useAssignmentStore } from '@/store/useAssignmentStore';

export function useWebSocket(assignmentId?: string) {
  const { setGenerationStatus, fetchAssignment } = useAssignmentStore();

  const joinRoom = useCallback(
    (id: string) => {
      const socket = getSocket();
      socket.emit('join:assignment', id);
    },
    []
  );

  const leaveRoom = useCallback(
    (id: string) => {
      const socket = getSocket();
      socket.emit('leave:assignment', id);
    },
    []
  );

  useEffect(() => {
    if (!assignmentId) return;

    const socket = getSocket();

    // Join room for this assignment
    joinRoom(assignmentId);

    // Listen for events
    const handleStarted = (data: { assignmentId: string; message: string }) => {
      setGenerationStatus(data.assignmentId, {
        status: 'processing',
        message: data.message,
      });
    };

    const handleProgress = (data: { assignmentId: string; message: string }) => {
      setGenerationStatus(data.assignmentId, {
        status: 'processing',
        message: data.message,
      });
    };

    const handleCompleted = (data: { assignmentId: string; message: string }) => {
      setGenerationStatus(data.assignmentId, {
        status: 'completed',
        message: data.message,
      });
      // Refresh the assignment data
      fetchAssignment(data.assignmentId);
    };

    const handleFailed = (data: { assignmentId: string; error: string }) => {
      setGenerationStatus(data.assignmentId, {
        status: 'failed',
        message: data.error,
      });
    };

    socket.on('generation:started', handleStarted);
    socket.on('generation:progress', handleProgress);
    socket.on('generation:completed', handleCompleted);
    socket.on('generation:failed', handleFailed);

    return () => {
      leaveRoom(assignmentId);
      socket.off('generation:started', handleStarted);
      socket.off('generation:progress', handleProgress);
      socket.off('generation:completed', handleCompleted);
      socket.off('generation:failed', handleFailed);
    };
  }, [assignmentId, joinRoom, leaveRoom, setGenerationStatus, fetchAssignment]);

  return { joinRoom, leaveRoom };
}
