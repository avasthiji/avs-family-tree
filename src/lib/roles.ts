/**
 * Role utility functions
 */

export type UserRole = 'user' | 'admin' | 'matchmaker' | 'profileEndorser' | 'avsMatchMaker';

/**
 * Check if a role has admin privileges (admin or profileEndorser)
 */
export function hasAdminPrivileges(role: string): boolean {
  return role === 'admin' || role === 'profileEndorser';
}

/**
 * Check if a role is a regular user role (user or avsMatchMaker)
 */
export function isRegularUser(role: string): boolean {
  return role === 'user' || role === 'avsMatchMaker';
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    'user': 'User',
    'admin': 'Administrator',
    'matchmaker': 'Matchmaker',
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
    'matchmaker': 'from-purple-500 to-pink-500',
    'profileEndorser': 'from-red-500 to-orange-500',
    'avsMatchMaker': 'from-blue-500 to-cyan-500'
  };
  return colorMap[role] || 'bg-gray-500';
}

