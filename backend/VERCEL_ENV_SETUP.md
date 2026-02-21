# Vercel Production Environment Setup

**Status:** Production backend is currently returning "Database not connected" because environment variables are not set in Vercel.

## Required Environment Variables

The following variables must be added to your Vercel project's **Production** environment:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://kondapalliabhinaysaikrishna_db_user:v5SOC8iCfl9U1lXZ@cluster0.vdlwbss.mongodb.net/mediq?retryWrites=true&w=majority&maxPoolSize=10&serverSelectionTimeoutMS=15000&socketTimeoutMS=45000` |
| `JWT_SECRET` | `mediq_super_secret_key_2024_change_this_in_production_abc123xyz` |
| `FRONTEND_URL` | `https://mediq-delta.vercel.app` |
| `MONGO_BUFFER_TIMEOUT_MS` | `30000` |

## Setup Instructions

### Option 1: Via Vercel Web Dashboard (Recommended)

1. Open https://vercel.com/dashboard
2. Click on the **backend** project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. For each variable above:
   - Enter the **Name** (e.g., `MONGODB_URI`)
   - Enter the **Value**
   - In "Select Environments", choose **Production** only
   - Click **Save**
6. Once all variables are added, click **Deploy** to redeploy the production build

### Option 2: Via Vercel CLI

```bash
# Navigate to backend directory
cd backend

# Add each environment variable
npx vercel env add MONGODB_URI
# When prompted for value, paste: mongodb+srv://kondapalliabhinaysaikrishna_db_user:v5SOC8iCfl9U1lXZ@cluster0.vdlwbss.mongodb.net/mediq?retryWrites=true&w=majority&maxPoolSize=10&serverSelectionTimeoutMS=15000&socketTimeoutMS=45000

npx vercel env add JWT_SECRET
# When prompted, paste: mediq_super_secret_key_2024_change_this_in_production_abc123xyz

npx vercel env add FRONTEND_URL
# When prompted, paste: https://mediq-delta.vercel.app

npx vercel env add MONGO_BUFFER_TIMEOUT_MS
# When prompted, paste: 30000

# Redeploy to production
npx vercel --prod --yes
```

## Verification

After adding environment variables and redeploying, test the production endpoint:

```bash
# This should no longer return "Database not connected"
curl -X POST https://backend-nine-ashen-94.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Pass1234",
    "role": "doctor",
    "firstName": "Test",
    "lastName": "User",
    "phoneNumber": "+15551234567"
  }'
```

If successful, you'll see a response like:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOi...",
  "user": { ... }
}
```

If it still fails, check:
1. Are ALL 4 variables added and scoped to **Production**?
2. Has the production deployment been triggered after adding variables?
3. Is MongoDB Atlas allowing traffic from Vercel's IP ranges?
   - Go to MongoDB Atlas → Network Access
   - Ensure Project IP is listed or use 0.0.0.0/0 temporarily for testing

## Local Testing (Already Working)

Local registration already works and returns "User registered successfully" with a valid token. This confirms the backend code is correct; production just needs the env vars.

