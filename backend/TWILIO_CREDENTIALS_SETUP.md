# Twilio Credentials Setup

## Your Twilio Account Information

To get your Twilio credentials:

- **Account SID**: Get from [Twilio Console](https://console.twilio.com/)
- **Phone Number**: Your Twilio phone number from console
- **Auth Token**: Get from Account → API Keys & Tokens (never commit this!)

## Setup Steps

### 1. Get Your Auth Token

1. Go to [Twilio Console](https://console.twilio.com/)
2. Log in to your account
3. Go to **Account** → **API Keys & Tokens**
4. Copy your **Auth Token** (click "Show" to reveal it)

### 2. Update `.env` File

Open `backend/.env` and update:

```env
TWILIO_ACCOUNT_SID=<your_account_sid_from_console>
TWILIO_AUTH_TOKEN=<your_auth_token_from_console>
TWILIO_PHONE_NUMBER=<your_twilio_number_from_console>
```

**Replace `your_actual_auth_token_here` with your actual Auth Token from Twilio Console.**

### 3. Restart Server

After updating `.env`:

```bash
# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

You should see:
```
✅ Twilio SMS service initialized
```

## Testing SMS

### Test with Test Endpoint

```bash
POST http://localhost:5000/api/test/sms/test
Body: {
  "phoneNumber": "+1234567890",
  "message": "Test message"
}
```

### Test Emergency Alert

```bash
POST http://localhost:5000/api/test/sms/test-patient-alert
Body: {
  "phoneNumber": "+1234567890"
}
```

## Phone Number Format

Phone numbers must be in **E.164 format**:
- ✅ `+1234567890` (US)
- ✅ `+442071234567` (UK)
- ❌ `1234567890` (missing +)
- ❌ `(123) 456-7890` (wrong format)

## Emergency Alerts

Once configured, emergency SMS alerts will automatically be sent to:
- **Doctors** - When patient SpO₂ < 90%, heart rate > 120 bpm, or risk score ≥ 70
- **Nurses** - Same conditions as doctors
- **Admins** - When ward occupancy > 90% or critical patient cases

---

**Important**: Keep your Auth Token secret! Never commit it to Git.
