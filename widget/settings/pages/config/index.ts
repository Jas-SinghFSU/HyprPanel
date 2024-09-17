import { BarGeneral } from './general/index';
import { BarSettings } from './bar/index';
import { ClockMenuSettings } from './menus/clock';
import { DashboardMenuSettings } from './menus/dashboard';
import { NotificationSettings } from './notifications/index';
import { OSDSettings } from './osd/index';
import { CustomModuleSettings } from 'customModules/config';
import { PowerMenuSettings } from './menus/power';
import { GBox } from 'lib/types/widget';

type Page =
    | 'General'
    | 'Bar'
    | 'Clock Menu'
    | 'Dashboard Menu'
    | 'Power Menu'
    | 'Notifications'
    | 'OSD'
    | 'Custom Modules';

const CurrentPage = Variable<Page>('General');

const pagerMap: Page[] = [
    'General',
    'Bar',
    'Notifications',
    'OSD',
    'Power Menu',
    'Clock Menu',
    'Dashboard Menu',
    'Custom Modules',
];

export const SettingsMenu = (): GBox => {
    return Widget.Box({
        vertical: true,
        children: CurrentPage.bind('value').as((v) => {
            return [
                Widget.Box({
                    class_name: 'option-pages-container',
                    hpack: 'center',
                    hexpand: true,
                    children: pagerMap.map((page) => {
                        return Widget.Button({
                            hpack: 'center',
                            class_name: `pager-button ${v === page ? 'active' : ''}`,
                            label: page,
                            on_primary_click: () => (CurrentPage.value = page),
                        });
                    }),
                }),
                Widget.Stack({
                    vexpand: true,
                    class_name: 'themes-menu-stack',
                    children: {
                        General: BarGeneral(),
                        Bar: BarSettings(),
                        Notifications: NotificationSettings(),
                        OSD: OSDSettings(),
                        'Clock Menu': ClockMenuSettings(),
                        'Dashboard Menu': DashboardMenuSettings(),
                        'Custom Modules': CustomModuleSettings(),
                        'Power Menu': PowerMenuSettings(),
                    },
                    shown: CurrentPage.bind('value'),
                }),
            ];
        }),
    });
};
