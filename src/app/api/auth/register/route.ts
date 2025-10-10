import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";
import { generateOTP, isValidEmail, isValidMobile } from "@/lib/otp";
import { sendEmail, generateOTPEmailTemplate } from "@/lib/email";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, mobile, password } = body;

    // Validation
    if (!firstName || !lastName || !password) {
      return NextResponse.json(
        { error: "First name, last name, and password are required" },
        { status: 400 }
      );
    }

    if (!email && !mobile) {
      return NextResponse.json(
        { error: "Either email or mobile number is required" },
        { status: 400 }
      );
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (mobile && !isValidMobile(mobile)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(mobile ? [{ mobile }] : [])
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or mobile number already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email: email || undefined,
      mobile: mobile || undefined,
      password: hashedPassword,
    });

    await user.save();

    // Generate and send OTP
    const otpCode = generateOTP();
    
    // Store OTP in database
    const otp = new OTP({
      identifier: email || mobile!,
      otp: otpCode,
      type: email ? 'email' : 'mobile',
      purpose: 'registration'
    });

    await otp.save();

    // Send OTP via email (if email provided)
    if (email) {
      try {
        await sendEmail({
          to: email,
          subject: "AVS Family Tree - OTP Verification",
          html: generateOTPEmailTemplate(otpCode, 'registration')
        });
      } catch (error) {
        console.error("Email sending failed (non-blocking):", error);
        // Don't fail registration if email fails in development
      }
    }

    // In development mode, log the OTP for easy testing
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 [DEV MODE] OTP for', email || mobile, ':', otpCode);
    }

    return NextResponse.json({
      message: "User registered successfully. Please verify your OTP.",
      userId: user._id,
      verificationRequired: true,
      identifier: email || mobile,
      type: email ? 'email' : 'mobile',
      // Include OTP in response for development only
      ...(process.env.NODE_ENV === 'development' && { devOtp: otpCode })
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
