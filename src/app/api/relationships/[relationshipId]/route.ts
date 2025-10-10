import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Relationship from "@/models/Relationship";

export const runtime = 'nodejs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ relationshipId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { relationshipId } = await params;

    await connectDB();

    // Find the relationship
    const relationship = await Relationship.findById(relationshipId);

    if (!relationship) {
      return NextResponse.json(
        { error: "Relationship not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to delete
    const isAuthorized = 
      relationship.personId1.toString() === session.user.id ||
      relationship.personId2.toString() === session.user.id ||
      session.user.role === 'admin';

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "You don't have permission to delete this relationship" },
        { status: 403 }
      );
    }

    await Relationship.findByIdAndDelete(relationshipId);

    return NextResponse.json({ 
      message: "Relationship deleted successfully" 
    });

  } catch (error) {
    console.error("Relationship deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ relationshipId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { relationshipId } = await params;
    const body = await request.json();
    const { relationType, description } = body;

    await connectDB();

    // Find the relationship
    const relationship = await Relationship.findById(relationshipId);

    if (!relationship) {
      return NextResponse.json(
        { error: "Relationship not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to update
    const isAuthorized = 
      relationship.personId1.toString() === session.user.id ||
      relationship.personId2.toString() === session.user.id ||
      session.user.role === 'admin';

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "You don't have permission to update this relationship" },
        { status: 403 }
      );
    }

    // Update relationship
    if (relationType) {
      relationship.relationType = relationType;
    }
    if (description !== undefined) {
      relationship.description = description;
    }
    relationship.updatedBy = session.user.id;

    await relationship.save();

    // Populate before returning
    await relationship.populate('personId1', 'firstName lastName profilePicture gothiram nativePlace');
    await relationship.populate('personId2', 'firstName lastName profilePicture gothiram nativePlace');
    await relationship.populate('createdBy', 'firstName lastName');

    return NextResponse.json({ 
      message: "Relationship updated successfully",
      relationship 
    });

  } catch (error) {
    console.error("Relationship update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

