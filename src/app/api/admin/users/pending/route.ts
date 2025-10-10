import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const users = await User.find({ isApprovedByAdmin: false })
      .select('firstName lastName email mobile isEmailVerified isMobileVerified createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ users });

  } catch (error) {
    console.error("Pending users fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
