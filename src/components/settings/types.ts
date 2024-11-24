import { SettingsMenu } from './pages/config/index';
import { ThemesMenu } from './pages/theme/index';

export const settingsPages = {
    Configuration: SettingsMenu(),
    Theming: ThemesMenu(),
} as const;

export type SettingsPage = keyof typeof settingsPages;

export const pageList = <T extends object>(obj: T): Array<keyof T> => {
    return Object.keys(obj) as Array<keyof T>;
};