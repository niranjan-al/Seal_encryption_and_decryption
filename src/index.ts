import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import encryptionRoutes from './routes/encryptionroutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', encryptionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Seal encryption service is running',
    service: 'encryption',
    version: '1.0.0'
  });
});

// Root endpoint with service info
app.get('/', (req, res) => {
  res.json({
    service: 'Sui Seal Encryption Service',
    version: '1.0.0',
    endpoints: {
      'POST /api/encrypt-data': 'Encrypt data with body parameters',
      'GET /api/encrypt-data': 'Encrypt data with query parameters',
      'GET /health': 'Health check'
    },
    documentation: 'https://seal-docs.wal.app/UsingSeal/'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔐 Seal encryption service running on port ${PORT}`);
  console.log(`📦 Package ID: ${process.env.PACKAGE_ID}`);
  console.log(`📋 Module Name: ${process.env.MODULE_NAME}`);
  console.log(`🌐 Network: ${process.env.SUI_NETWORK}`);
  console.log(`🚀 Service ready at http://localhost:${PORT}`);
});

export default app;