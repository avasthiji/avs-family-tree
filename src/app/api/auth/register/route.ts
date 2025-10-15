import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";
import { generateOTP, isValidEmail } from "@/lib/otp";
import { sendEmail, generateOTPEmailTemplate } from "@/lib/email";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "First name, last name, email, and password are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
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
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate and send OTP
    const otpCode = generateOTP();
    
    // Store OTP in database
    const otp = new OTP({
      identifier: email,
      otp: otpCode,
      type: 'email',
      purpose: 'registration'
    });

    await otp.save();

    // Send OTP via email
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

    return NextResponse.json({
      message: "User registered successfully. Please verify your OTP.",
      userId: user._id,
      verificationRequired: true,
      identifier: email,
      type: 'email',
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
