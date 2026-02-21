# 🚀 Quick Postman Connection Guide

## Step-by-Step Instructions

### 1️⃣ Start Your Backend Server

Open terminal in the `backend` folder and run:

```bash
npm run dev
```

Wait for:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### 2️⃣ Import into Postman

1. **Open Postman Desktop App**

2. **Import Collection:**
   - Click **"Import"** (top left)
   - Click **"Upload Files"**
   - Navigate to: `backend/postman/MedIQ_API.postman_collection.json`
   - Click **"Import"**

3. **Import Environment:**
   - Click **"Import"** again
   - Navigate to: `backend/postman/MedIQ_Local.postman_environment.json`
   - Click **"Import"**

4. **Select Environment:**
   - Top-right corner, click dropdown
   - Select **"MedIQ Local"**

### 3️⃣ Test Connection

1. In Postman, find **"Test"** folder
2. Click **"Health Check"**
3. Click **"Send"** button
4. ✅ Should see: `{"status":"Online","message":"MedIQ API is running"}`

### 4️⃣ Test Authentication

1. Go to **"Authentication"** → **"Register User"**
2. Click **"Send"**
3. ✅ Should get token and user data
4. ✅ Token automatically saved to environment!

### 5️⃣ Use Protected Endpoints

After login/register, all endpoints automatically use your token!

Try:
- **Doctor** → **Get Assigned Patients**
- **Patient** → **Get Reports**
- **Admin** → **Get Dashboard**

## ✅ Success Checklist

- [ ] Backend running on port 5000
- [ ] Collection imported
- [ ] Environment imported and selected
- [ ] Health check works
- [ ] Can register/login
- [ ] Token saved automatically
- [ ] Protected endpoints work

## 🐛 Common Issues

**"Could not get response"**
→ Check if backend is running: `http://localhost:5000/api/health`

**"401 Unauthorized"**
→ Login/Register first to get token

**"404 Not Found"**
→ Check environment is set to "MedIQ Local"

---

**That's it!** You're ready to test the API! 🎉
