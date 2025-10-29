import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Nakshatram from '@/models/Nakshatram';

export const runtime = 'nodejs';

// GET - Fetch all active Nakshatram (Birth Stars)
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
    
    const nakshatramList = await Nakshatram.find({ isActive: true })
      .select('name tamilName')
      .sort({ name: 1 });

    return NextResponse.json({ nakshatram: nakshatramList });
  } catch (error) {
    console.error('Nakshatram fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

