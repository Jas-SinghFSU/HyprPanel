import Gdk from 'gi://Gdk?version=3.0';
import { openMenu } from '../utils.js';
import options from 'options';
import { BarBoxChild } from 'lib/types/bar.js';
import Button from 'types/widgets/button.js';
import { Attribute, Child } from 'lib/types/widget.js';
import { runAsyncCommand, throttledScrollHandler } from 'customModules/utils.js';

const { rightClick, middleClick, scrollUp, scrollDown } = options.bar.launcher;

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
            on_primary_click: (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                openMenu(clicked, event, 'dashboardmenu');
            },
            setup: (self: Button<Child, Attribute>): void => {
                self.hook(options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.value);

                    self.on_secondary_click = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        runAsyncCommand(rightClick.value, { clicked, event });
                    };
                    self.on_middle_click = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        runAsyncCommand(middleClick.value, { clicked, event });
                    };
                    self.on_scroll_up = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        throttledHandler(scrollUp.value, { clicked, event });
                    };
                    self.on_scroll_down = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        throttledHandler(scrollDown.value, { clicked, event });
                    };
                });
            },
        },
    };
};

export { Menu };
