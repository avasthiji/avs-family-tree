import crypto from 'crypto';

/**
 * Generate a random 6-digit OTP
 * For local development, always return "123456"
 */
export function generateOTP(): string {
  // For local development, use hardcoded OTP
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_TEST_OTP === 'true') {
    return '123456';
  }
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Check if an email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if a mobile number is valid (Indian format)
 */
export function isValidMobile(mobile: string): boolean {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
}

/**
 * Hash an OTP for secure storage
 */
export function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

/**
 * Verify an OTP against its hash
 */
export function verifyOTP(otp: string, hash: string): boolean {
  const otpHash = hashOTP(otp);
  return crypto.timingSafeEqual(Buffer.from(otpHash), Buffer.from(hash));
}

/**
 * Check if an OTP has expired
 */
export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Generate a random token for password reset
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a random session ID
 */
export function generateSessionId(): string {
  return crypto.randomBytes(16).toString('hex');
}
