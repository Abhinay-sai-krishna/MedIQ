import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patient.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import nurseRoutes from './routes/nurse.routes.js';
import adminRoutes from './routes/admin.routes.js';
import testRoutes from './routes/test.routes.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import SocketServer from './socketServer.js';

dotenv.config();

// Increase mongoose buffer timeout to reduce "buffering timed out" false-positives
import mongoosePkg from 'mongoose';
const { set: mongooseSet } = mongoosePkg;
mongooseSet && mongooseSet('bufferTimeoutMS', parseInt(process.env.MONGO_BUFFER_TIMEOUT_MS || '30000'));

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET is not set in .env file!');
  console.error('📝 Please create a .env file in the backend folder with:');
  console.error('   JWT_SECRET=your_secret_key_here');
  console.error('\n💡 Quick fix: Copy .env.example to .env and set JWT_SECRET');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mediq';

console.log('📋 Environment Check:');
console.log(`   - JWT_SECRET: ${process.env.JWT_SECRET ? '✅ present' : '❌ missing'}`);
console.log(`   - MONGODB_URI: ${process.env.MONGODB_URI ? '✅ present' : '❌ missing (using default)'}`);
console.log(`   - FRONTEND_URL: ${process.env.FRONTEND_URL ? '✅ present' : '❌ missing'}`);
console.log(`   - MONGO_BUFFER_TIMEOUT_MS: ${process.env.MONGO_BUFFER_TIMEOUT_MS || 'default (30000)'}`);


// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB readiness middleware: return 503 for API routes when DB isn't connected yet
app.use((req, res, next) => {
  // allow health checks and test routes even if DB is not ready
  if (req.path === '/api/health' || req.path.startsWith('/api/test')) return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected. Try again later.' });
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Online', 
    message: 'MedIQ API is running',
    hasMongoDbUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    mongooseConnected: mongoose.connection.readyState === 1 ? 'yes' : 'no',
    mongoDbUriPreview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 70) + '...' : 'NOT SET'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/nurse', nurseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/test', testRoutes); // Test routes - remove in production

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize Socket.IO server and start HTTP server immediately
const socketServer = new SocketServer(app);
const httpServer = socketServer.getServer();

// Start HTTP server (includes WebSocket) - don't wait for DB connection
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🔌 WebSocket Server: ws://localhost:${PORT}`);
  
  // Start data simulator after server is ready (only if DB connected)
  setTimeout(() => {
    if (mongoose.connection.readyState === 1) {
      socketServer.startSimulator().catch(err => {
        console.error('❌ Error starting simulator:', err);
      });
    } else {
      console.warn('⏳ Waiting for MongoDB connection before starting simulator...');
    }
  }, 2000); // Wait 2 seconds for everything to initialize
});

// Parse MONGODB_URI and remove embedded timeouts (set them via Mongoose instead)
let cleanMongoDbUri = MONGODB_URI;
if (cleanMongoDbUri.includes('?')) {
  cleanMongoDbUri = cleanMongoDbUri.replace(/[&?](maxPoolSize|serverSelectionTimeoutMS|socketTimeoutMS)=[^&]*/g, '');
  // Remove trailing & or ?
  cleanMongoDbUri = cleanMongoDbUri.replace(/[&?]$/, '');
}

// Connect to MongoDB with better error handling
console.log('🔄 Attempting MongoDB connection...');
console.log(`   URI: ${cleanMongoDbUri.replace(/\/\/.*@/, '//***:***@')}`);

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 20000,  // Increase to 20 seconds for Vercel
  socketTimeoutMS: 60000,           // Increase to 60 seconds for Vercel
  connectTimeoutMS: 20000,
  maxPoolSize: 10
};

let connectionAttempt = 0;
const maxRetries = 3;

function attemptConnection() {
  connectionAttempt++;
  console.log(`   Attempt ${connectionAttempt}/${maxRetries}...`);
  
  mongoose.connect(cleanMongoDbUri, mongooseOptions)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      console.log(`📊 Database: ${mongoose.connection.name}`);
    })
    .catch((error) => {
      console.error(`❌ Connection attempt ${connectionAttempt} failed:`, error.message);
      
      if (connectionAttempt < maxRetries) {
        console.log(`   Retrying in 5 seconds...`);
        setTimeout(attemptConnection, 5000);
      } else {
        console.error('\n⚠️  MongoDB connection failed after retries');
        console.error('   This endpoint will return 503 for DB-dependent routes');
      }
    });
}

attemptConnection();

// MongoDB connection event handlers
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

export default app;

