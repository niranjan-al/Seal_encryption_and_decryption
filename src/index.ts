import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import encryptionRoutes from './routes/encryptionroutes';
import decryptionRoutes from './routes/decryptionroutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/encryption', encryptionRoutes);
app.use('/api/decryption', decryptionRoutes);


app.get('/', (_req, res) => {
  res.json({
    service: 'Sui Seal Encryption Service',
    version: '1.0.0',
    endpoints: {
      'POST /api/encryption/encrypt-data': 'Encrypt data with body',
      'POST /api/decryption/decrypt-data': 'Decrypt data with body',
      'GET /health': 'Health check',
    },
    documentation: 'https://seal-docs.wal.app/UsingSeal/',
  });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Seal encryption service is running',
    service: 'encryption',
    version: '1.0.0',
  });
});


app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🔐 Seal encryption service running on port ${PORT}`);
  console.log(`📦 Package ID: ${process.env.PACKAGE_ID}`);
  console.log(`📋 Module Name: ${process.env.MODULE_NAME}`);
  console.log(`🌐 Network: ${process.env.SUI_NETWORK}`);
  console.log(`🚀 Service ready at http://localhost:${PORT}`);
});

export default app;
