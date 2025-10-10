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

    await connectDB();

    const user = await User.findById(session.user.id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

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
      'gender', 'dob', 'placeOfBirth', 'timeOfBirth', 'height',
      'rasi', 'natchathiram', 'gothiram', 'primaryPhone', 'secondaryPhone',
      'qualification', 'jobDesc', 'salary', 'bioDesc', 'partnerDesc',
      'workPlace', 'nativePlace', 'address1', 'address2', 'city', 'state',
      'country', 'postalCode', 'citizenship', 'kuladeivam', 'enableMarriageFlag',
      'profilePicture'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        user[field] = body[field];
      }
    });

    user.updatedBy = session.user.id;
    await user.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: user.toObject({ virtuals: false, versionKey: false, transform: (_doc: unknown, ret: Record<string, unknown>) => {
        delete ret.password;
        return ret;
      }})
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
