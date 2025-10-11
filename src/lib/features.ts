/**
 * Feature flags for the application
 * These are injected at build time from environment variables
 */

// Check if matrimonial feature is enabled
// This reads from MATRIMONIAL_FEATURE environment variable
export const MATRIMONIAL_ENABLED = process.env.MATRIMONIAL_FEATURE === 'true';

// Check if event feature is enabled
// This reads from EVENT_FEATURE environment variable
export const EVENT_ENABLED = process.env.EVENT_FEATURE === 'true';

// Helper functions for conditional rendering
export function isMatrimonialEnabled(): boolean {
  return MATRIMONIAL_ENABLED;
}

export function isEventEnabled(): boolean {
  return EVENT_ENABLED;
}

