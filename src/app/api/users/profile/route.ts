import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

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

    await connectDB();

    // Get userId from query params - if not provided, use current user's ID
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.user.id;

    // Return all fields except password for complete profile display
    // In a family tree context, showing full profile details is appropriate
    const user = await User.findById(userId)
      .select('-password')
      .populate('matchMakerId', 'firstName lastName gothiram nativePlace city profilePicture');
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Convert to plain object to ensure all fields are included
    const userObject = user.toObject({ 
      virtuals: false, 
      versionKey: false,
      transform: (_doc: unknown, ret: Record<string, unknown>) => {
        delete ret.password;
        // Rename matchMakerId to matchMaker for frontend consistency
        if (ret.matchMakerId) {
          ret.matchMaker = ret.matchMakerId;
          delete ret.matchMakerId;
        }
        return ret;
      }
    });

    return NextResponse.json({ user: userObject });

  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    await connectDB();

    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update allowed fields
    const allowedFields = [
      'gender', 'dob', 'deathday', 'placeOfBirth', 'timeOfBirth', 'height',
      'rasi', 'natchathiram', 'gothiram', 'primaryPhone', 'secondaryPhone',
      'qualification', 'jobDesc', 'salary', 'bioDesc', 'partnerDesc',
      'workPlace', 'nativePlace', 'address1', 'address2', 'city', 'state',
      'country', 'postalCode', 'citizenship', 'kuladeivam', 'enableMarriageFlag',
      'matchMakerId', 'profilePicture'
    ];

    const oldMatchMakerId = user.matchMakerId?.toString();

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        // Handle empty string, null, or undefined as undefined for matchMakerId
        if (field === 'matchMakerId') {
          if (body[field] === '' || body[field] === null || body[field] === undefined) {
            (user as any)[field] = undefined;
          } else {
            (user as any)[field] = body[field];
          }
        } else {
          (user as any)[field] = body[field];
        }
      }
    });

    // Update matchmaker's role if matchMakerId changed to a new value
    const newMatchMakerId = user.matchMakerId?.toString();
    if (newMatchMakerId && newMatchMakerId !== oldMatchMakerId) {
      const matchmakerUser = await User.findById(newMatchMakerId);
      if (matchmakerUser && matchmakerUser.role !== 'admin' && matchmakerUser.role !== 'profileEndorser') {
        // Only update to matchmaker if not already admin or profileEndorser
        if (matchmakerUser.role !== 'matchmaker') {
          matchmakerUser.role = 'matchmaker';
          matchmakerUser.updatedBy = new mongoose.Types.ObjectId(session.user.id);
          await matchmakerUser.save();
        }
      }
    }

    user.updatedBy = new mongoose.Types.ObjectId(session.user.id);
    await user.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: user.toObject({ virtuals: false, versionKey: false, transform: (_doc: unknown, ret: Record<string, unknown>) => {
        delete ret.password;
        return ret;
      }})
    });

  } catch (error: any) {
    console.error("Profile update error:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: validationErrors.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
