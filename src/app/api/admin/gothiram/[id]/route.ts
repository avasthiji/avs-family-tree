import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Gothiram from "@/models/Gothiram";
import { hasAdminPrivileges } from "@/lib/roles";

export const runtime = 'nodejs';

// PUT update Gothiram
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || !hasAdminPrivileges(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, isActive } = body;

    await connectDB();

    const gothiram = await Gothiram.findById(id);
    
    if (!gothiram) {
      return NextResponse.json(
        { error: "Gothiram not found" },
        { status: 404 }
      );
    }

    if (name) {
      // Check if new name already exists
      const existing = await Gothiram.findOne({ 
        name: name.trim(),
        _id: { $ne: id }
      });
      
      if (existing) {
        return NextResponse.json(
          { error: "A Gothiram with this name already exists" },
          { status: 400 }
        );
      }
      
      gothiram.name = name.trim();
    }

    if (typeof isActive === 'boolean') {
      gothiram.isActive = isActive;
    }

    await gothiram.save();

    return NextResponse.json({
      message: "Gothiram updated successfully",
      gothiram
    });

  } catch (error) {
    console.error("Gothiram update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE Gothiram
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || !hasAdminPrivileges(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectDB();

    const gothiram = await Gothiram.findByIdAndDelete(id);
    
    if (!gothiram) {
      return NextResponse.json(
        { error: "Gothiram not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Gothiram deleted successfully"
    });

  } catch (error) {
    console.error("Gothiram deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

