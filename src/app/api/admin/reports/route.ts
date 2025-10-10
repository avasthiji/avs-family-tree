import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Relationship from "@/models/Relationship";

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

    // Get comprehensive statistics
    const [
      totalUsers,
      approvedUsers,
      pendingUsers,
      maleUsers,
      femaleUsers,
      activeMatrimony,
      totalRelationships,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isApprovedByAdmin: true }),
      User.countDocuments({ isApprovedByAdmin: false }),
      User.countDocuments({ gender: 'Male' }),
      User.countDocuments({ gender: 'Female' }),
      User.countDocuments({ enableMarriageFlag: true, isApprovedByAdmin: true }),
      Relationship.countDocuments(),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        approvedUsers,
        pendingUsers,
        maleUsers,
        femaleUsers,
        activeMatrimony,
        totalRelationships,
      }
    });

  } catch (error) {
    console.error("Reports fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

