import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = express.Router();

// Get user's notification logs with pagination and filtering
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const status = req.query.status as string;
    const channel = req.query.channel as string;
    const skip = (page - 1) * limit;

    const where: any = {
      userId: req.user!.id
    };

    if (status) {
      where.status = status;
    }

    if (channel) {
      where.channel = channel;
    }

    const [logs, total] = await Promise.all([
      prisma.notificationLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notificationLog.count({ where })
    ]);

    res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Logs fetch error:', err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// Get analytics data
router.get("/analytics", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const days = parseInt(req.query.days as string) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Status distribution
    const statusStats = await prisma.notificationLog.groupBy({
      by: ['status'],
      where: {
        userId,
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        status: true
      }
    });

    // Channel distribution
    const channelStats = await prisma.notificationLog.groupBy({
      by: ['channel'],
      where: {
        userId,
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        channel: true
      }
    });

    // Daily stats
    const dailyStats = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'success' THEN 1 END) as success,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
      FROM notification_logs 
      WHERE "userId" = ${userId} 
        AND "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date DESC
    `;

    // Total counts
    const totalStats = await prisma.notificationLog.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        id: true
      }
    });

    // Convert BigInt values to numbers for JSON serialization
    const convertBigInt = (obj: any): any => {
      if (typeof obj === 'bigint') {
        return Number(obj);
      }
      if (Array.isArray(obj)) {
        return obj.map(convertBigInt);
      }
      if (obj && typeof obj === 'object') {
        const converted: any = {};
        for (const [key, value] of Object.entries(obj)) {
          converted[key] = convertBigInt(value);
        }
        return converted;
      }
      return obj;
    };

    res.json({
      period: `${days} days`,
      statusDistribution: convertBigInt(statusStats),
      channelDistribution: convertBigInt(channelStats),
      dailyStats: convertBigInt(dailyStats),
      totalNotifications: Number(totalStats._count.id)
    });
  } catch (err) {
    console.error('Analytics fetch error:', err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
