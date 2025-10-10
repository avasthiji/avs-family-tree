import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Gothiram from "@/models/Gothiram";

export const runtime = 'nodejs';

// GET all active Gothirams (public - any authenticated user)
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

    const gothirams = await Gothiram.find({ isActive: true })
      .sort({ name: 1 })
      .select('name');

    return NextResponse.json({ gothirams });

  } catch (error) {
    console.error("Gothiram fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new Gothiram (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Gothiram name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if already exists
    const existing = await Gothiram.findOne({ name: name.trim() });
    if (existing) {
      return NextResponse.json(
        { error: "This Gothiram already exists" },
        { status: 400 }
      );
    }

    const gothiram = new Gothiram({
      name: name.trim(),
      createdBy: session.user.id
    });

    await gothiram.save();

    return NextResponse.json({
      message: "Gothiram created successfully",
      gothiram
    });

  } catch (error) {
    console.error("Gothiram creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

