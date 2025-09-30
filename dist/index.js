"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const encryptionroutes_1 = __importDefault(require("./routes/encryptionroutes"));
const decryptionroutes_1 = __importDefault(require("./routes/decryptionroutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api', encryptionroutes_1.default);
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
app.use((err, req, res, next) => {
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
app.use('/api', decryptionroutes_1.default);
app.get('/', (_req, res) => {
    res.send('Seal Decryption Service is running');
});
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        decryptedData: null,
        decryptedText: null,
        error: 'Internal server error',
        errorCode: null
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map