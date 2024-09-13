import Gdk from 'gi://Gdk?version=3.0';
import { openMenu } from '../utils.js';
import options from 'options';
import { BarBoxChild, SelfButton } from 'lib/types/bar.js';

const Menu = (): BarBoxChild => {
    return {
        component: Widget.Box({
            className: Utils.merge([options.theme.bar.buttons.style.bind('value')], (style) => {
                const styleMap = {
                    default: 'style1',
                    split: 'style2',
                    wave: 'style3',
                    wave2: 'style3',
                };
                return `dashboard ${styleMap[style]}`;
            }),
            child: Widget.Label({
                class_name: 'bar-menu_label bar-button_icon txt-icon bar',
                label: options.bar.launcher.icon.bind('value'),
            }),
        }),
        isVisible: true,
        boxClass: 'dashboard',
        props: {
            on_primary_click: (clicked: SelfButton, event: Gdk.Event): void => {
                openMenu(clicked, event, 'dashboardmenu');
            },
        },
    };
};

export { Menu };
