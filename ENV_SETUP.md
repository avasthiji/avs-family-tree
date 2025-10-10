# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/avs-family-tree

# NextAuth (REQUIRED)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production-min-32-characters

# Email Configuration (Optional - for OTP emails)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@avs-family-tree.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development Mode (set to 'true' for hardcoded OTP = 123456)
NEXT_PUBLIC_USE_TEST_OTP=true
```

## Quick Setup for Development

1. Copy the following into a new file called `.env.local`:

```bash
MONGODB_URI=mongodb://localhost:27017/avs-family-tree
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=avs-family-tree-secret-key-for-development-minimum-32-characters-required
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@avs-family-tree.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_USE_TEST_OTP=true
```

2. **Important**: Replace `NEXTAUTH_SECRET` with a secure random string (minimum 32 characters)
   - You can generate one using: `openssl rand -base64 32`
   - Or use any random string generator

## Development Notes

- **OTP in Development**: With `NEXT_PUBLIC_USE_TEST_OTP=true`, the OTP will always be `123456`
- **Email Configuration**: Email sending is optional in development. If not configured, OTPs will be logged to the console
- **MongoDB**: Make sure MongoDB is running locally or provide a MongoDB Atlas connection string

## Email Setup (Optional)

If you want to test email functionality:

1. Create a Gmail account or use an existing one
2. Enable 2-Factor Authentication
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Use the App Password in `EMAIL_PASSWORD`

## Production Setup

For production, make sure to:

1. Use a strong, randomly generated `NEXTAUTH_SECRET`
2. Set `NEXT_PUBLIC_USE_TEST_OTP=false` to use real OTPs
3. Configure proper email credentials
4. Use a production MongoDB connection string
5. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain

## Troubleshooting

### "Missing required environment variables" error
- Make sure `.env.local` exists in the project root
- Verify all required variables are set
- Restart the development server after adding environment variables

### Login/Register not working
- Check MongoDB is running: `mongosh` or `mongo`
- Verify `NEXTAUTH_SECRET` is at least 32 characters
- Check the console for any error messages

### OTP not received
- Check console logs for the OTP (in development mode)
- Verify email credentials if email sending is configured
- Make sure `NEXT_PUBLIC_USE_TEST_OTP=true` for testing with `123456`

