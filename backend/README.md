# MedIQ Backend API

Healthcare Intelligence Platform Backend built with Node.js, Express.js, and MongoDB.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logger
- **Twilio** - SMS alerts for critical conditions
- **Socket.IO** - Real-time WebSocket communication

## Project Structure

```
backend/
├── models/          # MongoDB models
│   ├── User.model.js
│   ├── Patient.model.js
│   └── Ward.model.js
├── routes/          # API routes
│   ├── auth.routes.js
│   ├── patient.routes.js
│   ├── doctor.routes.js
│   ├── nurse.routes.js
│   └── admin.routes.js
├── middleware/      # Custom middleware
│   ├── auth.middleware.js
│   └── errorHandler.middleware.js
├── services/        # Service modules
│   ├── smsService.js      # Twilio SMS service
│   └── alertService.js    # Alert coordination
├── simulator/       # Real-time data simulator
│   ├── dataSimulator.js
│   ├── vitalsGenerator.js
│   ├── riskCalculator.js
│   └── wardOccupancySimulator.js
├── server.js       # Main server file
├── package.json
└── .env.example    # Environment variables template
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your configuration:
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `PORT` - Server port (default: 5000)
   - `FRONTEND_URL` - Frontend URL for CORS
   - `TWILIO_ACCOUNT_SID` - Twilio Account SID (optional, for SMS alerts)
   - `TWILIO_AUTH_TOKEN` - Twilio Auth Token (optional, for SMS alerts)
   - `TWILIO_PHONE_NUMBER` - Twilio phone number (optional, for SMS alerts)

3. **Start MongoDB**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

4. **Run the Server**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Patient Routes (`/api/patient`)
- `GET /api/patient/profile` - Get patient profile (Patient only)
- `GET /api/patient/vitals` - Get patient vitals (Patient only)
- `GET /api/patient/medications` - Get medications (Patient only)
- `GET /api/patient/alerts` - Get alerts (Patient only)

### Doctor Routes (`/api/doctor`)
- `GET /api/doctor/patients` - Get assigned patients (Doctor only)
- `GET /api/doctor/patients/:patientId` - Get patient details (Doctor only)
- `GET /api/doctor/risk-heatmap` - Get risk heatmap (Doctor only)
- `GET /api/doctor/alerts` - Get critical alerts (Doctor only)

### Nurse Routes (`/api/nurse`)
- `GET /api/nurse/ward` - Get assigned ward (Nurse only)
- `GET /api/nurse/patients` - Get assigned patients (Nurse only)
- `GET /api/nurse/tasks` - Get tasks (Nurse only)

### Admin Routes (`/api/admin`)
- `GET /api/admin/dashboard` - Get dashboard data (Admin only)
- `GET /api/admin/wards` - Get all wards (Admin only)
- `GET /api/admin/staff` - Get all staff (Admin only)
- `GET /api/admin/risk-heatmap` - Get system heatmap (Admin only)

### Test Routes (`/api/test`)
- `GET /api/test/db` - Test database connection
- `GET /api/test/users` - List all users
- `GET /api/test/sms/status` - Check SMS service status
- `POST /api/test/sms/test` - Test SMS sending
- `POST /api/test/sms/test-patient-alert` - Test patient alert SMS
- `POST /api/test/sms/test-ward-alert` - Test ward overload alert SMS
- `GET /api/test/sms/staff-phones` - Get staff phone numbers

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Role-Based Access Control

The system supports four roles:
- **patient** - Can view own health data
- **doctor** - Can view assigned patients and clinical data
- **nurse** - Can view assigned ward and patient tasks
- **admin** - Can view system-wide data and manage resources

## Error Handling

The API uses consistent error responses:
```json
{
  "error": "Error message"
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based authorization
- Input validation with express-validator
- Security headers with helmet
- CORS configuration

## SMS Alerts (Twilio Integration)

The platform includes automatic SMS alerts for critical conditions:

### Alert Triggers
- **Patient Alerts**: Sent when SpO₂ < 90%, heart rate > 120 bpm or < 50 bpm, or risk score ≥ 70
- **Ward Overload Alerts**: Sent when ward occupancy > 90%

### Setup
1. Sign up for Twilio account at [twilio.com](https://www.twilio.com)
2. Get Account SID, Auth Token, and phone number from Twilio Console
3. Add credentials to `.env` file
4. Add phone numbers to user profiles (use `npm run add:phones` script)

See [TWILIO_SETUP.md](./TWILIO_SETUP.md) for detailed setup instructions.

### Features
- ✅ Automatic alert sending when thresholds are exceeded
- ✅ Explainable SMS messages with vital signs and risk factors
- ✅ Role-based recipient selection (doctors, nurses, admins)
- ✅ 5-minute cooldown to prevent spam
- ✅ Graceful error handling (system continues if SMS fails)

## Real-Time Data Simulator

The platform includes a real-time data simulator that:
- Generates realistic patient vital signs
- Calculates risk scores automatically
- Emits data via WebSocket for real-time frontend updates
- Triggers SMS alerts when critical conditions are detected

See [simulator/README.md](./simulator/README.md) for details.

## Development

- Uses ES6 modules (`import/export`)
- Environment-based configuration
- Error handling middleware
- Request logging with morgan

## Scripts

```bash
npm run dev          # Start development server
npm start            # Start production server
npm run create:users # Create test users
npm run add:phones   # Add phone numbers to users
npm run test:db      # Test database connection
```

