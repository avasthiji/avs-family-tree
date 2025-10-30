import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Kuladeivam from '@/models/Kuladeivam';

export const runtime = 'nodejs';

// GET - Fetch all active Kuladeivam
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const kuladeivamList = await Kuladeivam.find({ isActive: true })
      .select('name tamilName')
      .sort({ name: 1 });

    return NextResponse.json({ kuladeivam: kuladeivamList });
  } catch (error) {
    console.error('Kuladeivam fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

