import { env } from './env';

// Lazy-load nodemailer only when needed
let transporter: any = null;

function getTransporter() {
  if (!transporter) {
    // Only import and create transporter when actually needed
    const nodemailer = require('nodemailer');
    transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD
      }
    });
  }
  return transporter;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Skip email sending in development mode
  if (process.env.NODE_ENV === 'development' || !env.EMAIL_USER || !env.EMAIL_PASSWORD) {
    console.log('📧 [DEV MODE] Email skipped - Would send to:', options.to);
    console.log('📧 [DEV MODE] Subject:', options.subject);
    return true; // Return true to not block registration
  }

  try {
    const mailTransporter = getTransporter();
    const mailOptions = {
      from: env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const result = await mailTransporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateOTPEmailTemplate(otp: string, purpose: string): string {
  const purposeText = purpose === 'registration' ? 'registration' : 
                     purpose === 'login' ? 'login' : 'password reset';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AVS Family Tree - OTP Verification</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #E63946, #F77F00);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .content {
          padding: 40px 30px;
        }
        .otp-box {
          background: linear-gradient(135deg, #2A9D8F, #4361EE);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 10px 0;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AVS Family Tree</h1>
          <p>அகில இந்திய வேளாளர் சங்கம்</p>
        </div>
        
        <div class="content">
          <h2>OTP Verification</h2>
          <p>Dear User,</p>
          <p>Thank you for ${purposeText} with AVS Family Tree. Please use the following One-Time Password (OTP) to complete your ${purposeText}:</p>
          
          <div class="otp-box">
            <p style="margin: 0 0 10px 0;">Your OTP Code:</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Valid for 5 minutes</p>
          </div>
          
          <div class="warning">
            <strong>Important:</strong> This OTP is valid for 5 minutes only. Do not share this code with anyone. AVS Family Tree will never ask for your OTP via phone or email.
          </div>
          
          <p>If you didn't request this ${purposeText}, please ignore this email.</p>
          
          <p>Best regards,<br>AVS Family Tree Team</p>
        </div>
        
        <div class="footer">
          <p>&copy; 2024 AVS Family Tree. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateWelcomeEmailTemplate(firstName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to AVS Family Tree</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #E63946, #F77F00);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .content {
          padding: 40px 30px;
        }
        .feature-box {
          background: linear-gradient(135deg, #2A9D8F, #4361EE);
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to AVS Family Tree</h1>
          <p>அகில இந்திய வேளாளர் சங்கம்</p>
        </div>
        
        <div class="content">
          <h2>Welcome ${firstName}!</h2>
          <p>Congratulations on successfully registering with AVS Family Tree! We're excited to have you join our community.</p>
          
          <div class="feature-box">
            <h3 style="margin-top: 0;">What's Next?</h3>
            <ul style="text-align: left;">
              <li>Complete your profile to get started</li>
              <li>Search for family members and relatives</li>
              <li>Build your family tree</li>
              <li>Connect with the AVS community</li>
              <li>Explore matrimony services (if enabled)</li>
            </ul>
          </div>
          
          <p><strong>Important:</strong> Your account is currently pending admin approval. Once approved, you'll have full access to all features.</p>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <p>Welcome to the AVS family!</p>
          
          <p>Best regards,<br>AVS Family Tree Team</p>
        </div>
        
        <div class="footer">
          <p>&copy; 2024 AVS Family Tree. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
