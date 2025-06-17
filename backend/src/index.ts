import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from 'dotenv';

import { notificationQueue } from './queue/notificationQueue';
import notifyRouter from './routes/notify';
import authRouter from './routes/auth';
import { startScheduler } from './scheduler/scheduler';
import { sendInApp, setSocketServer } from './services/inAppService';
import swaggerRouter from './swagger';
import logsRouter from './routes/logs';

dotenv.config();



// Prisma Client setup
const prisma = new PrismaClient();

// Create Express app
const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://dheenotifications.vercel.app",
    "https://work-1-cwrsrehunnmktmlc.prod-runtime.all-hands.dev",
    "https://work-2-cwrsrehunnmktmlc.prod-runtime.all-hands.dev"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// API Routes
app.use('/api/auth', authRouter);
app.use('/api/logs', logsRouter);
app.use('/api/notify', notifyRouter);
app.use('/api/docs', swaggerRouter);


// Create HTTP and WebSocket servers
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room using socket ID (or user ID later)
  socket.join(socket.id);

  // Emit initial xconnected message
  socket.emit('connected', { id: socket.id });
});

// Pass Socket.IO instance to other modules
setSocketServer(io);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Dheenotifications API is running!',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'File too large' });
  }
  
  if (err.message === 'Only CSV files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start scheduler
startScheduler();

// Start HTTP + WebSocket server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
