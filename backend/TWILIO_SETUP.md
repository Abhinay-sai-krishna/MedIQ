# Twilio SMS Integration Setup Guide

This guide will help you set up Twilio SMS alerts for the MedIQ Healthcare Intelligence Platform.

## 📋 Prerequisites

1. **Twilio Account** - Sign up at [twilio.com](https://www.twilio.com/try-twilio)
2. **Twilio Phone Number** - Get a phone number from Twilio Console
3. **Node.js Backend** - Ensure backend is set up and running

## 🚀 Quick Setup Steps

### Step 1: Get Twilio Credentials

1. **Sign up for Twilio** (free trial available)
   - Go to [console.twilio.com](https://console.twilio.com/)
   - Create an account (free trial includes $15.50 credit)

2. **Get Account SID and Auth Token**
   - In Twilio Console, go to **Account** → **API Keys & Tokens**
   - Copy your **Account SID** and **Auth Token**

3. **Get a Phone Number**
   - Go to **Phone Numbers** → **Manage** → **Buy a number**
   - Choose a number (free trial numbers available)
   - Copy the phone number (format: +1234567890)

### Step 2: Install Twilio SDK

The Twilio SDK is already added to `package.json`. Install dependencies:

```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables

1. **Open `.env` file** in the `backend` folder

2. **Add Twilio credentials:**

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

3. **Replace with your actual values:**
   - `TWILIO_ACCOUNT_SID`: Your Account SID from Twilio Console
   - `TWILIO_AUTH_TOKEN`: Your Auth Token from Twilio Console
   - `TWILIO_PHONE_NUMBER`: Your Twilio phone number (must include + and country code)

### Step 4: Add Phone Numbers to User Profiles

SMS alerts are sent to staff members (doctors, nurses, admins) who have phone numbers in their profiles.

**Option A: Via MongoDB/Compass**
- Open MongoDB Compass
- Navigate to `users` collection
- Update user documents to include `profile.phoneNumber` field:
```json
{
  "profile": {
    "phoneNumber": "+1234567890"
  }
}
```

**Option B: Via Registration/Update API**
- Use the registration endpoint with phone number
- Or create an update endpoint to add phone numbers

**Option C: Via Script**
- Create a script to update existing users with phone numbers

### Step 5: Test SMS Service

1. **Start your backend server:**
```bash
npm run dev
```

2. **Check console for Twilio initialization:**
   - ✅ `Twilio SMS service initialized` - Success!
   - ⚠️ `Twilio credentials not found` - Check your `.env` file

3. **Trigger a test alert:**
   - The simulator will automatically send SMS when:
     - Patient SpO₂ drops below 90%
     - Heart rate exceeds 120 bpm or drops below 50 bpm
     - Ward occupancy exceeds 90%
     - Risk score reaches critical level

## 📱 SMS Alert Triggers

SMS alerts are automatically sent when:

### Patient Alerts
- **Low SpO₂**: SpO₂ < 90%
- **High Heart Rate**: Heart rate > 120 bpm
- **Low Heart Rate**: Heart rate < 50 bpm
- **Critical Risk**: Risk score ≥ 70 (critical level)

### Ward Overload Alerts
- **High Occupancy**: Ward occupancy > 90%

## 🔔 Alert Recipients

- **Patient Alerts**: Sent to doctors, nurses, and admins (for critical cases)
- **Ward Overload Alerts**: Sent to administrators only

## 📝 SMS Message Format

### Patient Alert Example:
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

### Ward Overload Alert Example:
```
🚨 WARD OVERLOAD ALERT

Ward: ICU North
Occupancy: 95%
Beds: 19/20 occupied

⚠️ Ward capacity exceeded 90%. Immediate resource allocation required.

Action: Consider patient transfer or additional staffing.
```

## 🛡️ Error Handling

The SMS service is designed to be **non-blocking**:
- ✅ If SMS fails, the system continues working normally
- ✅ Errors are logged but don't crash the application
- ✅ Alerts have a 5-minute cooldown to prevent spam

## 🔧 Troubleshooting

### "SMS not sent: Twilio not configured"
- ✅ Check `.env` file has all three Twilio variables
- ✅ Restart the server after adding credentials
- ✅ Verify no typos in variable names

### "Invalid phone number format"
- ✅ Phone numbers must be in E.164 format: `+1234567890`
- ✅ Must start with `+` followed by country code
- ✅ Example: `+14155552671` (US), `+442071234567` (UK)

### "No staff phone numbers found"
- ✅ Add phone numbers to user profiles in database
- ✅ Ensure `profile.phoneNumber` field exists
- ✅ Check user role is `doctor`, `nurse`, or `admin`

### SMS Not Received
- ✅ Check Twilio Console → Logs → Messaging for delivery status
- ✅ Verify phone number is verified (for trial accounts)
- ✅ Check account balance (free trial has limits)

## 💰 Twilio Pricing

- **Free Trial**: $15.50 credit included
- **SMS Cost**: ~$0.0075 per SMS in US
- **Phone Number**: Free with trial, ~$1/month after

## 🎯 Testing Without Twilio

If you don't want to set up Twilio right away:
- The system will log warnings but continue working
- All other features remain functional
- You can add Twilio later without code changes

## 📚 Code Structure

- **`services/smsService.js`**: Core SMS sending functions
- **`services/alertService.js`**: Alert coordination and staff lookup
- **`simulator/dataSimulator.js`**: Integration with risk detection

## ✅ Success Checklist

- [ ] Twilio account created
- [ ] Account SID and Auth Token obtained
- [ ] Twilio phone number purchased
- [ ] Credentials added to `.env` file
- [ ] Backend server restarted
- [ ] Console shows "Twilio SMS service initialized"
- [ ] User profiles have phone numbers
- [ ] Test alert received successfully

---

**Need Help?** Check Twilio Console logs for detailed error messages!
