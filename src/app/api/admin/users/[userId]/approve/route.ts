import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { hasAdminPrivileges } from "@/lib/roles";
import mongoose from "mongoose";

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

    user.isApprovedByAdmin = true;
    user.approvedBy = new mongoose.Types.ObjectId(session.user.id);
    user.approvedAt = new Date();
    await user.save();

    // Send approval email
    try {
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: "Account Approved - AVS Family Tree",
          text: `Dear ${user.firstName} ${user.lastName},\n\nYour AVS Family Tree account has been approved! You can now access all features of the platform.\n\nWelcome to the AVS Family Tree community!\n\nBest regards,\nAVS Family Tree Team`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #E63946;">Account Approved!</h2>
              <p>Dear ${user.firstName} ${user.lastName},</p>
              <p>Great news! Your AVS Family Tree account has been <strong>approved</strong>.</p>
              <p>You can now:</p>
              <ul>
                <li>Build your family tree</li>
                <li>Connect with family members</li>
                <li>Manage relationships</li>
                <li>Access all platform features</li>
              </ul>
              <p style="margin-top: 30px;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/login" 
                   style="background-color: #E63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Login to Your Account
                </a>
              </p>
              <p style="margin-top: 30px;">Welcome to the AVS Family Tree community!</p>
              <p>Best regards,<br>AVS Family Tree Team</p>
              <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
              <p style="font-size: 12px; color: #666; margin-top: 10px;">Need help? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #E63946;">${SUPPORT_EMAIL}</a></p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      message: "User approved successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isApprovedByAdmin: user.isApprovedByAdmin
      }
    });

  } catch (error) {
    console.error("User approval error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
