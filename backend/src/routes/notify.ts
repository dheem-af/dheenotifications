import express from "express";
import { body, validationResult } from "express-validator";
import { notificationQueue } from "../queue/notificationQueue";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Send single notification
router.post(
  "/",
  authenticateToken,
  [
    body("to").isString().notEmpty(),
    body("channel").isIn(["email", "sms", "in-app"]),
    body("message").isString().notEmpty(),
    body("sendAt").optional().isISO8601(),
  ],
  async (req: AuthRequest, res: express.Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { to, channel, message, sendAt } = req.body;
    const userId = req.user!.id;

    try {
      if (sendAt) {
        const scheduled = await prisma.scheduledNotification.create({
          data: {
            userId,
            to,
            channel,
            message,
            sendAt: new Date(sendAt),
          },
        });
        res.status(202).json({ 
          status: "scheduled", 
          sendAt,
          id: scheduled.id 
        });
      } else {
        await notificationQueue.add(
          "send",
          { userId, to, channel, message },
          {
            attempts: 3,
            backoff: {
              type: "exponential",
              delay: 10000,
            },
          }
        );
        res.status(202).json({ status: "queued" });
      }
    } catch (error) {
      console.error('Notification error:', error);
      res.status(500).json({ error: 'Failed to process notification' });
    }
  }
);

// Bulk upload via CSV
router.post(
  "/bulk",
  authenticateToken,
  upload.single('csvFile'),
  [
    body("channel").isIn(["email", "sms"]), // in-app not supported for bulk
    body("message").isString().notEmpty(),
  ],
  async (req: AuthRequest, res: express.Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'CSV file is required' });
      return;
    }

    const { channel, message } = req.body;
    const userId = req.user!.id;
    const filePath = req.file.path;

    try {
      const recipients: string[] = [];
      const results: any[] = [];

      // Parse CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => {
            // Expected CSV format: email,phone or just email/phone in first column
            const recipient = data.email || data.phone || data.recipient || Object.values(data)[0];
            if (recipient && typeof recipient === 'string') {
              recipients.push(recipient.trim());
            }
          })
          .on('end', resolve)
          .on('error', reject);
      });

      if (recipients.length === 0) {
        fs.unlinkSync(filePath); // Clean up
        res.status(400).json({ error: 'No valid recipients found in CSV' });
        return;
      }

      // Create bulk upload record
      const bulkUpload = await prisma.bulkUpload.create({
        data: {
          userId,
          filename: req.file.originalname,
          totalCount: recipients.length,
        }
      });

      // Queue individual notifications
      for (const recipient of recipients) {
        await notificationQueue.add(
          "send",
          { 
            userId, 
            to: recipient, 
            channel, 
            message,
            bulkUploadId: bulkUpload.id 
          },
          {
            attempts: 3,
            backoff: {
              type: "exponential",
              delay: 10000,
            },
          }
        );
      }

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      res.status(202).json({ 
        status: "queued",
        bulkUploadId: bulkUpload.id,
        totalRecipients: recipients.length,
        message: `${recipients.length} notifications queued for processing`
      });

    } catch (error) {
      console.error('Bulk upload error:', error);
      // Clean up file on error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.status(500).json({ error: 'Failed to process bulk upload' });
    }
  }
);

// Get bulk upload status
router.get("/bulk/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const bulkUpload = await prisma.bulkUpload.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!bulkUpload) {
      return res.status(404).json({ error: 'Bulk upload not found' });
    }

    res.json(bulkUpload);
  } catch (error) {
    console.error('Bulk upload status error:', error);
    res.status(500).json({ error: 'Failed to fetch bulk upload status' });
  }
});

export default router;
