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
import { GBox } from 'lib/types/widget';

type Page =
    | 'General Settings'
    | 'Matugen Settings'
    | 'Bar'
    | 'Notifications'
    | 'OSD'
    | 'Battery Menu'
    | 'Bluetooth Menu'
    | 'Clock Menu'
    | 'Dashboard Menu'
    | 'Media Menu'
    | 'Network Menu'
    | 'Notifications Menu'
    | 'System Tray'
    | 'Volume Menu'
    | 'Power Menu'
    | 'Custom Modules';

const CurrentPage = Variable<Page>('General Settings');

const pagerMap: Page[] = [
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
];

export const ThemesMenu = (): GBox => {
    return Widget.Box({
        vertical: true,
        children: CurrentPage.bind('value').as((v) => {
            return [
                Widget.Box({
                    class_name: 'option-pages-container',
                    hpack: 'center',
                    hexpand: true,
                    vertical: true,
                    children: [0, 1, 2].map((section) => {
                        return Widget.Box({
                            children: pagerMap.map((page, index) => {
                                if (index >= section * 6 && index < section * 6 + 6) {
                                    return Widget.Button({
                                        hpack: 'center',
                                        xalign: 0,
                                        class_name: `pager-button ${v === page ? 'active' : ''}`,
                                        label: page,
                                        on_primary_click: () => (CurrentPage.value = page),
                                    });
                                }
                                return Widget.Box();
                            }),
                        });
                    }),
                }),
                Widget.Stack({
                    vexpand: true,
                    class_name: 'themes-menu-stack',
                    children: {
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
                    },
                    shown: CurrentPage.bind('value'),
                }),
            ];
        }),
    });
};
