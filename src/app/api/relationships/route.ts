import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Relationship from "@/models/Relationship";
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

    // Get userId from query params - if provided, fetch relationships for that user
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId') || session.user.id;
    const includeFamily = searchParams.get('includeFamily') === 'true';

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
          $or: [
            { personId1: currentPerson },
            { personId2: currentPerson }
          ],
          isApproved: true
        });

        personRelationships.forEach((rel: any) => {
          const otherId = rel.personId1.toString() === currentPerson ? 
                          rel.personId2.toString() : 
                          rel.personId1.toString();
          
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
        isApproved: true
      })
      .populate('personId1', 'firstName lastName profilePicture gothiram nativePlace')
      .populate('personId2', 'firstName lastName profilePicture gothiram nativePlace')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

      return NextResponse.json({ relationships: allFamilyRelationships });
    } else {
      // Fetch only direct relationships where user is involved
      const directRelationships = await Relationship.find({
        $or: [
          { personId1: targetUserId },
          { personId2: targetUserId }
        ]
      })
      .populate('personId1', 'firstName lastName profilePicture gothiram nativePlace')
      .populate('personId2', 'firstName lastName profilePicture gothiram nativePlace')
      .populate('createdBy', 'firstName lastName')
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
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { personId2, relationType, description } = body;

    if (!personId2 || !relationType) {
      return NextResponse.json(
        { error: "Person ID and relationship type are required" },
        { status: 400 }
      );
    }

    // Validate relationship type
    const validTypes = [
      'Father', 'Mother', 'Spouse', 'Son', 'Daughter',
      'Older Sibling', 'Younger Sibling', 'Brother', 'Sister',
      'Grand Father', 'Grand Mother', 'Uncle', 'Aunt', 
      'Cousin', 'Nephew', 'Niece', 'Other'
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
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if relationship already exists
    const existingRelationship = await Relationship.findOne({
      $or: [
        { personId1: session.user.id, personId2: personId2 },
        { personId1: personId2, personId2: session.user.id }
      ]
    });

    if (existingRelationship) {
      return NextResponse.json(
        { error: "Relationship already exists between these users" },
        { status: 409 }
      );
    }

    // Create relationship
    const relationship = new Relationship({
      personId1: session.user.id,
      personId2: personId2,
      relationType,
      description,
      createdBy: session.user.id,
      isApproved: session.user.role === 'admin' // Auto-approve if admin
    });

    await relationship.save();

    // Populate before returning
    await relationship.populate('personId1', 'firstName lastName profilePicture gothiram nativePlace');
    await relationship.populate('personId2', 'firstName lastName profilePicture gothiram nativePlace');
    await relationship.populate('createdBy', 'firstName lastName');

    return NextResponse.json({ 
      message: "Relationship created successfully",
      relationship 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Relationship creation error:", error);
    
    if (error.message?.includes('Cannot create relationship with oneself')) {
      return NextResponse.json(
        { error: "Cannot create relationship with yourself" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
