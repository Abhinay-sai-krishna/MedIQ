# 🚨 Emergency SMS Alerts - Location & How It Works

## 📍 Where Emergency SMS Alerts Are Triggered

### 1. **Patient Emergency Alerts** 
**Location**: `backend/simulator/dataSimulator.js` → `checkAndSendPatientAlert()` method

**File**: `backend/simulator/dataSimulator.js` (Lines 242-298)

**Triggered When**:
- ✅ **SpO₂ < 90%** (Low oxygen saturation - CRITICAL)
- ✅ **Heart Rate > 120 bpm** (Tachycardia - High heart rate)
- ✅ **Heart Rate < 50 bpm** (Bradycardia - Low heart rate)
- ✅ **Risk Score ≥ 70** (Critical risk level)

**Code Location**:
```javascript
// Line 245-249: Alert conditions
const shouldAlert = 
  riskData.riskLevel === 'critical' || // Critical risk
  vitals.oxygenSaturation < 90 || // Low SpO₂
  vitals.heartRate > 120 || // High heart rate
  vitals.heartRate < 50; // Low heart rate
```

**Who Gets Alerted**:
- Doctors
- Nurses
- Admins (for critical cases only)

---

### 2. **Ward Overload Alerts**
**Location**: `backend/simulator/dataSimulator.js` → `checkAndSendWardOverloadAlert()` method

**File**: `backend/simulator/dataSimulator.js` (Lines 305-332)

**Triggered When**:
- ✅ **Ward Occupancy > 90%** (Ward is overloaded)

**Code Location**:
```javascript
// Line 60-62: Ward overload check
for (const [wardName, wardData] of Object.entries(wardOccupancy)) {
  if (wardData.occupancyPercent > 90) {
    await this.checkAndSendWardOverloadAlert(wardName, wardData);
  }
}
```

**Who Gets Alerted**:
- Administrators only

---

## 🔄 How It Works (Flow Diagram)

```
1. Data Simulator generates patient vitals
   ↓
2. Risk Calculator analyzes vitals
   ↓
3. Check if emergency conditions met:
   - SpO₂ < 90%?
   - Heart Rate > 120 or < 50?
   - Risk Score ≥ 70?
   - Ward Occupancy > 90%?
   ↓
4. If YES → Send SMS Alert
   ↓
5. Alert Service gets staff phone numbers
   ↓
6. SMS Service sends SMS via Twilio
   ↓
7. Staff receives emergency alert on phone
```

---

## 📱 SMS Alert Flow

### Step-by-Step Process:

1. **Vitals Generated** (`dataSimulator.js` line 50-71)
   - Simulator creates patient vital signs every 3-5 seconds

2. **Risk Calculated** (`dataSimulator.js` line 81)
   - `calculateRiskScore()` analyzes vitals
   - Determines risk level (low/medium/high/critical)

3. **Alert Check** (`dataSimulator.js` line 142)
   - After saving patient data, calls `checkAndSendPatientAlert()`

4. **Alert Triggered** (`dataSimulator.js` line 242-298)
   - Checks if conditions meet emergency thresholds
   - Validates cooldown (5 minutes between alerts)
   - Prepares alert data

5. **SMS Sent** (`alertService.js` → `smsService.js`)
   - Gets staff phone numbers by role
   - Sends SMS via Twilio
   - Logs success/failure

---

## 🎯 Emergency Alert Thresholds

### Patient Alerts Trigger When:

| Condition | Threshold | Severity |
|-----------|-----------|----------|
| **SpO₂** | < 90% | 🚨 CRITICAL |
| **Heart Rate** | > 120 bpm | 🚨 CRITICAL |
| **Heart Rate** | < 50 bpm | 🚨 CRITICAL |
| **Risk Score** | ≥ 70 | 🚨 CRITICAL |

### Ward Alerts Trigger When:

| Condition | Threshold | Severity |
|-----------|-----------|----------|
| **Ward Occupancy** | > 90% | ⚠️ HIGH |

---

## 📞 Who Receives Alerts

### Patient Emergency Alerts:
- **Doctors** - Always notified
- **Nurses** - Always notified  
- **Admins** - Only for critical risk cases

### Ward Overload Alerts:
- **Admins** - Only administrators

---

## 🧪 How to Test Emergency Alerts

### Option 1: Use Test Endpoints

**Test Patient Alert**:
```bash
POST http://localhost:5000/api/test/sms/test-patient-alert
Body: {
  "phoneNumber": "+1234567890"
}
```

**Test Ward Alert**:
```bash
POST http://localhost:5000/api/test/sms/test-ward-alert
Body: {
  "phoneNumber": "+1234567890"
}
```

### Option 2: Wait for Simulator

The simulator automatically generates critical conditions:
- Every 3-5 seconds, it generates vitals
- When thresholds are exceeded, SMS is sent automatically
- Check console for: `📱 SMS alert sent for patient...`

### Option 3: Manually Trigger

You can modify the simulator to force critical values:
```javascript
// In vitalsGenerator.js, force low SpO₂
oxygenSaturation: 85  // Will trigger alert
```

---

## 📋 Alert Message Format

### Patient Emergency Alert:
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

### Ward Overload Alert:
```
🚨 WARD OVERLOAD ALERT

Ward: ICU North
Occupancy: 95%
Beds: 19/20 occupied

⚠️ Ward capacity exceeded 90%. Immediate resource allocation required.

Action: Consider patient transfer or additional staffing.
```

---

## ⚙️ Configuration

### Alert Cooldown
**Location**: `dataSimulator.js` line 19
```javascript
this.alertCooldownMs = 300000; // 5 minutes
```

### Alert Thresholds
**Location**: `dataSimulator.js` line 245-249
```javascript
const shouldAlert = 
  riskData.riskLevel === 'critical' ||
  vitals.oxygenSaturation < 90 ||
  vitals.heartRate > 120 ||
  vitals.heartRate < 50;
```

### Staff Phone Numbers
**Location**: `alertService.js` line 15-44
- Gets phone numbers from user profiles
- Filters by role (doctor, nurse, admin)
- Filters by ward (for nurses)

---

## 🔍 Key Files

1. **`simulator/dataSimulator.js`** (Lines 242-332)
   - Main alert triggering logic
   - `checkAndSendPatientAlert()`
   - `checkAndSendWardOverloadAlert()`

2. **`services/alertService.js`**
   - Coordinates alert sending
   - Gets staff phone numbers
   - `sendPatientAlert()`
   - `sendWardOverloadAlert()`

3. **`services/smsService.js`**
   - Actual SMS sending via Twilio
   - `sendPatientAlertSMS()`
   - `sendWardOverloadSMS()`

4. **`simulator/riskCalculator.js`**
   - Calculates risk scores
   - Determines if conditions are dangerous

---

## ✅ Checklist for Emergency Alerts

- [ ] Twilio credentials in `.env` file
- [ ] Staff have phone numbers in user profiles
- [ ] Server is running (`npm run dev`)
- [ ] Simulator is active (starts automatically)
- [ ] Test with test endpoints to verify SMS works

---

## 🐛 Troubleshooting

**No SMS being sent?**
1. Check Twilio credentials in `.env`
2. Verify staff have phone numbers
3. Check console for error messages
4. Test with `/api/test/sms/test` endpoint

**Alerts not triggering?**
1. Check if vitals meet thresholds
2. Verify cooldown period (5 minutes)
3. Check console logs for alert attempts

**SMS received but wrong format?**
- Check `smsService.js` → `sendPatientAlertSMS()` function
- Message format is in lines 100-180

---

**Emergency alerts are automatically triggered when critical conditions are detected!** 🚨
