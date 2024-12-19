export const settingsPages = ['Configuration', 'Theming'] as const;

export const themePages = [
    'General Settings',
    'Matugen Settings',
    'Bar',
    'Notifications',
    'OSD',
    'Battery Menu',
    'Bluetooth Menu',
    'Clock Menu',
    'Dashboard Menu',
    'Media Menu',
    'Network Menu',
    'Notifications Menu',
    'System Tray',
    'Volume Menu',
    'Power Menu',
    'Custom Modules',
] as const;

export const configPages = [
    'General',
    'Bar',
    'Media Menu',
    'Notifications',
    'OSD',
    'Volume',
    'Clock Menu',
    'Dashboard Menu',
    'Custom Modules',
    'Power Menu',
] as const;

export type ThemePage = (typeof themePages)[number];
export type ConfigPage = (typeof configPages)[number];
export type SettingsPage = (typeof settingsPages)[number];
