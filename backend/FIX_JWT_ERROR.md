# Fix: "secretOrPrivateKey must have a value" Error

## Problem
You're getting this error because the `JWT_SECRET` environment variable is not set in your `.env` file.

## Quick Fix

### Step 1: Create `.env` file in `backend` folder

Create a file named `.env` (not `.env.example`) in the `backend` folder with this content:

```env
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mediq

# JWT Configuration - IMPORTANT: Set a strong secret key
JWT_SECRET=mediq_super_secret_key_2024_change_this_in_production
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Step 2: Restart your backend server

After creating the `.env` file:

1. **Stop** your backend server (Ctrl+C)
2. **Start** it again:
   ```bash
   cd backend
   npm run dev
   ```

### Step 3: Try registering again

Go back to your frontend and try registering the user again. It should work now!

## Important Notes

- **Never commit `.env` to git** - it's already in `.gitignore`
- **Use a strong secret** in production - generate a random string
- **The `.env` file must be in the `backend` folder** (same folder as `server.js`)

## Generate a Strong Secret (Optional)

You can generate a random secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then use that output as your `JWT_SECRET` value.

## Verify It's Working

After creating `.env` and restarting:

1. Check backend console - should NOT show JWT errors
2. Try registering a user - should succeed
3. Check MongoDB - user should appear in `users` collection
