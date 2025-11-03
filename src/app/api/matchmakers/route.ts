import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch all users with role "avsMatchMaker" who are approved by admin
    const matchmakers = await User.find({
      role: "avsMatchMaker",
      isApprovedByAdmin: true,
      deletedAt: null,
    })
      .select("firstName lastName gothiram nativePlace city profilePicture _id")
      .sort({ firstName: 1, lastName: 1 });

    return NextResponse.json({
      matchmakers,
    });
  } catch (error) {
    console.error("Error fetching matchmakers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

