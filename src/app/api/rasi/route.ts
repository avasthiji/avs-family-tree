import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Rasi from '@/models/Rasi';

export const runtime = 'nodejs';

// GET - Fetch all active Rasi (Zodiac Signs)
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
    
    const rasiList = await Rasi.find({ isActive: true })
      .select('name tamilName')
      .sort({ name: 1 });

    return NextResponse.json({ rasi: rasiList });
  } catch (error) {
    console.error('Rasi fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

