import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status"); // 'all', 'approved', 'pending'
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";

    let query: any = {};

    // Always exclude deleted users unless explicitly requested
    query.deletedAt = null;

    // Filter by status
    if (status === "approved") {
      query.isApprovedByAdmin = true;
    } else if (status === "pending") {
      query.isApprovedByAdmin = false;
    }
    // For 'all', show both approved and pending users (but not deleted ones)

    // Search functionality
    if (search) {
      const searchTerms = search.trim().split(/\s+/);
      // Escape special regex characters for email/mobile search
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      if (searchTerms.length > 1) {
        // Multi-word search (e.g., "amit sharma")
        // Create conditions for full name match
        query.$or = [
          // Match all words in firstName or lastName
          {
            $and: searchTerms.map((term) => ({
              $or: [
                { firstName: { $regex: term, $options: "i" } },
                { lastName: { $regex: term, $options: "i" } },
              ],
            })),
          },
          // Also check email and mobile (with escaped regex for special chars)
          { email: { $regex: escapedSearch, $options: "i" } },
          { mobile: { $regex: escapedSearch, $options: "i" } },
        ];
      } else {
        // Single word search
        query.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: escapedSearch, $options: "i" } },
          { mobile: { $regex: escapedSearch, $options: "i" } },
        ];
      }
    }

    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      User.find(query)
        .select(
          "firstName lastName email mobile role isEmailVerified isMobileVerified isApprovedByAdmin enableMarriageFlag createdAt gothiram nativePlace city approvedBy deletedAt"
        )
        .populate("approvedBy", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalUsers: totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
