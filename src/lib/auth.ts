import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        mobile: { label: "Mobile", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        // Lazy imports to avoid loading in Edge Runtime (middleware)
        const bcrypt = (await import("bcryptjs")).default;
        const connectDB = (await import("./db")).default;
        const User = (await import("@/models/User")).default;

        try {
          await connectDB();

          // Find user by email or mobile (filter out undefined values)
          const searchConditions = [];
          if (credentials.email) {
            searchConditions.push({ email: credentials.email });
          }
          if (credentials.mobile) {
            searchConditions.push({ mobile: credentials.mobile });
          }

          if (searchConditions.length === 0) {
            return null;
          }

          const user = await User.findOne({
            $or: searchConditions,
            deletedAt: null, // Exclude deleted users
          });

          if (!user) {
            return null;
          }

          // Check if user has been deleted
          if (user.deletedAt) {
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Allow verified users to log in even if not approved by admin
          // They will be shown a pending approval page instead of being blocked from logging in

          const authUser = {
            id: user._id.toString(),
            email: user.email,
            mobile: user.mobile,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isApprovedByAdmin: user.isApprovedByAdmin,
            isEmailVerified: user.isEmailVerified,
            isMobileVerified: user.isMobileVerified,
          };

          return authUser;
        } catch (error) {
          console.error("❌ [AUTH] Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.isApprovedByAdmin = user.isApprovedByAdmin;
        token.isEmailVerified = user.isEmailVerified;
        token.isMobileVerified = user.isMobileVerified;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.mobile = user.mobile;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.isApprovedByAdmin = token.isApprovedByAdmin as boolean;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
        session.user.isMobileVerified = token.isMobileVerified as boolean;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.mobile = token.mobile as string;
      }
      return session;
    },
  },
});
