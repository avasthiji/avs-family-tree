/**
 * Role utility functions
 */

export type UserRole = 'user' | 'admin' | 'profileEndorser' | 'avsMatchMaker';

/**
 * Check if a role has admin privileges (admin only)
 */
export function hasAdminPrivileges(role: string): boolean {
  return role === 'admin';
}

/**
 * Check if a role is a regular user role (user, profileEndorser, or avsMatchMaker)
 */
export function isRegularUser(role: string): boolean {
  return role === 'user' || role === 'profileEndorser' || role === 'avsMatchMaker';
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    'user': 'User',
    'admin': 'Administrator',
    'profileEndorser': 'AVS Profile Endorser',
    'avsMatchMaker': 'AVS Match Maker'
  };
  return roleMap[role] || role;
}

/**
 * Get role badge color
 */
export function getRoleBadgeColor(role: string): string {
  const colorMap: Record<string, string> = {
    'user': 'bg-gray-500',
    'admin': 'from-red-500 to-orange-500',
    'profileEndorser': 'from-red-500 to-orange-500',
    'avsMatchMaker': 'from-blue-500 to-cyan-500'
  };
  return colorMap[role] || 'bg-gray-500';
}

