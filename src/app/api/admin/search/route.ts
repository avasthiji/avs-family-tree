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

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const filter = searchParams.get('filter');
    const status = searchParams.get('status'); // 'approved', 'pending', 'all'
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ users: [] });
    }

    await connectDB();

    const searchQuery = query.trim();
    let mongoQuery: any = {};

    // Filter by approval status for admin
    if (status === 'approved') {
      mongoQuery.isApprovedByAdmin = true;
    } else if (status === 'pending') {
      mongoQuery.isApprovedByAdmin = false;
    }
    // 'all' or no status means no filter

    // Build search conditions
    const searchConditions: any[] = [];

    if (!filter || filter === 'all' || filter === 'name') {
      searchConditions.push(
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } }
      );
    }

    if (!filter || filter === 'all' || filter === 'email') {
      searchConditions.push({ email: { $regex: searchQuery, $options: 'i' } });
    }

    if (!filter || filter === 'all' || filter === 'mobile') {
      searchConditions.push({ mobile: { $regex: searchQuery, $options: 'i' } });
    }

    if (!filter || filter === 'all' || filter === 'gothiram') {
      searchConditions.push({ gothiram: { $regex: searchQuery, $options: 'i' } });
    }

    if (!filter || filter === 'all' || filter === 'place') {
      searchConditions.push(
        { nativePlace: { $regex: searchQuery, $options: 'i' } },
        { city: { $regex: searchQuery, $options: 'i' } },
        { state: { $regex: searchQuery, $options: 'i' } },
        { workPlace: { $regex: searchQuery, $options: 'i' } }
      );
    }

    if (searchConditions.length > 0) {
      mongoQuery.$or = searchConditions;
    }

    const users = await User.find(mongoQuery)
      .select('firstName lastName email mobile gothiram nativePlace city state workPlace profilePicture gender role isApprovedByAdmin isEmailVerified isMobileVerified enableMarriageFlag createdAt')
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      users,
      count: users.length,
      query: searchQuery
    });

  } catch (error) {
    console.error("Admin search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

