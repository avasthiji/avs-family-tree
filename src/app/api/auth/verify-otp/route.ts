import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";
import { isOTPExpired } from "@/lib/otp";
import { sendEmail, generateWelcomeEmailTemplate } from "@/lib/email";
import { signIn } from "@/lib/auth";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, otp, identifier, type } = body;

    // Validation
    if (!userId || !otp || !identifier || !type) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "OTP must be exactly 6 digits" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      identifier,
      type,
      purpose: 'registration'
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid OTP or OTP not found" },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.expiresAt)) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if OTP is already used
    if (otpRecord.isUsed) {
      return NextResponse.json(
        { error: "OTP has already been used" },
        { status: 400 }
      );
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: "Maximum attempts exceeded. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      
      return NextResponse.json(
        { error: `Invalid OTP. ${3 - otpRecord.attempts} attempts remaining.` },
        { status: 400 }
      );
    }

    // OTP is valid - mark as used and update user
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Update user verification status
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Mark email or mobile as verified
    if (type === 'email') {
      user.isEmailVerified = true;
    } else {
      user.isMobileVerified = true;
    }

    await user.save();

    // Send welcome email if email was verified
    if (type === 'email' && user.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: "Welcome to AVS Family Tree!",
          html: generateWelcomeEmailTemplate(user.firstName)
        });
      } catch (error) {
        console.error("Welcome email failed (non-blocking):", error);
      }
    }

    // Auto-login: Create credentials for sign-in
    // Generate a temporary token for auto-login
    const autoLoginToken = Buffer.from(JSON.stringify({
      identifier: user.email || user.mobile,
      userId: user._id.toString(),
      timestamp: Date.now()
    })).toString('base64');

    return NextResponse.json({
      message: "OTP verified successfully! Logging you in...",
      verified: true,
      autoLogin: true,
      autoLoginToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        isEmailVerified: user.isEmailVerified,
        isMobileVerified: user.isMobileVerified,
        isApprovedByAdmin: user.isApprovedByAdmin
      }
    });

  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
