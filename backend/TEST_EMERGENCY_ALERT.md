# 🧪 Test Emergency SMS Alert - Quick Guide

## ✅ You're Ready to Test!

Since you've:
1. ✅ Logged in as a doctor
2. ✅ Provided your phone number
3. ✅ Twilio credentials are configured

## 🚀 How to Test Emergency Alert

### Option 1: Use the Test Button (Easiest)

1. **Go to Doctor Dashboard** (`/doctor`)
2. **Look for the "Emergency SMS Alert Status" panel** at the top
3. **Click the "🚨 Test Emergency Alert" button**
4. **Check your phone** - You should receive an SMS within seconds!

### Option 2: Use Postman/API

**Test Endpoint:**
```bash
POST http://localhost:5000/api/test/sms/trigger-emergency-alert
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
```

**Check Phone Status:**
```bash
GET http://localhost:5000/api/test/sms/my-phone-status
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
```

### Option 3: Wait for Automatic Alert

The simulator automatically generates critical conditions every 3-5 seconds. When it detects:
- SpO₂ < 90%
- Heart rate > 120 bpm or < 50 bpm
- Risk score ≥ 70

**SMS will be sent automatically!**

## 📱 What You'll Receive

You'll get a concise SMS like this (optimized for Twilio trial accounts):

```
🚨 ALERT: P101 CRITICAL RISK
SpO2:85% HR:130
SpO₂ is dangerously low at 85%
ICU North | Risk:75/100 | Ward:95%
```

**Note:** Messages are kept short (under 160 characters) to comply with Twilio trial account limits.

## ✅ Verification Steps

1. **Check Phone Status**:
   - Go to Doctor Dashboard
   - Look at "Emergency SMS Alert Status" panel
   - Should show: "Phone: +YOUR_NUMBER - Ready to receive alerts"

2. **Test Alert**:
   - Click "🚨 Test Emergency Alert" button
   - Wait 5-10 seconds
   - Check your phone for SMS

3. **Check Console**:
   - Backend console should show:
     ```
     ✅ SMS sent successfully to +YOUR_NUMBER (SID: SM...)
     ```

## 🐛 Troubleshooting

### "No phone number found"
- ✅ Make sure you logged in with phone number
- ✅ Check: `GET /api/test/sms/my-phone-status`

### "SMS service not configured"
- ✅ Check `.env` has all Twilio credentials
- ✅ Restart server after adding credentials

### "SMS not received"
- ✅ Check Twilio Console → Logs → Messaging
- ✅ Verify phone number is correct format (+1234567890)
- ✅ For trial accounts, verify phone number in Twilio Console

### "Button not showing"
- ✅ Make sure you're logged in as doctor
- ✅ Refresh the page
- ✅ Check browser console for errors

## 🎯 Success Indicators

✅ **Button shows**: "🚨 Test Emergency Alert"  
✅ **Status shows**: "Phone: +YOUR_NUMBER - Ready to receive alerts"  
✅ **After clicking**: Toast shows "Emergency Alert Sent!"  
✅ **SMS received**: Check your phone!  
✅ **Console shows**: "✅ SMS sent successfully"

---

**Click the test button in your Doctor Dashboard to receive an emergency alert!** 📱🚨
