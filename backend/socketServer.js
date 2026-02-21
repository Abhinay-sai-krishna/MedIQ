import { Server } from 'socket.io';
import http from 'http';
import DataSimulator from './simulator/dataSimulator.js';

/**
 * WebSocket Server Setup
 * Creates Socket.IO server and manages real-time data simulation
 */
class SocketServer {
  constructor(app) {
    // Create HTTP server from Express app
    this.httpServer = http.createServer(app);
    
    // Initialize Socket.IO with CORS configuration
    this.io = new Server(this.httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    // Initialize data simulator
    this.simulator = new DataSimulator(this.io);
    
    this.setupSocketHandlers();
  }

  /**
   * Setup Socket.IO event handlers
   */
  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`✅ Client connected: ${socket.id}`);

      // Send welcome message
      socket.emit('connected', {
        message: 'Connected to MedIQ WebSocket server',
        timestamp: new Date()
      });

      // Handle subscription to vitals channel
      socket.on('subscribe', (data) => {
        if (data.channel === 'vitals') {
          socket.join('vitals');
          console.log(`📡 Client ${socket.id} subscribed to vitals channel`);
          socket.emit('subscribed', { channel: 'vitals' });
        }
      });

      // Handle unsubscription
      socket.on('unsubscribe', (data) => {
        if (data.channel === 'vitals') {
          socket.leave('vitals');
          console.log(`📡 Client ${socket.id} unsubscribed from vitals channel`);
        }
      });

      // Handle client disconnection
      socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`❌ Socket error for ${socket.id}:`, error);
      });
    });
  }

  /**
   * Initialize and start the simulator
   */
  async startSimulator() {
    await this.simulator.initialize();
    this.simulator.start();
  }

  /**
   * Stop the simulator
   */
  stopSimulator() {
    this.simulator.stop();
  }

  /**
   * Get the HTTP server instance
   */
  getServer() {
    return this.httpServer;
  }

  /**
   * Get the Socket.IO instance
   */
  getIO() {
    return this.io;
  }
}

export default SocketServer;
