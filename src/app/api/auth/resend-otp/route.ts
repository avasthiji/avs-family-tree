import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import OTP from "@/models/OTP";
import { generateOTP } from "@/lib/otp";
import { sendEmail, generateOTPEmailTemplate } from "@/lib/email";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, type, purpose = 'registration' } = body;

    // Validation
    if (!identifier || !type) {
      return NextResponse.json(
        { error: "Identifier and type are required" },
        { status: 400 }
      );
    }

    if (!['email', 'mobile'].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'email' or 'mobile'" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check rate limiting - max 3 OTP requests per hour per identifier
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOTPs = await OTP.countDocuments({
      identifier,
      type,
      createdAt: { $gte: oneHourAgo }
    });

    if (recentOTPs >= 3) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please try again after 1 hour." },
        { status: 429 }
      );
    }

    // Delete any existing unused OTPs for this identifier
    await OTP.deleteMany({
      identifier,
      type,
      purpose,
      isUsed: false
    });

    // Generate new OTP
    const otpCode = generateOTP();
    
    // Store OTP in database
    const otp = new OTP({
      identifier,
      otp: otpCode,
      type,
      purpose
    });

    await otp.save();

    // Send OTP via email (if type is email)
    if (type === 'email') {
      try {
        await sendEmail({
          to: identifier,
          subject: "AVS Family Tree - OTP Verification",
          html: generateOTPEmailTemplate(otpCode, purpose)
        });
      } catch (error) {
        console.error("Email sending failed (non-blocking):", error);
        // Don't fail in development
      }
    }

    // In development mode, log the OTP for easy testing
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 [DEV MODE] Resent OTP for', identifier, ':', otpCode);
    }

    return NextResponse.json({
      message: "OTP sent successfully",
      identifier,
      type,
      // Include OTP in response for development only
      ...(process.env.NODE_ENV === 'development' && { devOtp: otpCode })
    });

  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
