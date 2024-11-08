import { BarGeneral } from './general/index';
import { BarSettings } from './bar/index';
import { ClockMenuSettings } from './menus/clock';
import { DashboardMenuSettings } from './menus/dashboard';
import { NotificationSettings } from './notifications/index';
import { OSDSettings } from './osd/index';
import { CustomModuleSettings } from 'customModules/config';
import { PowerMenuSettings } from './menus/power';
import { MediaMenuSettings } from './menus/media';
import { BluetoothMenuSettings } from './menus/bluetooth';
import { VolumeMenuSettings } from './menus/volume';

export const configPages = {
    General: BarGeneral(),
    Bar: BarSettings(),
    'Media Menu': MediaMenuSettings(),
    Notifications: NotificationSettings(),
    OSD: OSDSettings(),
    Volume: VolumeMenuSettings(),
    'Clock Menu': ClockMenuSettings(),
    'Dashboard Menu': DashboardMenuSettings(),
    'Custom Modules': CustomModuleSettings(),
    'Bluetooth Menu': BluetoothMenuSettings(),
    'Power Menu': PowerMenuSettings(),
} as const;

export type ConfigPage = keyof typeof configPages;
