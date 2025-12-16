# Email Setup Guide for AVS Family Tree

This guide will help you configure Gmail to send real emails from your AVS Family Tree application.

## Prerequisites

- A Gmail account
- Access to your Google Account settings

## Step 1: Enable 2-Step Verification

Before you can create an App Password, you need to enable 2-Step Verification on your Gmail account.

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** section
3. Under "How you sign in to Google", select **2-Step Verification**
4. Follow the prompts to enable 2-Step Verification

## Step 2: Generate Gmail App Password

Gmail App Passwords are 16-character codes that allow less secure apps to access your Gmail account.

1. Go to your Google Account: https://myaccount.google.com/
2. Select **Security**
3. Under "How you sign in to Google", select **2-Step Verification**
4. At the bottom, select **App passwords**
5. You may need to sign in again
6. At the bottom, choose **Select app** and choose "Mail"
7. Choose **Select device** and choose "Other (Custom name)"
8. Enter "AVS Family Tree" and click **Generate**
9. Google will generate a 16-character password
10. **Copy this password** - you'll need it for your `.env.local` file

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Update the following variables:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # Your 16-character app password from Step 2
EMAIL_FROM=AVS Family Tree <your-actual-email@gmail.com>

# Set NODE_ENV to production to enable email sending
NODE_ENV=production
```

**Important Notes:**

- Replace `your-actual-email@gmail.com` with your actual Gmail address
- Replace `abcd efgh ijkl mnop` with the 16-character App Password from Step 2
- The App Password may have spaces - you can include them or remove them
- Set `NODE_ENV=production` to enable real email sending

## Step 4: Test Email Configuration

After updating `.env.local`, restart your development server:

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

Then try registering a new user to test if emails are being sent.

#Step 5: Monitor Email Sending

Check your terminal/console for email sending logs:

- Success: `Email sent successfully`
- Failure: `Email sending failed` with error details

## Troubleshooting

### "Invalid login" error

- Make sure you've enabled 2-Step Verification
- Verify the App Password is correct (no typos)
- Ensure you're using the App Password, not your Gmail password

### "Less secure app" error

- Use App Password instead of your regular Gmail password
- App Passwords bypass this security check

### Emails not being sent in development

- Check that `NODE_ENV=production` in `.env.local`
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` are set correctly

### Gmail blocks emails

- Gmail may temporarily block your account if it detects unusual activity
- Check your Gmail account for security alerts
- You may need to verify it's you sending the emails

## Development vs Production

### Development Mode (NODE_ENV=development)

- Emails are NOT actually sent
- Registration still works (emails are mocked)
- Useful for testing without email setup

### Production Mode (NODE_ENV=production)

- Emails ARE sent for real
- Requires valid Gmail credentials
- Users receive actual OTP emails

## Alternative: Using SendGrid or Other Email Services

If you prefer to use SendGrid, Mailgun, or other email services instead of Gmail:

1. Update `src/lib/email.ts` to use the appropriate service
2. Replace the Gmail transporter configuration
3. Update environment variables accordingly

Example for SendGrid:

```typescript
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

transporter = nodemailer.createTransporter(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);
```

## Security Best Practices

1. **Never commit** `.env.local` to Git (it's in `.gitignore`)
2. **Never share** your App Password
3. **Rotate** App Passwords regularly
4. **Revoke** unused App Passwords from Google Account settings
5. **Use different** App Passwords for different applications
6. **Monitor** your Google Account activity regularly

## Email Templates

The application uses two email templates:

1. **OTP Email** - Sent during registration/login
2. **Welcome Email** - Sent after successful registration

You can customize these templates in `src/lib/email.ts`:

- `generateOTPEmailTemplate()`
- `generateWelcomeEmailTemplate()`

## Production Deployment

For production deployment (Vercel, Netlify, etc.):

1. Add environment variables in your hosting platform's dashboard
2. Never commit `.env.local` or `.env.production`
3. Use platform-specific secrets management
4. Consider using a dedicated email service for production

## Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a simple nodemailer script first
4. Check Gmail security settings and activity

---

**Last Updated:** October 2025
**AVS Family Tree** - அகில இந்திய வேளாளர் சங்கம்
