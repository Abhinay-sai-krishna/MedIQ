# WebSocket & Data Simulator Setup Guide

## Overview

This guide explains how to set up and use the real-time data simulator with WebSocket support for the MedIQ platform.

## Prerequisites

- Node.js installed
- MongoDB running locally or MongoDB Atlas connection
- Backend dependencies installed

## Installation

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- `socket.io` - WebSocket server
- `@faker-js/faker` - Fake data generation

### 2. Install Frontend Dependencies

```bash
cd my-react-app
npm install
```

This will install:
- `socket.io-client` - WebSocket client

## Configuration

### Backend `.env` File

Make sure your `backend/.env` file includes:

```env
PORT=5000
WS_PORT=5001
MONGODB_URI=mongodb://localhost:27017/mediq
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5173
```

## Running the Server

### 1. Start MongoDB

**Windows:**
```bash
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
```

### 2. Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
📊 Database: mediq
🚀 Server running on port 5000
🔌 WebSocket Server: ws://localhost:5000
✅ Found X patient users for simulation
✅ Simulator initialized with X existing patients
🚀 Starting data simulator (interval: 4000ms)
📊 Generated vitals for X patients
```

## How It Works

### Data Generation

The simulator automatically:
1. **Generates Patient Vitals** every 4 seconds:
   - Heart Rate (60-120 bpm, occasionally higher)
   - SpO₂ (95-100%, occasionally lower)
   - Blood Pressure (normal/high)
   - Respiratory Rate (12-20 bpm)
   - Temperature (97-99.5°F, occasionally fever)

2. **Simulates Ward Occupancy**:
   - ICU: 20 beds, 60-100% occupancy
   - Ward A: 40 beds, 40-95% occupancy
   - Ward B: 35 beds, 35-90% occupancy
   - Emergency: 15 beds, 50-100% occupancy
   - Surgical: 30 beds, 30-85% occupancy

3. **Calculates Risk Scores**:
   - Based on abnormal vitals
   - Considers ward occupancy
   - Provides explainable reasons

4. **Saves to MongoDB**:
   - Creates/updates patient records
   - Stores vital signs history
   - Updates risk scores

5. **Broadcasts via WebSocket**:
   - Real-time vitals updates
   - Ward occupancy updates
   - Individual patient updates

### WebSocket Events

#### Client Subscribes
```javascript
socket.emit('subscribe', { channel: 'vitals' });
```

#### Server Emits
- `vitals-update` - New patient vitals
- `ward-occupancy` - Ward occupancy data
- `patient-{patientId}` - Individual patient updates

## Frontend Integration

The frontend automatically connects to the WebSocket server. The Doctor Dashboard shows:
- **Connection Status**: LIVE, CONNECTING, DISCONNECTED, ERROR, SIMULATED
- **Real-time Vitals**: Updates automatically when new data arrives
- **Status Indicator**: Color-coded dot showing connection state

## Testing

### Test WebSocket Connection

1. Open browser console
2. Check for "Socket.IO connected" message
3. Watch for "vitals-update" events

### Verify MongoDB Data

```bash
# Using MongoDB Compass or shell
use mediq
db.patients.find().pretty()
```

You should see patient records with:
- `patientId`
- `vitals` array (last 50 readings)
- `currentVitals`
- `riskScore` and `riskLevel`
- `assignedWard`

## Troubleshooting

### WebSocket Not Connecting

1. **Check server is running**: `http://localhost:5000/api/health`
2. **Check CORS settings**: Ensure `FRONTEND_URL` matches your frontend URL
3. **Check browser console**: Look for connection errors

### No Data Being Generated

1. **Check MongoDB connection**: Server should show "✅ Connected to MongoDB"
2. **Check simulator logs**: Should see "📊 Generated vitals for X patients"
3. **Verify patient users exist**: Create test users with `npm run create:users`

### Simulator Not Starting

1. **Check MongoDB connection**: Simulator waits for MongoDB
2. **Check console logs**: Look for initialization errors
3. **Verify dependencies**: Run `npm install` again

## Customization

### Change Simulation Interval

Edit `backend/simulator/dataSimulator.js`:
```javascript
this.intervalMs = 3000; // Change to 3 seconds
```

### Adjust Vital Sign Ranges

Edit `backend/simulator/vitalsGenerator.js`:
```javascript
function generateHeartRate() {
  return faker.number.int({ min: 60, max: 100 }); // Adjust range
}
```

### Modify Risk Calculation

Edit `backend/simulator/riskCalculator.js`:
```javascript
// Adjust risk score weights
if (vitals.oxygenSaturation < 90) {
  riskScore += 40; // Change weight
}
```

## Production Notes

⚠️ **Important**: 
- The simulator is for development/testing only
- Remove or disable in production
- Use real medical device integrations instead
- Ensure proper authentication for WebSocket connections

## File Structure

```
backend/
├── simulator/
│   ├── vitalsGenerator.js         # Generates fake vitals
│   ├── riskCalculator.js          # Calculates risk scores
│   ├── wardOccupancySimulator.js # Simulates ward occupancy
│   ├── dataSimulator.js          # Main orchestrator
│   └── README.md                 # Detailed documentation
├── socketServer.js                # WebSocket server setup
└── server.js                      # Main server (includes WebSocket)
```

## Support

For issues or questions:
1. Check console logs
2. Verify MongoDB connection
3. Check WebSocket connection status in frontend
4. Review simulator logs for errors
