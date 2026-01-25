/**
 * Enum Helper Functions
 * Utilities for working with numeric enums
 */

/**
 * Get label from enum value
 */
export function getLabelFromEnum<T extends number>(labels: Record<T, string>, value: T): string {
  return labels[value] || 'Unknown';
}

/**
 * Get all enum values as array from label object
 */
export function getEnumValues<T extends number>(labels: Record<T, string>): T[] {
  return Object.keys(labels).map(Number) as T[];
}

/**
 * Get numeric values from a TS enum object
 */
export function getNumericEnumValues(enumObj: object): number[] {
  return Object.values(enumObj).filter((val) => typeof val === 'number') as number[];
}

/**
 * Get min/max for numeric range validation
 */
export function getEnumRange<T extends number>(labels: Record<T, string>): { min: T; max: T } {
  const values = getEnumValues(labels);
  return {
    min: Math.min(...values) as T,
    max: Math.max(...values) as T,
  };
}

// Handel Enum Helper
export class EnumHelper {
  static labelFrom<T extends number>(labels: Record<T, string>, value: T): string {
    return labels[value] || 'Unknown';
  }

  static values<T extends number>(labels: Record<T, string>): T[] {
    return Object.keys(labels).map(Number) as T[];
  }

  static numericValues(enumObj: object): number[] {
    return Object.values(enumObj).filter((val) => typeof val === 'number') as number[];
  }

  static range<T extends number>(labels: Record<T, string>): { min: T; max: T } {
    const values = this.values(labels);
    return {
      min: Math.min(...values) as T,
      max: Math.max(...values) as T,
    };
  }
}
