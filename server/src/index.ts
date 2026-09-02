import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import farmerRoutes from './routes/farmer.routes';
import stateRoutes from './routes/state.routes';
import centerRoutes from './routes/center.routes';
import slotRoutes from './routes/slot.routes';
import queueRoutes from './routes/queue.routes';
import procurementRoutes from './routes/procurement.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';
import openDataRoutes from './routes/openData.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Request logger & URL normalization for development & Vercel
app.use((req: Request, _res: Response, next: NextFunction) => {
  const vercelPath = (req.headers['x-matched-path'] || req.headers['x-vercel-matched-path'] || req.headers['x-forwarded-url']) as string | undefined;
  if (vercelPath && vercelPath.startsWith('/api') && req.url !== vercelPath) {
    req.url = vercelPath;
  }
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} (original: ${req.originalUrl})`);
  next();
});

// Health check
const handleHealth = (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    application: 'KisanSetu Agricultural Procurement & Queue Management Platform',
    version: '1.0.0',
    sihProblemStatement: '26032',
    timestamp: new Date().toISOString(),
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// API Routes mounted on both '/api/...' and '/...' for maximum compatibility
const registerRoute = (prefix: string) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/farmer`, farmerRoutes);
  app.use(`${prefix}/states`, stateRoutes);
  app.use(`${prefix}/centers`, centerRoutes);
  app.use(`${prefix}/slots`, slotRoutes);
  app.use(`${prefix}/queue`, queueRoutes);
  app.use(`${prefix}/procurement`, procurementRoutes);
  app.use(`${prefix}/notifications`, notificationRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
  app.use(`${prefix}/open-data`, openDataRoutes);
};

registerRoute('/api');
registerRoute('');

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Only listen locally, Vercel manages the serverless runtime
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 KisanSetu Backend API running on http://localhost:${PORT}`);
    console.log(`🌾 SIH 2026 Problem Statement ID: 26032`);
  });
}

export default app;
