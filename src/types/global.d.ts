import type mongoose from 'mongoose';
import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  };
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string;
      mobile?: string;
      firstName: string;
      lastName: string;
      role: string;
      isApprovedByAdmin: boolean;
      isEmailVerified: boolean;
      isMobileVerified: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    mobile?: string;
    firstName: string;
    lastName: string;
    role: string;
    isApprovedByAdmin: boolean;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string;
    mobile?: string;
    firstName: string;
    lastName: string;
    isApprovedByAdmin: boolean;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
  }
}
