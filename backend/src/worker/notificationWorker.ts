import { Worker, Job } from 'bullmq';
import { sendEmail } from '../services/emailService';
import { sendSMS } from '../services/smsService';
import { sendInApp } from '../services/inAppService';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { redisConnection } from '../utils/redis';
dotenv.config();

const prisma = new PrismaClient();

const worker = new Worker(
  'notifications',
  async (job: Job) => {
    const { userId, to, channel, message, bulkUploadId } = job.data;
    let status = 'success';
    let error: string | null = null;
    const attempt = job.attemptsMade + 1;

    try {
      if (channel === 'email') {
        await sendEmail(to, message);
      } else if (channel === 'sms') {
        await sendSMS(to, message);
      } else if (channel === 'in-app') {
        await sendInApp(to, message);
      } else {
        throw new Error('Unknown channel');
      }
    } catch (err: any) {
      status = 'failed';
      error = err.message;
      console.error(`❌ Failed to send ${channel} to ${to}:`, err.message);
      
      // If this is not the final attempt, throw to trigger retry
      if (attempt < (job.opts.attempts || 1)) {
        // Log the attempt but don't create final log entry yet
        await prisma.notificationLog.create({
          data: {
            userId,
            to,
            channel,
            message,
            status: 'retrying',
            error,
            attempt,
          },
        });
        throw err; // This triggers BullMQ to retry
      }
      // Final attempt - will be logged in finally block
    } finally {
      // Only log final attempt (success or final failure)
      if (status === 'success' || attempt >= (job.opts.attempts || 1)) {
        await prisma.notificationLog.create({
          data: {
            userId,
            to,
            channel,
            message,
            status,
            error,
            attempt,
          },
        });
      }

      // Update bulk upload stats if applicable
      if (bulkUploadId) {
        if (status === 'success') {
          await prisma.bulkUpload.update({
            where: { id: bulkUploadId },
            data: {
              successCount: {
                increment: 1
              }
            }
          });
        } else if (attempt >= (job.opts.attempts || 1)) {
          // Only count as failed on final attempt
          await prisma.bulkUpload.update({
            where: { id: bulkUploadId },
            data: {
              failedCount: {
                increment: 1
              }
            }
          });
        }

        // Check if bulk upload is complete
        const bulkUpload = await prisma.bulkUpload.findUnique({
          where: { id: bulkUploadId }
        });

        if (bulkUpload && (bulkUpload.successCount + bulkUpload.failedCount) >= bulkUpload.totalCount) {
          await prisma.bulkUpload.update({
            where: { id: bulkUploadId },
            data: { status: 'completed' }
          });
        }
      }
    }
  },
  {
    connection: redisConnection
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} has been completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} has failed with error:`, err);
});
