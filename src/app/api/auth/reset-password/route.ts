import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import OTP from '@/models/OTP';
import { isOTPExpired } from '@/lib/otp';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { identifier, otp, newPassword } = await request.json();

    // Validate input
    if (!identifier || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the most recent unused OTP for this identifier
    const otpRecord = await OTP.findOne({
      identifier,
      purpose: 'reset-password',
      isUsed: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (isOTPExpired(otpRecord.expiresAt)) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if maximum attempts exceeded
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: 'Maximum OTP attempts exceeded. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();

      const remainingAttempts = 3 - otpRecord.attempts;
      return NextResponse.json(
        { 
          error: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
          remainingAttempts
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne(
      otpRecord.type === 'email' 
        ? { email: identifier } 
        : { mobile: identifier }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Delete all other unused OTPs for this identifier
    await OTP.deleteMany({
      identifier,
      purpose: 'reset-password',
      isUsed: false,
      _id: { $ne: otpRecord._id }
    });

    return NextResponse.json(
      {
        message: 'Password reset successfully. You can now login with your new password.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}

