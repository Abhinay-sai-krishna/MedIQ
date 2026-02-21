# Phone Number Collection for Emergency SMS Alerts

## ✅ Implementation Complete

Phone number collection has been added to the registration and login forms for **doctors** and **nurses** to receive emergency SMS alerts.

## 📱 How It Works

### Registration Flow

1. **Doctor/Nurse Registration**:
   - Phone number field is **REQUIRED**
   - Must be in E.164 format: `+1234567890`
   - Automatically formatted if country code is missing
   - Saved to user profile for SMS alerts

2. **Login Flow**:
   - Phone number field is **OPTIONAL** (shown for doctors/nurses)
   - If provided, updates the user's phone number
   - If missing and user doesn't have one, shows warning

### Phone Number Format

- **Required Format**: E.164 (e.g., `+1234567890`)
- **Auto-formatting**: If you enter `1234567890`, it becomes `+11234567890`
- **Validation**: Frontend and backend both validate format

## 🚨 Emergency Alert Recipients

When critical conditions are detected, SMS alerts are sent to:

### Patient Emergency Alerts:
- **Doctors** - All doctors with phone numbers
- **Nurses** - All nurses with phone numbers  
- **Admins** - Only for critical risk cases

### Ward Overload Alerts:
- **Admins** - All administrators with phone numbers

## 📋 User Experience

### Registration Form (Doctors/Nurses)
```
First Name: [John]
Last Name: [Doe]
Email: [doctor@hospital.com]
Password: [••••••]
Phone Number: [+1234567890] * Required
  "Required to receive emergency SMS alerts for critical patient conditions"
```

### Login Form (Doctors/Nurses)
```
Email: [doctor@hospital.com]
Password: [••••••]
Phone Number: [+1234567890] * Optional (updates if provided)
  "Required to receive emergency SMS alerts for critical patient conditions"
```

## 🔧 Backend Validation

- **Registration**: Phone number required for doctors/nurses
- **Login**: Phone number optional, but updates if provided
- **Format**: Auto-formats to E.164 if country code missing
- **Storage**: Saved in `user.profile.phoneNumber`

## 📝 Example Registration Request

```json
POST /api/auth/register
{
  "email": "doctor@hospital.com",
  "password": "password123",
  "role": "doctor",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

## 📝 Example Login Request

```json
POST /api/auth/login
{
  "email": "doctor@hospital.com",
  "password": "password123",
  "phoneNumber": "+1234567890"  // Optional - updates if provided
}
```

## ✅ Testing

1. **Register a Doctor/Nurse**:
   - Go to `/login/doctor` or `/login/nurse`
   - Click "Register here"
   - Fill in all fields including phone number
   - Submit

2. **Verify Phone Number Saved**:
   - Check MongoDB: `user.profile.phoneNumber`
   - Or use: `GET /api/test/sms/staff-phones?roles=doctor,nurse`

3. **Test Emergency Alert**:
   - Wait for simulator to generate critical conditions
   - Or use: `POST /api/test/sms/test-patient-alert`

## 🎯 Next Steps

1. **Add Twilio Auth Token** to `.env`:
   ```env
   TWILIO_AUTH_TOKEN=your_actual_auth_token
   ```

2. **Register Doctors/Nurses** with phone numbers

3. **Test Emergency Alerts** - They'll automatically send when:
   - SpO₂ < 90%
   - Heart rate > 120 bpm or < 50 bpm
   - Risk score ≥ 70
   - Ward occupancy > 90%

---

**Phone numbers are now collected and used for emergency SMS alerts!** 📱🚨
