export const env = {
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/avs-family-tree',
  
  // Auth
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this-in-production',
  
  // Email
  EMAIL_USER: process.env.EMAIL_USER || 'your-email@gmail.com',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'your-app-password',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@avs-family-tree.com',
  
  // App
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Upload
  UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET || 'your-uploadthing-secret',
  
  // Feature Flags
  MATRIMONIAL_FEATURE: process.env.MATRIMONIAL_FEATURE === 'true',
  EVENT_FEATURE: process.env.EVENT_FEATURE === 'true',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Helper functions to check if features are enabled
export const isMatrimonialEnabled = () => env.MATRIMONIAL_FEATURE;
export const isEventEnabled = () => env.EVENT_FEATURE;

// Validation
const requiredEnvVars = [
  'MONGODB_URI',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
];

export function validateEnv() {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
