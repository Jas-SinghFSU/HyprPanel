import { BarTheme } from './bar/index';
import { NotificationsTheme } from './notifications/index';
import { BatteryMenuTheme } from './menus/battery';
import { BluetoothMenuTheme } from './menus/bluetooth';
import { ClockMenuTheme } from './menus/clock';
import { DashboardMenuTheme } from './menus/dashboard';
import { MenuTheme } from './menus/index';
import { MediaMenuTheme } from './menus/media';
import { NetworkMenuTheme } from './menus/network';
import { NotificationsMenuTheme } from './menus/notifications';
import { SystrayMenuTheme } from './menus/systray';
import { VolumeMenuTheme } from './menus/volume';
import { OsdTheme } from './osd/index';
import { Matugen } from './menus/matugen';
import { CustomModuleTheme } from 'customModules/theme';
import { PowerMenuTheme } from './menus/power';

export const themePages = {
    'General Settings': MenuTheme(),
    'Matugen Settings': Matugen(),
    Bar: BarTheme(),
    Notifications: NotificationsTheme(),
    OSD: OsdTheme(),
    'Battery Menu': BatteryMenuTheme(),
    'Bluetooth Menu': BluetoothMenuTheme(),
    'Clock Menu': ClockMenuTheme(),
    'Dashboard Menu': DashboardMenuTheme(),
    'Media Menu': MediaMenuTheme(),
    'Network Menu': NetworkMenuTheme(),
    'Notifications Menu': NotificationsMenuTheme(),
    'System Tray': SystrayMenuTheme(),
    'Volume Menu': VolumeMenuTheme(),
    'Power Menu': PowerMenuTheme(),
    'Custom Modules': CustomModuleTheme(),
} as const;

export type ThemePage = keyof typeof themePages;
