# Data Simulator

Real-time dummy data simulator for MedIQ Hospital Intelligence Platform.

## Overview

This simulator generates realistic patient vital signs, calculates risk scores, and broadcasts data in real-time via WebSocket.

## Features

- ✅ Generates realistic patient vitals using Faker.js
- ✅ Simulates ward and ICU occupancy levels
- ✅ Calculates explainable risk scores
- ✅ Saves data to MongoDB automatically
- ✅ Broadcasts real-time updates via Socket.IO
- ✅ Runs automatically every 3-5 seconds

## Structure

```
simulator/
├── vitalsGenerator.js      # Generates fake patient vitals
├── riskCalculator.js       # Calculates risk scores
├── wardOccupancySimulator.js # Simulates ward occupancy
└── dataSimulator.js        # Main simulator orchestrator
```

## Components

### 1. Vitals Generator (`vitalsGenerator.js`)

Generates realistic patient vital signs:
- Heart Rate (60-120 bpm, occasionally higher)
- SpO₂ (95-100%, occasionally lower)
- Blood Pressure (normal/high)
- Respiratory Rate (12-20 bpm)
- Temperature (97-99.5°F, occasionally fever)
- Ward assignment (ICU, Ward A, Ward B, etc.)

### 2. Risk Calculator (`riskCalculator.js`)

Calculates risk scores based on:
- Low SpO₂ (< 95%)
- High Heart Rate (> 100 bpm)
- Abnormal Blood Pressure
- High Respiratory Rate (> 20 bpm)
- Fever/Hypothermia
- High Ward Occupancy (> 85%)

Risk Levels:
- **Low**: 0-29
- **Medium**: 30-49
- **High**: 50-69
- **Critical**: 70-100

### 3. Ward Occupancy Simulator (`wardOccupancySimulator.js`)

Simulates realistic ward occupancy:
- ICU: 20 beds, 60-100% occupancy
- Ward A: 40 beds, 40-95% occupancy
- Ward B: 35 beds, 35-90% occupancy
- Emergency: 15 beds, 50-100% occupancy
- Surgical: 30 beds, 30-85% occupancy

### 4. Data Simulator (`dataSimulator.js`)

Main orchestrator that:
- Generates patient vitals
- Calculates risk scores
- Saves to MongoDB
- Emits via WebSocket

## WebSocket Events

### Client → Server
- `subscribe` - Subscribe to vitals channel
- `unsubscribe` - Unsubscribe from channel

### Server → Client
- `connected` - Connection established
- `vitals-update` - New vitals data
- `ward-occupancy` - Ward occupancy updates
- `patient-{patientId}` - Individual patient updates

## WebSocket Message Format

### Vitals Update
```json
{
  "type": "vitals",
  "payload": {
    "patientId": "PAT-ABC12345",
    "heartRate": 85,
    "oxygenSaturation": 98.5,
    "bloodPressure": "120/80",
    "respiratoryRate": 16,
    "temperature": 98.6,
    "ward": "ICU",
    "riskScore": 25,
    "riskLevel": "medium",
    "riskReasons": ["Elevated heart rate: 105 bpm"],
    "danger": false,
    "timestamp": "2024-01-23T10:30:00.000Z"
  }
}
```

### Ward Occupancy
```json
{
  "ICU": {
    "wardName": "ICU",
    "totalBeds": 20,
    "occupiedBeds": 18,
    "availableBeds": 2,
    "occupancyPercent": 90.0,
    "status": "high"
  }
}
```

## Usage

The simulator starts automatically when the server starts. It:
1. Initializes after MongoDB connection
2. Generates data every 3-5 seconds
3. Saves to MongoDB `patients` collection
4. Broadcasts via WebSocket

## Configuration

Set in `.env`:
```env
PORT=5000
WS_PORT=5001
MONGODB_URI=mongodb://localhost:27017/mediq
FRONTEND_URL=http://localhost:5173
```

## Frontend Integration

Connect to WebSocket:
```javascript
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to WebSocket');
  socket.emit('subscribe', { channel: 'vitals' });
});

socket.on('vitals-update', (data) => {
  console.log('New vitals:', data.payload);
});
```

## Notes

- Simulator creates patient records if they don't exist
- Keeps last 50 vital readings per patient
- Generates 5-10 patients per cycle
- Automatically assigns patients to wards
- Creates alerts for dangerous vitals
