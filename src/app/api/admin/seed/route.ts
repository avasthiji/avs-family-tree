import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed-data";
import { seedCompleteFamily } from "@/lib/seed-complete-family";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type = 'basic', clearFirst = true } = body;
    
    console.log(`🌱 Starting database seeding (type: ${type}, clearFirst: ${clearFirst})...`);

    if (type === 'complete') {
      await seedCompleteFamily();
      return NextResponse.json({
        message: "Complete family tree seeded successfully!",
        type: "complete",
        users: 11,
        demoAccounts: {
          users: "All users have password: password123",
          examples: [
            "venkat.iyer@avs.com / password123",
            "ramesh.venkat@avs.com / password123",
            "arun.ramesh@avs.com / password123"
          ]
        }
      });
    } else {
      await seedDatabase();
      return NextResponse.json({
        message: "Basic database seeded successfully!",
        type: "basic",
        users: 10,
        demoAccounts: {
          admin: "admin@avs.com / admin123",
          matchmaker: "matchmaker@avs.com / matchmaker123",
          users: "Other users have password: password123"
        }
      });
    }

  } catch (error) {
    console.error("❌ Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
