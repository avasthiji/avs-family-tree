import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { hasAdminPrivileges } from "@/lib/roles";
import mongoose from "mongoose";

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || !hasAdminPrivileges(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { role } = await request.json();

    // Validate role
    if (!['user', 'admin', 'matchmaker', 'profileEndorser', 'avsMatchMaker'].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'user', 'admin', 'matchmaker', 'profileEndorser', or 'avsMatchMaker'" },
        { status: 400 }
      );
    }

    const resolvedParams = await params;
    const userId = resolvedParams.userId;

    // Prevent admin from changing their own role
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot change your own role" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user role
    user.role = role;
    user.updatedBy = new mongoose.Types.ObjectId(session.user.id);
    await user.save();

    return NextResponse.json({ 
      message: `User role updated to ${role}`,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Role update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

