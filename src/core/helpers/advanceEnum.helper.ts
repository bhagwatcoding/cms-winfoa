// =============================================================================
// SECTION 1: TYPE UTILITY FUNCTIONS - Type Safety & Validation
// =============================================================================

/**
 * Generic type for enum values
 */
export type EnumValue = string | number;

/**
 * Generic type for label mappings
 */
export type LabelMapping<T extends EnumValue> = Record<T, string>;

/**
 * Get all enum values as an array
 */
export function getEnumValues<T extends EnumValue>(enumObject: Record<string, T>): T[] {
  return Object.values(enumObject).filter(
    (value): value is T => typeof value === 'string' || typeof value === 'number'
  );
}

/**
 * Get all enum keys as an array
 */
export function getEnumKeys<T extends Record<string, EnumValue>>(enumObject: T): (keyof T)[] {
  return Object.keys(enumObject).filter((key) => isNaN(Number(key))) as (keyof T)[];
}

/**
 * Get label for a specific enum value
 */
export function getEnumLabel<T extends EnumValue>(value: T, labelMapping: LabelMapping<T>): string {
  return labelMapping[value] || String(value);
}

/**
 * Check if a value is a valid enum value
 */
export function isValidEnumValue<T extends EnumValue>(
  value: unknown,
  enumObject: Record<string, T>
): value is T {
  const validValues = getEnumValues(enumObject);
  return validValues.includes(value as T);
}

/**
 * Get random enum value (useful for testing)
 */
export function getRandomEnumValue<T extends EnumValue>(enumObject: Record<string, T>): T {
  const values = getEnumValues(enumObject);
  return values[Math.floor(Math.random() * values.length)]!;
}

/**
 * Convert enum value to its key name
 */
export function getEnumKeyName<T extends EnumValue>(
  value: T,
  enumObject: Record<string, T>
): string | undefined {
  const entries = Object.entries(enumObject);
  const entry = entries.find(([, val]) => val === value);
  return entry?.[0];
}

// =============================================================================
// SECTION 2: VALIDATION HELPERS - Runtime Type Safety
// =============================================================================

/**
 * Comprehensive enum validation result
 */

export interface EnumValidationResult<T extends EnumValue> {
  isValid: boolean;
  value?: T;
  error?: string;
  suggestions?: T[];
}

/**
 * Validate enum value with detailed feedback
 */
export function validateEnumValue<T extends EnumValue>(
  value: unknown,
  enumObject: Record<string, T>,
  labelMapping: LabelMapping<T>,
  options: {
    allowUndefined?: boolean;
    allowNull?: boolean;
    caseSensitive?: boolean;
    fuzzyMatch?: boolean;
  } = {}
): EnumValidationResult<T> {
  const {
    allowUndefined = false,
    allowNull = false,
    caseSensitive = true,
    fuzzyMatch = false,
  } = options;

  // Handle undefined/null cases
  if (value === undefined) {
    return allowUndefined ? { isValid: true } : { isValid: false, error: 'Value is undefined' };
  }

  if (value === null) {
    return allowNull ? { isValid: true } : { isValid: false, error: 'Value is null' };
  }

  // Direct validation
  if (isValidEnumValue(value, enumObject)) {
    return { isValid: true, value: value as T };
  }

  // Case-insensitive matching
  if (!caseSensitive && typeof value === 'string') {
    const lowerValue = value.toLowerCase();
    const validValues = getEnumValues(enumObject);
    const matchedValue = validValues.find(
      (v) => typeof v === 'string' && v.toLowerCase() === lowerValue
    );

    if (matchedValue) {
      return { isValid: true, value: matchedValue as T };
    }
  }

  // Fuzzy matching for string enums
  if (fuzzyMatch && typeof value === 'string') {
    const validValues = getEnumValues(enumObject).filter((v): v is T => typeof v === 'string');
    const suggestions = validValues.filter(
      (v) =>
        (typeof v === 'string' && v.toLowerCase().includes(value.toLowerCase())) ||
        (typeof value === 'string' && value.toLowerCase().includes(value.toLowerCase()))
    );

    if (suggestions.length > 0) {
      return {
        isValid: false,
        error: `Invalid value "${value}". Did you mean one of: ${suggestions.join(', ')}?`,
        suggestions,
      };
    }
  }

  // Generate error message with valid options
  const validValues = getEnumValues(enumObject);
  const validLabels = validValues.map((v) => labelMapping[v] || String(v));

  return {
    isValid: false,
    error: `Invalid value "${value}". Valid options are: ${validLabels.join(', ')}`,
  };
}

/**
 * Assert enum value with detailed error message
 */
export function assertEnumValue<T extends EnumValue>(
  value: unknown,
  enumObject: Record<string, T>,
  labelMapping: LabelMapping<T>,
  context?: string
): T {
  const result = validateEnumValue(value, enumObject, labelMapping);

  if (!result.isValid) {
    const contextMsg = context ? ` in ${context}` : '';
    throw new TypeError(`Enum validation failed${contextMsg}: ${result.error}`);
  }

  return result.value!;
}
