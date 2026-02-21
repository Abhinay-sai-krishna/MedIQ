# Ngrok Setup Guide for Vite + React

## Problem
When accessing your Vite app through ngrok, you get a **403 Forbidden** error:
```
Blocked request. This host is not allowed. Add the ngrok host to server.allowedHosts in vite.config.js.
```

## Why This Happens
Vite has a security feature that blocks requests from hosts not in the allowed list. This prevents DNS rebinding attacks. When you use ngrok, the request comes from a different host (e.g., `xxxx.ngrok-free.app`) than your local development server (`localhost`), so Vite blocks it.

## Solution

### Option 1: Allow All Hosts (Recommended for Hackathon/Demo)
**Use this for quick demos and hackathons where security is less critical.**

The `vite.config.js` is already configured with:
```javascript
allowedHosts: ['all']
```

This allows access from any host, including ngrok URLs.

### Option 2: Allow Specific Ngrok Host (More Secure)
**Use this for production or when you want more control.**

1. Get your ngrok URL (e.g., `abc123.ngrok-free.app`)
2. Update `vite.config.js`:
```javascript
allowedHosts: [
  'localhost',
  '127.0.0.1',
  '.ngrok-free.app',  // Allows any ngrok subdomain
  '.ngrok.io',        // Legacy ngrok domains
  'abc123.ngrok-free.app'  // Your specific ngrok URL
]
```

## Steps to Use Ngrok

1. **Start your Vite dev server:**
   ```bash
   cd my-react-app
   npm run dev
   ```

2. **In a new terminal, start ngrok:**
   ```bash
   ngrok http 5173
   ```
   (Replace `5173` with your Vite port if different)

3. **Copy the ngrok URL** (e.g., `https://abc123.ngrok-free.app`)

4. **Access your app** via the ngrok URL in your browser

## Important Notes

⚠️ **After changing `vite.config.js`, you MUST restart your Vite dev server:**
- Stop the server (Ctrl+C)
- Start it again: `npm run dev`

⚠️ **Security Warning:**
- `allowedHosts: ['all']` is convenient but less secure
- Only use it for development, demos, or hackathons
- For production, use specific host allowlists

## Troubleshooting

- **Still getting 403?** → Restart your Vite dev server
- **Connection refused?** → Make sure Vite is running on the correct port
- **ngrok shows "502 Bad Gateway"?** → Check that Vite is running and accessible on localhost
