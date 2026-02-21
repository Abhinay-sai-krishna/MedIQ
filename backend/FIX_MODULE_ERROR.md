# Fix: ERR_MODULE_NOT_FOUND Error

## Problem
You're seeing an error like:
```
Error: Cannot find module '...'
ERR_MODULE_NOT_FOUND
```

## Solution

### Step 1: Install Dependencies
The Twilio package and other dependencies need to be installed:

```bash
cd backend
npm install
```

This will install:
- `twilio` - SMS service
- All other required packages

### Step 2: Restart the Server
After installing dependencies, restart your server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Verify Installation
Check that Twilio is installed:

```bash
# Windows PowerShell
Test-Path node_modules/twilio

# Should return: True
```

## Common Causes

1. **Missing npm install**: Dependencies weren't installed after adding Twilio
2. **Server running during install**: Server needs restart after npm install
3. **Node modules corrupted**: Delete `node_modules` and reinstall

## If Still Not Working

### Option 1: Clean Install
```bash
cd backend
rm -rf node_modules package-lock.json  # Linux/Mac
# OR
Remove-Item -Recurse -Force node_modules, package-lock.json  # Windows PowerShell

npm install
npm run dev
```

### Option 2: Check Node Version
Make sure you're using Node.js 16+:
```bash
node --version
```

### Option 3: Verify File Structure
Ensure these files exist:
- ✅ `backend/services/smsService.js`
- ✅ `backend/services/alertService.js`
- ✅ `backend/routes/test.routes.js`

## Expected Output After Fix

When the server starts successfully, you should see:
```
✅ Connected to MongoDB
✅ Twilio SMS service initialized  (or warning if not configured)
🚀 Server running on port 5000
```

---

**Note**: If Twilio credentials are not in `.env`, you'll see a warning but the server will still start. SMS features will be disabled until credentials are added.
