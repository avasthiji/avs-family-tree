# Development Notes

## 🔐 OTP for Local Development

In development mode, the system uses a **hardcoded OTP** to make testing easier:

### Default OTP: `123456`

This works for:
- ✅ User Registration
- ✅ Email Verification
- ✅ Mobile Verification  
- ✅ Password Reset
- ✅ OTP Resend

### How It Works

1. **Registration Flow:**
   - Register a new user with email/mobile
   - System returns the OTP in the response (dev mode only)
   - Check browser console or server logs for OTP
   - Use **`123456`** to verify

2. **Email Sending:**
   - Emails are **NOT sent** in development mode
   - Console logs show what would have been sent
   - Look for: `📧 [DEV MODE] Email skipped`

3. **OTP Logging:**
   - Server console shows: `🔐 [DEV MODE] OTP for [email]: 123456`
   - Response includes `devOtp` field (dev mode only)

### Example Console Output

```
📧 [DEV MODE] Email skipped - Would send to: user@example.com
📧 [DEV MODE] Subject: AVS Family Tree - OTP Verification
🔐 [DEV MODE] OTP for user@example.com : 123456
```

### Testing Registration

```bash
# Register a new user
POST http://localhost:3000/api/auth/register
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "password123"
}

# Response includes (dev mode only):
{
  "message": "User registered successfully. Please verify your OTP.",
  "userId": "...",
  "devOtp": "123456"  // ← Use this OTP
}

# Verify OTP
POST http://localhost:3000/api/auth/verify-otp
{
  "identifier": "test@example.com",
  "otp": "123456",
  "type": "email"
}
```

## 📝 Production Mode

In production (`NODE_ENV=production`):
- ✅ Real OTPs are generated (6-digit random numbers)
- ✅ Emails are sent via configured SMTP
- ❌ OTP is NOT included in API responses
- ❌ OTP is NOT logged to console

## 🔧 Environment Variables

For **local development**, you can skip email configuration:

```env
# .env.local
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/avs-family-tree
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this

# Email (optional for development)
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-app-password
# EMAIL_FROM=noreply@avs-family-tree.com
```

For **production**, configure proper email credentials:

```env
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@avs-family-tree.com
```

## 🎯 Quick Test Workflow

1. Start the dev server: `npm run dev`
2. Register a new user via the UI or API
3. Check the server console for the OTP log
4. Use `123456` to verify
5. Done! ✨

## 🚨 Important Security Notes

- **NEVER** use hardcoded OTPs in production
- **ALWAYS** set `NODE_ENV=production` in production
- **ALWAYS** use real email credentials in production
- The hardcoded OTP feature is **ONLY** for development convenience

