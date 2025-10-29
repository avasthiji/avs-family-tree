import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the inverse relationship type for bidirectional relationships
 * @param relationType - The relationship type from person A to person B
 * @returns The inverse relationship type from person B to person A
 */
export function getInverseRelationshipType(
  relationType: string
): string {
  const inverseMap: Record<string, string> = {
    // Parent-child relationships
    'Father': 'Son', // Default to Son (if gender-specific needed, can be enhanced later)
    'Mother': 'Son', // Default to Son (if gender-specific needed, can be enhanced later)
    'Son': 'Father',
    'Daughter': 'Father', // Typically daughter relates to father, but can be flexible
    
    // Sibling relationships
    'Older Sibling': 'Younger Sibling',
    'Younger Sibling': 'Older Sibling',
    'Brother': 'Brother', // Symmetric
    'Sister': 'Sister', // Symmetric
    
    // Grandparent-grandchild relationships
    'Grand Father': 'Son', // Default to Son (can be enhanced for grandson/granddaughter)
    'Grand Mother': 'Son', // Default to Son (can be enhanced for grandson/granddaughter)
    
    // Extended family
    'Uncle': 'Nephew', // Default to Nephew (can be enhanced for nephew/niece)
    'Aunt': 'Nephew', // Default to Nephew (can be enhanced for nephew/niece)
    'Nephew': 'Uncle', // Default to Uncle (can be enhanced for uncle/aunt)
    'Niece': 'Uncle', // Default to Uncle (can be enhanced for uncle/aunt)
    
    // Symmetric relationships
    'Spouse': 'Spouse',
    'Cousin': 'Cousin',
    'Other': 'Other',
  };

  return inverseMap[relationType] || 'Other';
}
