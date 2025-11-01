import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Gothiram from "@/models/Gothiram";
import { hasAdminPrivileges } from "@/lib/roles";

export const runtime = 'nodejs';

// GET all Gothirams (including inactive - admin only)
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

    const gothirams = await Gothiram.find()
      .sort({ name: 1 })
      .populate('createdBy', 'firstName lastName');

    return NextResponse.json({ gothirams });

  } catch (error) {
    console.error("Admin Gothiram fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

