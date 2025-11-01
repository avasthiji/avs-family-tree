import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Relationship from "@/models/Relationship";
import Event from "@/models/Event";
import { hasAdminPrivileges } from "@/lib/roles";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !hasAdminPrivileges(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const [
      totalUsers,
      pendingApprovals,
      approvedUsers,
      activeMatrimony,
      totalRelationships,
      totalEvents
    ] = await Promise.all([
      User.countDocuments({ deletedAt: null }),
      User.countDocuments({ isApprovedByAdmin: false, deletedAt: null }),
      User.countDocuments({ isApprovedByAdmin: true, deletedAt: null }),
      User.countDocuments({ enableMarriageFlag: true, isApprovedByAdmin: true, deletedAt: null }),
      Relationship.countDocuments(),
      Event.countDocuments()
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        pendingApprovals,
        approvedUsers,
        activeMatrimony,
        totalRelationships,
        totalEvents
      }
    });

  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
