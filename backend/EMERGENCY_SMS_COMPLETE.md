# 🚨 Emergency SMS Alerts - Complete Implementation

## ✅ What's Been Implemented

### 1. **Phone Number Collection**
- ✅ **Registration Form**: Phone number **REQUIRED** for doctors and nurses
- ✅ **Login Form**: Phone number **OPTIONAL** (can update if provided)
- ✅ **Auto-formatting**: Converts to E.164 format (`+1234567890`)
- ✅ **Validation**: Frontend and backend validation

### 2. **Emergency SMS Alerts**
- ✅ **Automatic Triggers**: When critical conditions detected
- ✅ **Recipients**: Doctors, nurses, and admins (based on severity)
- ✅ **Explainable Messages**: Includes vital signs, risk factors, and actions

### 3. **Twilio Integration**
- ✅ **SMS Service**: Complete Twilio integration
- ✅ **Error Handling**: Graceful degradation if SMS fails
- ✅ **Cooldown**: 5-minute cooldown to prevent spam

## 📱 How Emergency Alerts Work

### Registration Flow

**For Doctors/Nurses:**
1. User goes to `/login/doctor` or `/login/nurse`
2. Clicks "Register here"
3. **Phone number field is REQUIRED** (marked with red *)
4. Enters phone number: `+1234567890` (or `1234567890` - auto-formatted)
5. Phone number saved to `user.profile.phoneNumber`

### Login Flow

**For Doctors/Nurses:**
1. User logs in at `/login/doctor` or `/login/nurse`
2. **Phone number field is OPTIONAL** (shown for doctors/nurses)
3. If provided, updates user's phone number
4. If missing, shows warning but allows login

### Emergency Alert Flow

1. **Simulator generates vitals** every 3-5 seconds
2. **Risk calculator** analyzes for critical conditions
3. **If threshold exceeded**:
   - SpO₂ < 90%
   - Heart rate > 120 bpm or < 50 bpm
   - Risk score ≥ 70
   - Ward occupancy > 90%
4. **SMS sent automatically** to:
   - All doctors with phone numbers
   - All nurses with phone numbers
   - Admins (for critical cases or ward overload)

## 🔧 Setup Instructions

### Step 1: Add Twilio Auth Token

1. Go to [Twilio Console](https://console.twilio.com/)
2. Get your **Auth Token** from Account → API Keys & Tokens
3. Update `backend/.env`:
   ```env
   TWILIO_ACCOUNT_SID=<your_account_sid_from_console>
   TWILIO_AUTH_TOKEN=<your_auth_token_from_console>
   TWILIO_PHONE_NUMBER=<your_twilio_number_from_console>
   ```

### Step 2: Restart Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ Twilio SMS service initialized
```

### Step 3: Register Doctors/Nurses with Phone Numbers

1. Go to `/login/doctor` or `/login/nurse`
2. Click "Register here"
3. Fill in all fields including phone number
4. Phone number will be saved automatically

## 📋 Phone Number Format

**Required Format**: E.164
- ✅ `+1234567890` (US)
- ✅ `+442071234567` (UK)
- ✅ `1234567890` (auto-formatted to `+11234567890`)

**Invalid Formats**:
- ❌ `(123) 456-7890`
- ❌ `123-456-7890`
- ❌ `123.456.7890`

## 🚨 Emergency Alert Triggers

### Patient Alerts (Sent to Doctors & Nurses)
- **SpO₂ < 90%** → CRITICAL
- **Heart Rate > 120 bpm** → CRITICAL
- **Heart Rate < 50 bpm** → CRITICAL
- **Risk Score ≥ 70** → CRITICAL

### Ward Alerts (Sent to Admins)
- **Ward Occupancy > 90%** → HIGH

## 📱 SMS Message Example

```
🚨 ALERT: Patient P101 is at CRITICAL risk.

Vitals:
• SpO₂: 85% ⚠️ CRITICAL
• Heart Rate: 130 bpm ⚠️ CRITICAL
• BP: 150/95 mmHg
• Resp Rate: 24 bpm

Risk Factors:
1. Critical: SpO₂ is dangerously low at 85%
2. High heart rate detected: 130 bpm
3. High ward occupancy: 95%

🚨 IMMEDIATE ATTENTION REQUIRED
Risk Score: 75/100
Location: ICU North
```

## 🧪 Testing

### Test 1: Register Doctor with Phone Number
```bash
POST http://localhost:5000/api/auth/register
{
  "email": "doctor@hospital.com",
  "password": "password123",
  "role": "doctor",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

### Test 2: Test SMS Sending
```bash
POST http://localhost:5000/api/test/sms/test
{
  "phoneNumber": "+1234567890",
  "message": "Test emergency alert"
}
```

### Test 3: Check Staff Phone Numbers
```bash
GET http://localhost:5000/api/test/sms/staff-phones?roles=doctor,nurse
```

## ✅ Checklist

- [ ] Twilio Auth Token added to `.env`
- [ ] Server restarted after adding credentials
- [ ] Doctor registered with phone number
- [ ] Nurse registered with phone number
- [ ] Test SMS sent successfully
- [ ] Simulator running (auto-generates critical conditions)
- [ ] Emergency alerts received on phone

## 🎯 Key Files

- **Frontend**: `my-react-app/src/App.jsx` (LoginPage component)
- **Backend Registration**: `backend/routes/auth.routes.js` (register endpoint)
- **Backend Login**: `backend/routes/auth.routes.js` (login endpoint)
- **SMS Service**: `backend/services/smsService.js`
- **Alert Service**: `backend/services/alertService.js`
- **Alert Triggers**: `backend/simulator/dataSimulator.js`

## 🚀 Ready to Use!

Once you:
1. Add Twilio Auth Token to `.env`
2. Register doctors/nurses with phone numbers
3. Start the server

**Emergency SMS alerts will automatically send when critical conditions are detected!** 📱🚨

---

**Your Twilio Credentials** (store safely in `.env`):
- Account SID: Get from [Twilio Console](https://console.twilio.com/)
- Phone Number: Get from [Twilio Console](https://console.twilio.com/)
- Auth Token: Never commit - get from Twilio Console → Account → API Keys & Tokens
