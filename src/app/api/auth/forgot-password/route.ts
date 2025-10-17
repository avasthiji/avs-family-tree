import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import OTP from '@/models/OTP';
import { generateOTP, isValidEmail, isValidMobile } from '@/lib/otp';
import { sendEmail, generateOTPEmailTemplate } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json();

    // Validate input
    if (!identifier) {
      return NextResponse.json(
        { error: 'Email or mobile number is required' },
        { status: 400 }
      );
    }

    // Determine if it's email or mobile
    const isEmail = isValidEmail(identifier);
    const isMobile = isValidMobile(identifier);

    if (!isEmail && !isMobile) {
      return NextResponse.json(
        { error: 'Invalid email or mobile number format' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists
    const user = await User.findOne(
      isEmail ? { email: identifier } : { mobile: identifier }
    );

    if (!user) {
      // For security, don't reveal if user exists or not
      return NextResponse.json(
        { 
          message: 'If an account exists with this identifier, an OTP has been sent.',
          type: isEmail ? 'email' : 'mobile'
        },
        { status: 200 }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing unused OTPs for this identifier
    await OTP.deleteMany({
      identifier,
      purpose: 'reset-password',
      isUsed: false
    });

    // Create new OTP (store plain OTP, not hashed - matches existing pattern)
    await OTP.create({
      identifier,
      otp,
      type: isEmail ? 'email' : 'mobile',
      purpose: 'reset-password',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      attempts: 0,
      isUsed: false
    });

    // Send OTP via email or SMS
    if (isEmail) {
      const emailSent = await sendEmail({
        to: identifier,
        subject: 'Password Reset OTP - AVS Family Tree',
        html: generateOTPEmailTemplate(otp, 'password reset'),
        text: `Your OTP for password reset is: ${otp}. Valid for 5 minutes.`
      });

      if (!emailSent) {
        console.error('Failed to send email OTP');
      }
    } else {
      // TODO: Implement SMS sending for mobile
      console.log('SMS OTP (not implemented):', otp, 'for', identifier);
    }

    return NextResponse.json(
      {
        message: 'OTP sent successfully',
        type: isEmail ? 'email' : 'mobile',
        identifier: isEmail 
          ? identifier.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email
          : identifier.replace(/(\d{2})(\d{6})(\d{2})/, '$1******$3') // Mask mobile
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process forgot password request' },
      { status: 500 }
    );
  }
}

