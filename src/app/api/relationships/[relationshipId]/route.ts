import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Relationship from "@/models/Relationship";
import User from "@/models/User";
import { getInverseRelationshipType } from "@/lib/utils";
import mongoose from "mongoose";

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

    // Find and delete the reverse relationship as well
    const reverseRelationship = await Relationship.findOne({
      personId1: relationship.personId2,
      personId2: relationship.personId1
    });

    // Delete both relationships
    await Relationship.findByIdAndDelete(relationshipId);
    if (reverseRelationship) {
      await Relationship.findByIdAndDelete(reverseRelationship._id);
    }

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
    relationship.updatedBy = new mongoose.Types.ObjectId(session.user.id);

    await relationship.save();

    // Find and update the reverse relationship if relationType changed
    if (relationType) {
      // Fetch personId1 to get gender for inverse relationship calculation
      const person1 = await User.findById(relationship.personId1);
      const person2 = await User.findById(relationship.personId2);
      
      // Determine which person's gender to use for inverse relationship
      // For all relationships, use person1's gender (the one who created/owns the relationship)
      const genderForInverse = person1?.gender;
      
      const inverseRelationType = getInverseRelationshipType(relationType, genderForInverse);
      
      // Find the reverse relationship
      const reverseRelationship = await Relationship.findOne({
        personId1: relationship.personId2,
        personId2: relationship.personId1
      });

      if (reverseRelationship) {
        reverseRelationship.relationType = inverseRelationType;
        if (description !== undefined) {
          reverseRelationship.description = description;
        }
        reverseRelationship.updatedBy = new mongoose.Types.ObjectId(session.user.id);
        await reverseRelationship.save();
      }
    }

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

