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

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', message: 'MedIQ API is running' });
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

// Connect to MongoDB with better error handling
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Connection String: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    // Initialize Socket.IO server
    const socketServer = new SocketServer(app);
    const httpServer = socketServer.getServer();
    
    // Start HTTP server (includes WebSocket)
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 API Health: http://localhost:${PORT}/api/health`);
      console.log(`🔌 WebSocket Server: ws://localhost:${PORT}`);
      
      // Start data simulator after server is ready
      setTimeout(() => {
        socketServer.startSimulator().catch(err => {
          console.error('❌ Error starting simulator:', err);
        });
      }, 2000); // Wait 2 seconds for everything to initialize
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n📝 Troubleshooting steps:');
    console.error('1. Make sure MongoDB is running on your system');
    console.error('2. Check your MONGODB_URI in .env file');
    console.error('3. For local MongoDB: mongodb://localhost:27017/mediq');
    console.error('4. For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/mediq');
    console.error('\n💡 To start MongoDB locally:');
    console.error('   Windows: net start MongoDB');
    console.error('   Mac/Linux: sudo systemctl start mongod');
    process.exit(1);
  });

// MongoDB connection event handlers
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

export default app;

