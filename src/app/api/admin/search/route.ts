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
    const isAdvanced = searchParams.get('advanced') === 'true';
    const status = searchParams.get('status'); // 'approved', 'pending', 'all'
    const limit = parseInt(searchParams.get('limit') || '50');

    await connectDB();

    let mongoQuery: any = {};

    // Filter by approval status for admin
    if (status === 'approved') {
      mongoQuery.isApprovedByAdmin = true;
    }
    // 'all' or no status means no filter (includes both approved and pending)

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
        const nameParts = nameQuery.split(/\s+/);
        
        const nameConditions: any[] = [];
        
        if (nameParts.length >= 2) {
          // Full name search: "Neetu Rao" -> firstName: "Neetu" AND lastName: "Rao"
          const [firstPart, ...restParts] = nameParts;
          const lastPart = restParts.join(' ');
          
          nameConditions.push(
            // Match first name with first part AND last name with rest
            {
              $and: [
                { firstName: { $regex: firstPart, $options: 'i' } },
                { lastName: { $regex: lastPart, $options: 'i' } }
              ]
            },
            // Also search the full query in either field
            { firstName: { $regex: nameQuery, $options: 'i' } },
            { lastName: { $regex: nameQuery, $options: 'i' } }
          );
        } else {
          // Single word search
          nameConditions.push(
            { firstName: { $regex: nameQuery, $options: 'i' } },
            { lastName: { $regex: nameQuery, $options: 'i' } }
          );
        }
        
        advancedConditions.push({
          $or: nameConditions
        });
      }

      if (nativePlace && nativePlace.trim().length >= 2) {
        advancedConditions.push({
          nativePlace: { $regex: nativePlace.trim(), $options: 'i' }
        });
      }

      if (gothiram && gothiram.trim()) {
        // Remove exact match requirement - allow partial matches for gothiram
        advancedConditions.push({
          gothiram: { $regex: gothiram.trim(), $options: 'i' }
        });
      }

      if (advancedConditions.length > 0) {
        mongoQuery.$and = advancedConditions;
      }

    } else {
      // Quick Search - OR logic (original behavior)
      const query = searchParams.get('q');
      const filter = searchParams.get('filter');

      if (!query || query.trim().length < 2) {
        return NextResponse.json({ users: [] });
      }

      const searchQuery = query.trim();
      const searchConditions: any[] = [];

      if (!filter || filter === 'all' || filter === 'name') {
        // Check if query contains a space (full name search)
        const nameParts = searchQuery.split(/\s+/);
        
        if (nameParts.length >= 2) {
          // Full name search: "Neetu Rao" -> firstName: "Neetu" AND lastName: "Rao"
          const [firstPart, ...restParts] = nameParts;
          const lastPart = restParts.join(' ');
          
          searchConditions.push(
            // Match first name with first part AND last name with rest
            {
              $and: [
                { firstName: { $regex: firstPart, $options: 'i' } },
                { lastName: { $regex: lastPart, $options: 'i' } }
              ]
            },
            // Also search each part individually in first or last name
            { firstName: { $regex: searchQuery, $options: 'i' } },
            { lastName: { $regex: searchQuery, $options: 'i' } },
            { firstName: { $regex: firstPart, $options: 'i' } },
            { lastName: { $regex: lastPart, $options: 'i' } }
          );
        } else {
          // Single word search - original behavior
          searchConditions.push(
            { firstName: { $regex: searchQuery, $options: 'i' } },
            { lastName: { $regex: searchQuery, $options: 'i' } }
          );
        }
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
    }

    const users = await User.find(mongoQuery)
      .select('firstName lastName email mobile gothiram nativePlace city state workPlace profilePicture gender role isApprovedByAdmin isEmailVerified isMobileVerified enableMarriageFlag createdAt')
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      users,
      count: users.length
    });

  } catch (error) {
    console.error("Admin search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

