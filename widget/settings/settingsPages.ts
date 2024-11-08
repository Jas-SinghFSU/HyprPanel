import { SettingsMenu } from './pages/config/index';
import { ThemesMenu } from './pages/theme/index';

export const settingsPages = {
    Configuration: SettingsMenu(),
    Theming: ThemesMenu(),
} as const;

export type SettingsPage = keyof typeof settingsPages;
