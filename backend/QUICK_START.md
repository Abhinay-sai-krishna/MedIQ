# Quick Start Guide - Create Users and View Login Status

## Problem: Users count is 0

The database is connected, but no users exist yet. You need to **register users first** before you can login.

## Solution 1: Register via Frontend (Easiest)

1. **Start your backend server:**
   ```bash
   cd backend
   npm install  # First time only
   npm run dev
   ```

2. **Start your frontend:**
   ```bash
   cd my-react-app
   npm install  # First time only
   npm run dev
   ```

3. **Register a user:**
   - Go to: http://localhost:5173
   - Click on any role card (Patient, Nurse, Doctor, Admin)
   - Click "Don't have an account? Register here"
   - Fill in:
     - First Name: `John`
     - Last Name: `Doe`
     - Email: `doctor@mediq.com`
     - Password: `password123`
   - Click "Register"

4. **Check MongoDB:**
   - Open MongoDB Compass
   - Connect to: `mongodb://localhost:27017`
   - Open `mediq` database
   - Open `users` collection
   - You should now see the user!

## Solution 2: Create Test Users via Script

```bash
cd backend
npm run create:users
```

This creates 4 test users:
- `doctor@mediq.com` / `password123`
- `nurse@mediq.com` / `password123`
- `patient@mediq.com` / `password123`
- `admin@mediq.com` / `password123`

## Solution 3: Register via API (Postman/Thunder Client)

**Register a user:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "doctor@mediq.com",
  "password": "password123",
  "role": "doctor",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Then login:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "doctor@mediq.com",
  "password": "password123"
}
```

## View Login Status in Backend

### Option 1: Via API (Admin only)
```bash
GET http://localhost:5000/api/admin/login-status
Authorization: Bearer <admin_token>
```

This shows:
- Total users
- Active users
- Users logged in today
- Users who never logged in
- Full list with lastLogin timestamps

### Option 2: Via MongoDB Compass
1. Connect to `mongodb://localhost:27017`
2. Open `mediq` database
3. Open `users` collection
4. Each user document shows:
   - `email`
   - `role`
   - `lastLogin` (timestamp of last login)
   - `createdAt` (when account was created)
   - `isActive` (account status)

### Option 3: Via Test Endpoint
```bash
GET http://localhost:5000/api/test/users
```

Shows all users (without passwords).

## How Login Status Works

1. **Registration:** Creates user in MongoDB with `createdAt` timestamp
2. **Login:** Updates `lastLogin` field in MongoDB with current timestamp
3. **Storage:** Login status is also stored in browser `localStorage` for frontend use

## Verify It's Working

After registering and logging in:

1. **Check user count:**
   ```bash
   GET http://localhost:5000/api/test/db
   ```
   Should show `"users": 1` (or more)

2. **Check users:**
   ```bash
   GET http://localhost:5000/api/test/users
   ```
   Should show your registered user

3. **Check in MongoDB Compass:**
   - `mediq` → `users` collection
   - Should see user with `lastLogin` timestamp

## Troubleshooting

**Still showing 0 users?**
1. Make sure backend server is running (`npm run dev` in backend folder)
2. Make sure MongoDB is running (`net start MongoDB` on Windows)
3. Check `.env` file has correct `MONGODB_URI`
4. Try registering via API first to test connection

**Login not updating lastLogin?**
- Check backend console for errors
- Verify the login API call is successful
- Check MongoDB connection is active
