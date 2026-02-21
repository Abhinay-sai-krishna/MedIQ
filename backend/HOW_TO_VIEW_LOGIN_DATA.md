# How to View Login Details in MongoDB

## Option 1: Using MongoDB Compass (GUI - Recommended)

### Step 1: Connect to MongoDB
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Click "Connect"

### Step 2: Find the medIQ Database
1. In the left sidebar, look for the **`mediq`** database
2. If you don't see it, you need to create a user first (see below)

### Step 3: View Users Collection
1. Click on **`mediq`** database to expand it
2. Click on **`users`** collection
3. You'll see all registered users with their:
   - Email
   - Role (patient, doctor, nurse, admin)
   - First Name, Last Name
   - Created date
   - Profile information

**Note:** Passwords are hashed and not visible (for security)

---

## Option 2: Create Test User First (If Database Doesn't Exist)

If you don't see the `mediq` database, create a test user:

### Using API (Postman/Thunder Client/curl):

**Start your backend server:**
```bash
cd backend
npm run dev
```

**Register a test user:**
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

**Or register multiple roles:**
```bash
# Patient
POST http://localhost:5000/api/auth/register
{
  "email": "patient@mediq.com",
  "password": "password123",
  "role": "patient",
  "firstName": "Jane",
  "lastName": "Smith"
}

# Nurse
POST http://localhost:5000/api/auth/register
{
  "email": "nurse@mediq.com",
  "password": "password123",
  "role": "nurse",
  "firstName": "Sarah",
  "lastName": "Johnson"
}

# Admin
POST http://localhost:5000/api/auth/register
{
  "email": "admin@mediq.com",
  "password": "password123",
  "role": "admin",
  "firstName": "Admin",
  "lastName": "User"
}
```

After registering, refresh MongoDB Compass and you'll see the `mediq` database!

---

## Option 3: View via API Endpoints

### Check Database Status:
```bash
GET http://localhost:5000/api/test/db
```

### View All Users:
```bash
GET http://localhost:5000/api/test/users
```

This will show:
- User count
- All users with their details (without passwords)

---

## Option 4: Using MongoDB Shell (Command Line)

```bash
# Open MongoDB shell
mongosh

# Or older version
mongo

# Switch to medIQ database
use mediq

# View all users
db.users.find().pretty()

# View specific user by email
db.users.findOne({ email: "doctor@mediq.com" })

# Count total users
db.users.countDocuments()

# View users by role
db.users.find({ role: "doctor" }).pretty()
```

---

## Quick Reference: Login Credentials

After creating users, you can login with:

**Doctor:**
- Email: `doctor@mediq.com`
- Password: `password123`

**Patient:**
- Email: `patient@mediq.com`
- Password: `password123`

**Nurse:**
- Email: `nurse@mediq.com`
- Password: `password123`

**Admin:**
- Email: `admin@mediq.com`
- Password: `password123`

---

## Troubleshooting

### Database "mediq" not showing in Compass?
1. Make sure backend server is running: `npm run dev`
2. Register at least one user via API
3. Refresh MongoDB Compass (click refresh icon)
4. The database will appear automatically after first user creation

### Can't see user data?
1. Check if server is connected: `GET http://localhost:5000/api/test/db`
2. Verify MongoDB is running: `net start MongoDB` (Windows)
3. Check `.env` file has correct `MONGODB_URI`

### Want to see password?
Passwords are **hashed** (encrypted) for security. You cannot see the original password. This is by design for security.

---

## Visual Guide for MongoDB Compass

```
localhost:27017
├── admin
├── config
├── local
└── mediq  ← Look here!
    ├── users  ← Login details are here!
    ├── patients
    └── wards
```

Click on `mediq` → `users` to see all login credentials!


