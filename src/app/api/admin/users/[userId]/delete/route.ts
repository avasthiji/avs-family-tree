import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Relationship from "@/models/Relationship";
import Event from "@/models/Event";
import { hasAdminPrivileges } from "@/lib/roles";

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

    const { userId } = await params;
    await connectDB();

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Store user info for response before deletion
    const userInfo = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName
    };

    // 1. Delete all relationships where user is involved
    await Relationship.deleteMany({
      $or: [
        { personId1: userId },
        { personId2: userId }
      ]
    });

    // 2. Nullify user references in remaining relationships (approvedBy, createdBy, updatedBy)
    await Relationship.updateMany(
      { approvedBy: userId },
      { $set: { approvedBy: null } }
    );
    await Relationship.updateMany(
      { createdBy: userId },
      { $set: { createdBy: null } }
    );
    await Relationship.updateMany(
      { updatedBy: userId },
      { $set: { updatedBy: null } }
    );

    // 3. Delete events organized by the user
    await Event.deleteMany({ organizer: userId });

    // 4. Remove user from event attendees
    await Event.updateMany(
      { attendees: userId },
      { $pull: { attendees: userId } }
    );

    // 5. Nullify user references in other users (approvedBy, matchMakerId, createdBy, updatedBy)
    await User.updateMany(
      { approvedBy: userId },
      { $set: { approvedBy: null } }
    );
    await User.updateMany(
      { matchMakerId: userId },
      { $set: { matchMakerId: null } }
    );
    await User.updateMany(
      { createdBy: userId },
      { $set: { createdBy: null } }
    );
    await User.updateMany(
      { updatedBy: userId },
      { $set: { updatedBy: null } }
    );

    // 6. Finally, hard delete the user from the database
    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      message: "User permanently deleted and all references removed successfully",
      user: userInfo
    });

  } catch (error) {
    console.error("User deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

