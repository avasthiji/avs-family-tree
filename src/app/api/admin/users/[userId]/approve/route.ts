import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = await params;
    await connectDB();

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    user.isApprovedByAdmin = true;
    user.approvedBy = session.user.id;
    user.approvedAt = new Date();
    await user.save();

    return NextResponse.json({
      message: "User approved successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        isApprovedByAdmin: user.isApprovedByAdmin
      }
    });

  } catch (error) {
    console.error("User approval error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
