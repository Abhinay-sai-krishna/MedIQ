# Postman Setup Guide for MedIQ API

This guide will help you import and configure Postman to test the MedIQ Healthcare API.

## 📋 Prerequisites

1. **Postman Desktop App** installed ([Download Postman](https://www.postman.com/downloads/))
2. **Backend server running** on `http://localhost:5000`
3. **MongoDB connected** and running

## 🚀 Quick Setup Steps

### Step 1: Start Your Backend Server

```bash
cd backend
npm install  # If not already done
npm run dev  # or node server.js
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
🌐 API Health: http://localhost:5000/api/health
```

### Step 2: Import Postman Collection

1. **Open Postman**
2. Click **"Import"** button (top left)
3. Click **"Upload Files"** or drag and drop
4. Select: `backend/postman/MedIQ_API.postman_collection.json`
5. Click **"Import"**

### Step 3: Import Environment

1. In Postman, click **"Import"** again
2. Select: `backend/postman/MedIQ_Local.postman_environment.json`
3. Click **"Import"**

### Step 4: Select Environment

1. In the top-right corner of Postman, click the **environment dropdown**
2. Select **"MedIQ Local"**

### Step 5: Test Connection

1. In the Postman collection, expand **"Test"** folder
2. Click **"Health Check"** request
3. Click **"Send"**
4. You should get: `{"status":"Online","message":"MedIQ API is running"}`

## 📚 Available API Endpoints

### Authentication (`/api/auth`)
- **POST** `/register` - Register new user
- **POST** `/login` - Login user (auto-saves token)

### Patient Routes (`/api/patient`)
- **GET** `/reports` - Get patient reports (requires auth)

### Doctor Routes (`/api/doctor`)
- **GET** `/patients` - Get assigned patients
- **POST** `/patients/:patientId/reports` - Add patient report
- **PUT** `/patients/:patientId/reports/:reportId` - Update report

### Admin Routes (`/api/admin`)
- **GET** `/dashboard` - Admin dashboard data
- **GET** `/wards` - Ward information

### Test Routes (`/api/test`)
- **GET** `/db` - Test database connection
- **GET** `/users` - List all users

## 🔐 Authentication Flow

### 1. Register a User

1. Go to **"Authentication"** → **"Register User"**
2. Modify the request body if needed:
```json
{
  "email": "doctor@mediq.com",
  "password": "password123",
  "role": "doctor",
  "firstName": "John",
  "lastName": "Doe"
}
```
3. Click **"Send"**
4. The token will be **automatically saved** to environment

### 2. Login (Alternative)

1. Go to **"Authentication"** → **"Login"**
2. Use credentials:
```json
{
  "email": "doctor@mediq.com",
  "password": "password123"
}
```
3. Click **"Send"**
4. Token is automatically saved

### 3. Use Authenticated Endpoints

After login/register, all protected endpoints will automatically use the saved token from the environment variable `{{auth_token}}`.

## 🎯 Testing Workflow

### Example: Create a Patient Report (Doctor)

1. **Login as Doctor** (Authentication → Login)
2. **Get Assigned Patients** (Doctor → Get Assigned Patients)
3. **Add Report** (Doctor → Add Patient Report)
   - Replace `:patientId` in URL with actual patient ID
   - Body example:
   ```json
   {
     "title": "Blood Test Results",
     "type": "blood",
     "summary": "All values within normal range",
     "status": "ready"
   }
   ```

## 🔧 Environment Variables

The **MedIQ Local** environment includes:

- `base_url` = `http://localhost:5000`
- `auth_token` = (auto-filled after login/register)
- `user_id` = (auto-filled after login/register)
- `user_role` = (auto-filled after login/register)
- `user_email` = (auto-filled after login/register)

## 🐛 Troubleshooting

### "Could not get response"
- ✅ Check if backend server is running: `http://localhost:5000/api/health`
- ✅ Verify MongoDB is connected
- ✅ Check Postman environment is set to "MedIQ Local"

### "401 Unauthorized"
- ✅ Make sure you've logged in first (token should be in environment)
- ✅ Check if token expired (register/login again)
- ✅ Verify `{{auth_token}}` is in the Authorization header

### "404 Not Found"
- ✅ Verify the endpoint URL is correct
- ✅ Check if the route exists in `backend/routes/`
- ✅ Ensure server is running on port 5000

### "500 Internal Server Error"
- ✅ Check backend console for error messages
- ✅ Verify MongoDB connection
- ✅ Check `.env` file has `JWT_SECRET` set

## 📝 Quick Test Checklist

- [ ] Backend server running on port 5000
- [ ] MongoDB connected
- [ ] Postman collection imported
- [ ] Postman environment imported and selected
- [ ] Health check endpoint works
- [ ] Can register/login user
- [ ] Token saved in environment
- [ ] Protected endpoints work with token

## 🎉 Success Indicators

✅ **Health Check** returns: `{"status":"Online","message":"MedIQ API is running"}`

✅ **Register/Login** returns token and user data

✅ **Protected endpoints** work without manual token entry

✅ **Environment variables** auto-update after login

---

**Need Help?** Check the backend console for detailed error messages!
