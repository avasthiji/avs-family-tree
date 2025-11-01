import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Relationship from "@/models/Relationship";
import { hasAdminPrivileges } from "@/lib/roles";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !hasAdminPrivileges(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      User.countDocuments({ deletedAt: null }),
      User.countDocuments({ isApprovedByAdmin: true, deletedAt: null }),
      User.countDocuments({ isApprovedByAdmin: false, deletedAt: null }),
      User.countDocuments({ gender: "Male", deletedAt: null }),
      User.countDocuments({ gender: "Female", deletedAt: null }),
      User.countDocuments({
        enableMarriageFlag: true,
        isApprovedByAdmin: true,
        deletedAt: null,
      }),
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
      },
    });
  } catch (error) {
    console.error("Reports fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
