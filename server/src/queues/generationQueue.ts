import { Queue } from 'bullmq';
import { createBullMQConnection } from '../config/redis';

let generationQueue: Queue | null = null;

export function getGenerationQueue(): Queue | null {
  if (!generationQueue) {
    const connection = createBullMQConnection();
    if (!connection) {
      console.warn('⚠️  Redis not available. Job queue disabled.');
      return null;
    }

    generationQueue = new Queue('question-generation', {
      connection: connection as any,
      defaultJobOptions: {
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    });

    console.log('✅ BullMQ generation queue initialized');
  }

  return generationQueue;
}

export async function addGenerationJob(assignmentId: string): Promise<void> {
  const queue = getGenerationQueue();
  if (queue) {
    await queue.add(
      'generate',
      { assignmentId },
      { jobId: `gen-${assignmentId}` }
    );
    console.log(`📝 Job added to queue for assignment: ${assignmentId}`);
  }
}
