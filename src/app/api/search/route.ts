import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const isAdvanced = searchParams.get('advanced') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    await connectDB();

    let mongoQuery: any = {
      isApprovedByAdmin: true, // Only show approved users (never show pending users to regular users)
      _id: { $ne: session.user.id } // Exclude self from results
    };

    if (isAdvanced) {
      // Advanced Search - AND logic for multiple fields
      const name = searchParams.get('name');
      const nativePlace = searchParams.get('nativePlace');
      const gothiram = searchParams.get('gothiram');

      // Check if at least one field is provided
      if (!name && !nativePlace && !gothiram) {
        return NextResponse.json({ users: [] });
      }

      const advancedConditions: any[] = [];

      if (name && name.trim().length >= 2) {
        const nameQuery = name.trim();
        advancedConditions.push({
          $or: [
            { firstName: { $regex: nameQuery, $options: 'i' } },
            { lastName: { $regex: nameQuery, $options: 'i' } }
          ]
        });
      }

      if (nativePlace && nativePlace.trim().length >= 2) {
        advancedConditions.push({
          nativePlace: { $regex: nativePlace.trim(), $options: 'i' }
        });
      }

      if (gothiram && gothiram.trim()) {
        advancedConditions.push({
          gothiram: { $regex: `^${gothiram.trim()}$`, $options: 'i' }
        });
      }

      if (advancedConditions.length > 0) {
        mongoQuery.$and = advancedConditions;
      }

    } else {
      // Quick Search - OR logic (original behavior)
      const query = searchParams.get('q');
      const filter = searchParams.get('filter'); // 'name', 'gothiram', 'place', 'all'

      if (!query || query.trim().length < 2) {
        return NextResponse.json({ users: [] });
      }

      const searchQuery = query.trim();
      const searchConditions: any[] = [];

      if (!filter || filter === 'all' || filter === 'name') {
        searchConditions.push(
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } }
        );
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
    }

    const users = await User.find(mongoQuery)
      .select('firstName lastName email mobile gothiram nativePlace city state workPlace profilePicture gender enableMarriageFlag')
      .limit(limit)
      .sort({ firstName: 1, lastName: 1 });

    return NextResponse.json({ 
      users,
      count: users.length
    });

  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

