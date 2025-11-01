import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { hasAdminPrivileges } from "@/lib/roles";

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || !hasAdminPrivileges(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = await params;
    await connectDB();

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Send rejection email before deleting
    try {
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: "Account Application Status - AVS Family Tree",
          text: `Dear ${user.firstName} ${user.lastName},\n\nThank you for your interest in joining AVS Family Tree.\n\nAfter careful review, we are unable to approve your account at this time. If you believe this is an error or would like to reapply, please contact our support team at ${SUPPORT_EMAIL}.\n\nBest regards,\nAVS Family Tree Team`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #E63946;">Account Application Update</h2>
              <p>Dear ${user.firstName} ${user.lastName},</p>
              <p>Thank you for your interest in joining the AVS Family Tree platform.</p>
              <p>After careful review of your application, we are unable to approve your account at this time.</p>
              <p>If you believe this is an error or would like to discuss your application, please contact our support team at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
              <p style="margin-top: 30px;">We appreciate your understanding.</p>
              <p>Best regards,<br>AVS Family Tree Team</p>
              <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
      // Continue even if email fails
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      message: "User rejected and removed successfully"
    });

  } catch (error) {
    console.error("User rejection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
