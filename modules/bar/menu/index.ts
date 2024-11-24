import { runAsyncCommand, throttledScrollHandler } from 'customModules/utils.js';
import { Gdk } from 'astal/gtk3';
import { BarBoxChild } from 'lib/types/bar.js';
import { GtkWidget } from 'lib/types/widget.js';
import options from 'options';
import { openMenu } from '../utils.js';
import { getDistroIcon } from 'lib/utils.js';

const { rightClick, middleClick, scrollUp, scrollDown, autoDetectIcon, icon } = options.bar.launcher;

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
                label: Utils.merge([autoDetectIcon.bind('value'), icon.bind('value')], (autoDetect, icon): string => {
                    return autoDetect ? getDistroIcon() : icon;
                }),
            }),
        }),
        isVisible: true,
        boxClass: 'dashboard',
        props: {
            on_primary_click: (clicked: GtkWidget, event: Gdk.Event): void => {
                openMenu(clicked, event, 'dashboardmenu');
            },
            setup: (self: GtkWidget): void => {
                self.hook(options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.value);

                    self.on_secondary_click = (clicked: GtkWidget, event: Gdk.Event): void => {
                        runAsyncCommand(rightClick.value, { clicked, event });
                    };
                    self.on_middle_click = (clicked: GtkWidget, event: Gdk.Event): void => {
                        runAsyncCommand(middleClick.value, { clicked, event });
                    };
                    self.on_scroll_up = (clicked: GtkWidget, event: Gdk.Event): void => {
                        throttledHandler(scrollUp.value, { clicked, event });
                    };
                    self.on_scroll_down = (clicked: GtkWidget, event: Gdk.Event): void => {
                        throttledHandler(scrollDown.value, { clicked, event });
                    };
                });
            },
        },
    };
};

export { Menu };
