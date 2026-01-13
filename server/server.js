/**
 * GigFlow Server
 * Express.js backend server with MongoDB, Socket.io, and JWT authentication
 */

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import gigRoutes from './routes/gigs.js';
import bidRoutes from './routes/bids.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration for production and development
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

// CORS function for both Socket.io and Express
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    // In production, check against allowed origins
    if (allowedOrigins.some(allowed => origin.includes(allowed) || origin === allowed)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

const io = new Server(httpServer, {
  cors: corsOptions
});

// Make io accessible to routes
app.set('io', io);

// Socket.io connection handling for real-time notifications
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user-specific room for targeted notifications
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);

// 404 Handler - Catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Not Found - ${req.originalUrl}` });
});

// Error handling middleware (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// MongoDB Connection
// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gigflow';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { io };
