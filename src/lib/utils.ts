import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the inverse relationship type for bidirectional relationships
 * @param relationType - The relationship type from person A to person B
 * @param personAGender - The gender of person A (the one creating the relationship) - 'Male', 'Female', or 'Other'
 * @returns The inverse relationship type from person B to person A
 */
export function getInverseRelationshipType(
  relationType: string,
  personAGender?: string
): string {
  // Helper to determine gender-specific child relationship
  const getChildRelation = (gender?: string): string => {
    if (gender === 'Female') return 'Daughter';
    if (gender === 'Male') return 'Son';
    return 'Son'; // Default to Son if gender is Other or undefined
  };

  // Helper to determine gender-specific grandchild relationship
  const getGrandchildRelation = (gender?: string): string => {
    if (gender === 'Female') return 'Granddaughter';
    if (gender === 'Male') return 'Grandson';
    return 'Grandson'; // Default to Grandson if gender is Other or undefined
  };

  // Helper to determine gender-specific grandparent relationship
  const getGrandparentRelation = (gender?: string): string => {
    if (gender === 'Female') return 'Grand Mother';
    if (gender === 'Male') return 'Grand Father';
    return 'Grand Father'; // Default to Grand Father if gender is Other or undefined
  };

  const inverseMap: Record<string, string> = {
    // Parent-child relationships
    'Father': getChildRelation(personAGender),
    'Mother': getChildRelation(personAGender),
    'Son': 'Father',
    'Daughter': 'Mother', // Daughter typically relates to mother, but can be father too
    
    // Sibling relationships
    'Older Sibling': 'Younger Sibling',
    'Younger Sibling': 'Older Sibling',
    'Brother': 'Brother', // Symmetric
    'Sister': 'Sister', // Symmetric
    
    // Grandparent-grandchild relationships
    'Grand Father': getGrandchildRelation(personAGender),
    'Grand Mother': getGrandchildRelation(personAGender),
    'Grandson': getGrandparentRelation(personAGender), // Use grandparent's gender to determine if inverse is Grand Father or Grand Mother
    'Granddaughter': getGrandparentRelation(personAGender), // Use grandparent's gender to determine if inverse is Grand Father or Grand Mother
    
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
