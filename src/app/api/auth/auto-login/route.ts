import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { autoLoginToken } = body;

    if (!autoLoginToken) {
      return NextResponse.json(
        { error: "Auto-login token is required" },
        { status: 400 }
      );
    }

    // Decode the token
    let tokenData;
    try {
      const decodedString = Buffer.from(autoLoginToken, 'base64').toString('utf-8');
      tokenData = JSON.parse(decodedString);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid auto-login token" },
        { status: 400 }
      );
    }

    // Check if token is recent (within 5 minutes)
    const tokenAge = Date.now() - tokenData.timestamp;
    if (tokenAge > 5 * 60 * 1000) {
      return NextResponse.json(
        { error: "Auto-login token has expired" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify user exists and is verified
    const user = await User.findById(tokenData.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has verified their email or mobile
    if (!user.isEmailVerified && !user.isMobileVerified) {
      return NextResponse.json(
        { error: "Please verify your account first" },
        { status: 400 }
      );
    }

    // Return user data for client-side session creation
    return NextResponse.json({
      success: true,
      message: "Auto-login successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        mobile: user.mobile,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isApprovedByAdmin: user.isApprovedByAdmin,
        isEmailVerified: user.isEmailVerified,
        isMobileVerified: user.isMobileVerified,
      },
      // Return credentials for NextAuth sign-in
      credentials: {
        identifier: user.email || user.mobile,
        userId: user._id.toString(),
      }
    });

  } catch (error) {
    console.error("Auto-login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

