# MongoDB Setup Guide for MedIQ

## Quick Setup Steps

### 1. Install MongoDB (if not installed)

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Install MongoDB Community Edition
- MongoDB usually runs as a Windows service automatically

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Check if MongoDB is Running

**Windows:**
```powershell
net start MongoDB
# Or check Services: services.msc -> MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl status mongod
# Or
ps aux | grep mongod
```

### 3. Create .env File

In the `backend` folder, create a `.env` file:

```env
PORT=5000
NODE_ENV=development

# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/mediq

# OR MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mediq

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

### 4. Test MongoDB Connection

```bash
cd backend
npm run test:db
```

This will:
- Test MongoDB connection
- Show database info
- Display user count
- List sample users if any exist

### 5. Start the Server

```bash
npm install  # First time only
npm run dev
```

You should see:
```
✅ Connected to MongoDB
📊 Database: mediq
🚀 Server running on port 5000
```

## Viewing Data in MongoDB

### Option 1: MongoDB Compass (GUI Tool)
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `mediq`
4. View collections: `users`, `patients`, `wards`

### Option 2: MongoDB Shell (Command Line)
```bash
# Open MongoDB shell
mongosh

# Or older version
mongo

# Switch to database
use mediq

# View all users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Find specific user
db.users.findOne({ email: "user@example.com" })
```

### Option 3: Test API Endpoints

After starting the server, test these endpoints:

**Check Database Status:**
```bash
GET http://localhost:5000/api/test/db
```

**View All Users:**
```bash
GET http://localhost:5000/api/test/users
```

**Register a Test User:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "role": "patient",
  "firstName": "Test",
  "lastName": "User"
}
```

**Login:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

## Troubleshooting

### MongoDB Not Starting

**Windows:**
```powershell
# Check if service exists
Get-Service MongoDB

# Start service
net start MongoDB

# Check logs
# Usually in: C:\Program Files\MongoDB\Server\7.0\log\mongod.log
```

**Mac/Linux:**
```bash
# Check status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Connection Refused Error

1. **Check if MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl status mongod
   ```

2. **Check MongoDB port (default: 27017):**
   ```bash
   # Windows
   netstat -an | findstr 27017
   
   # Mac/Linux
   netstat -an | grep 27017
   ```

3. **Verify connection string in .env:**
   - Local: `mongodb://localhost:27017/mediq`
   - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/mediq`

### Can't See Login Data

1. **Check if users exist:**
   ```bash
   npm run test:db
   ```

2. **Register a test user via API:**
   ```bash
   POST http://localhost:5000/api/auth/register
   ```

3. **Check MongoDB directly:**
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Navigate to `mediq` database
   - Check `users` collection

## MongoDB Atlas (Cloud) Setup

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mediq
   ```
6. Add your IP to whitelist in Atlas dashboard

## Common Commands

```bash
# View all databases
show dbs

# Use database
use mediq

# View collections
show collections

# View all users
db.users.find().pretty()

# Count documents
db.users.countDocuments()

# Find user by email
db.users.findOne({ email: "test@example.com" })

# Delete all users (careful!)
db.users.deleteMany({})
```

