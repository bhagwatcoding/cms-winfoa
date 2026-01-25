/**
 * User Preference Enums
 * Numeric values for efficient DB storage
 */

export enum ThemeMode {
  LIGHT = 1,
  DARK = 2,
  SYSTEM = 3,
}

export const ThemeModeLabel: Record<ThemeMode, string> = {
  [ThemeMode.LIGHT]: 'Light',
  [ThemeMode.DARK]: 'Dark',
  [ThemeMode.SYSTEM]: 'System',
};

export enum ProfileVisibility {
  PUBLIC = 1,
  PRIVATE = 2,
  FRIENDS = 3,
}

export const ProfileVisibilityLabel: Record<ProfileVisibility, string> = {
  [ProfileVisibility.PUBLIC]: 'Public',
  [ProfileVisibility.PRIVATE]: 'Private',
  [ProfileVisibility.FRIENDS]: 'Friends Only',
};

// Gender
export enum Gender {
  Male = 1,
  Female = 2,
  Other = 3,
  PreferNotToSay = 4,
}
export const GenderLabels = {
  [Gender.Male]: 'Male',
  [Gender.Female]: 'Female',
  [Gender.Other]: 'Other',
  [Gender.PreferNotToSay]: 'Prefer Not To Say',
} as const;
