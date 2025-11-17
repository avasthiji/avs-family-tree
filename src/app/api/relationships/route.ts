import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Relationship from "@/models/Relationship";
import User from "@/models/User";
import { getInverseRelationshipType } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get userId from query params - if provided, fetch relationships for that user
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId") || session.user.id;
    const includeFamily = searchParams.get("includeFamily") === "true";

    // If includeFamily is true, use BFS to get entire family tree relationships
    // Otherwise, only get direct relationships
    if (includeFamily) {
      // Build a set of all connected family members
      const connectedPeople = new Set<string>();
      connectedPeople.add(targetUserId);

      // BFS to find all connected family members
      const queue: string[] = [targetUserId];
      const visited = new Set<string>();
      visited.add(targetUserId);

      while (queue.length > 0) {
        const currentPerson = queue.shift()!;

        // Find all relationships involving current person
        const personRelationships = await Relationship.find({
          $or: [{ personId1: currentPerson }, { personId2: currentPerson }],
          isApproved: true,
        });

        personRelationships.forEach((rel: any) => {
          const otherId =
            rel.personId1.toString() === currentPerson
              ? rel.personId2.toString()
              : rel.personId1.toString();

          connectedPeople.add(otherId);

          if (!visited.has(otherId)) {
            visited.add(otherId);
            queue.push(otherId);
          }
        });
      }

      // Fetch ALL relationships between any of the connected people
      const allFamilyRelationships = await Relationship.find({
        personId1: { $in: Array.from(connectedPeople) },
        personId2: { $in: Array.from(connectedPeople) },
        isApproved: true,
      })
        .populate(
          "personId1",
          "firstName lastName profilePicture gothiram nativePlace"
        )
        .populate(
          "personId2",
          "firstName lastName profilePicture gothiram nativePlace"
        )
        .populate("createdBy", "firstName lastName")
        .sort({ createdAt: -1 });

      return NextResponse.json({ relationships: allFamilyRelationships });
    } else {
      // Fetch only relationships where the logged-in user is personId1
      // This ensures the logged-in user doesn't appear as personId2 (avoiding duplicates)
      const directRelationships = await Relationship.find({
        personId1: targetUserId,
      })
        .populate(
          "personId1",
          "firstName lastName profilePicture gothiram nativePlace"
        )
        .populate(
          "personId2",
          "firstName lastName profilePicture gothiram nativePlace"
        )
        .populate("createdBy", "firstName lastName")
        .sort({ createdAt: -1 });

      return NextResponse.json({ relationships: directRelationships });
    }
  } catch (error) {
    console.error("Relationships fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let session: any = null;
  let personId2: string | undefined;
  let relationType: string | undefined;
  
  try {
    session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    personId2 = body.personId2;
    relationType = body.relationType;
    const description = body.description;

    if (!personId2 || !relationType) {
      return NextResponse.json(
        { error: "Person ID and relationship type are required" },
        { status: 400 }
      );
    }

    // Validate relationship type
    const validTypes = [
      "Father",
      "Mother",
      "Spouse",
      "Son",
      "Daughter",
      "Older Sibling",
      "Younger Sibling",
      "Brother",
      "Sister",
      "Grand Father",
      "Grand Mother",
      "Grandson",
      "Granddaughter",
      "Uncle",
      "Aunt",
      "Cousin",
      "Nephew",
      "Niece",
      "Other",
    ];

    if (!validTypes.includes(relationType)) {
      return NextResponse.json(
        { error: "Invalid relationship type" },
        { status: 400 }
      );
    }

    await connectDB();

    // Prevent creating relationship with yourself
    if (session.user.id === personId2) {
      return NextResponse.json(
        { error: "You cannot create a relationship with yourself" },
        { status: 400 }
      );
    }

    // Check if person2 exists
    const person2 = await User.findById(personId2);
    if (!person2) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch current user to get gender
    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ error: "Current user not found" }, { status: 404 });
    }

    // Check if relationship already exists in either direction
    const existingRelationship = await Relationship.findOne({
      $or: [
        { personId1: session.user.id, personId2: personId2 },
        { personId1: personId2, personId2: session.user.id },
      ],
    });

    if (existingRelationship) {
      return NextResponse.json(
        { error: "Relationship already exists between these users" },
        { status: 409 }
      );
    }

    // Determine which person's gender to use for inverse relationship
    // For grandparent relationships (Grand Father, Grand Mother), use current user's gender
    //   (to determine if inverse is Grandson or Granddaughter)
    // For grandchild relationships (Grandson, Granddaughter), use current user's gender
    //   (to determine if inverse is Grand Father or Grand Mother)
    // For other relationships, use current user's gender
    let genderForInverse: string | undefined = currentUser.gender;

    // Get inverse relationship type with gender consideration
    const inverseRelationType = getInverseRelationshipType(relationType, genderForInverse);

    // Create forward relationship (person1 -> person2)
    const relationship = new Relationship({
      personId1: session.user.id,
      personId2: personId2,
      relationType,
      description,
      createdBy: session.user.id,
      isApproved: session.user.role === "admin", // Auto-approve if admin
    });

    try {
      await relationship.save();
    } catch (saveError: any) {
      // If forward relationship save fails due to duplicate, check if it already exists
      if (saveError.code === 11000) {
        const existing = await Relationship.findOne({
          personId1: session.user.id,
          personId2: personId2,
        });
        if (existing) {
          return NextResponse.json(
            { error: "Relationship already exists between these users" },
            { status: 409 }
          );
        }
      }
      throw saveError; // Re-throw if it's a different error
    }

    // Check if reverse relationship already exists before creating
    let reverseRelationship = await Relationship.findOne({
      personId1: personId2,
      personId2: session.user.id,
    });

    if (reverseRelationship) {
      // Update existing reverse relationship
      reverseRelationship.relationType = inverseRelationType;
      reverseRelationship.description = description;
      reverseRelationship.updatedBy = session.user.id;
      if (session.user.role === "admin") {
        reverseRelationship.isApproved = true;
      }
      try {
        await reverseRelationship.save();
      } catch (updateError: any) {
        // If update fails, delete the forward relationship we just created to maintain consistency
        await Relationship.findByIdAndDelete(relationship._id);
        throw updateError;
      }
    } else {
      // Create new reverse relationship (person2 -> person1)
      reverseRelationship = new Relationship({
        personId1: personId2,
        personId2: session.user.id,
        relationType: inverseRelationType,
        description, // Use same description for both
        createdBy: session.user.id,
        isApproved: session.user.role === "admin", // Auto-approve if admin
      });
      
      try {
        await reverseRelationship.save();
      } catch (saveError: any) {
        // If reverse relationship save fails due to duplicate, check if it was created concurrently
        if (saveError.code === 11000) {
          const existingReverse = await Relationship.findOne({
            personId1: personId2,
            personId2: session.user.id,
          });
          
          if (existingReverse) {
            // Update the existing reverse relationship instead
            existingReverse.relationType = inverseRelationType;
            existingReverse.description = description;
            existingReverse.updatedBy = session.user.id;
            if (session.user.role === "admin") {
              existingReverse.isApproved = true;
            }
            await existingReverse.save();
            // Forward relationship is already saved, so we're good
          } else {
            // Unexpected duplicate error, delete forward relationship and throw
            await Relationship.findByIdAndDelete(relationship._id);
            throw saveError;
          }
        } else {
          // Different error, delete forward relationship and throw
          await Relationship.findByIdAndDelete(relationship._id);
          throw saveError;
        }
      }
    }

    // Populate before returning
    await relationship.populate(
      "personId1",
      "firstName lastName profilePicture gothiram nativePlace"
    );
    await relationship.populate(
      "personId2",
      "firstName lastName profilePicture gothiram nativePlace"
    );
    await relationship.populate("createdBy", "firstName lastName");

    return NextResponse.json(
      {
        message: "Relationship created successfully",
        relationship,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Relationship creation error:", {
      error: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
      userId: session?.user?.id,
      personId2: personId2,
      relationType: relationType,
    });

    // Handle specific error cases
    if (error.message?.includes("Cannot create relationship with oneself")) {
      return NextResponse.json(
        { error: "Cannot create relationship with yourself" },
        { status: 400 }
      );
    }

    // Handle MongoDB duplicate key error (unique constraint violation)
    if (error.code === 11000 || error.message?.includes("duplicate key")) {
      // Try to find which relationship already exists
      try {
        const existingRel = await Relationship.findOne({
          $or: [
            { personId1: session.user.id, personId2: personId2 },
            { personId1: personId2, personId2: session.user.id },
          ],
        });

        if (existingRel) {
          return NextResponse.json(
            { 
              error: "Relationship already exists between these users",
              existingRelationship: existingRel 
            },
            { status: 409 }
          );
        }
      } catch (lookupError) {
        // If lookup fails, just return generic error
      }

      return NextResponse.json(
        { error: "A relationship already exists between these users" },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: error.message || "Validation error occurred" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
