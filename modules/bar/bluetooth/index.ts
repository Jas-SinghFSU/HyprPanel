const bluetooth = await Service.import('bluetooth');
import Gdk from 'gi://Gdk?version=3.0';
import options from 'options';
import { openMenu } from '../utils.js';
import { BarBoxChild } from 'lib/types/bar.js';
import Button from 'types/widgets/button.js';
import { Attribute, Child } from 'lib/types/widget.js';
import { runAsyncCommand, throttledScrollHandler } from 'customModules/utils.js';

const { label, rightClick, middleClick, scrollDown, scrollUp } = options.bar.bluetooth;

const Bluetooth = (): BarBoxChild => {
    const btIcon = Widget.Label({
        label: bluetooth.bind('enabled').as((v) => (v ? '󰂯' : '󰂲')),
        class_name: 'bar-button-icon bluetooth txt-icon bar',
    });

    const btText = Widget.Label({
        label: Utils.merge([bluetooth.bind('enabled'), bluetooth.bind('connected_devices')], (btEnabled, btDevices) => {
            return btEnabled && btDevices.length ? ` Connected (${btDevices.length})` : btEnabled ? 'On' : 'Off';
        }),
        class_name: 'bar-button-label bluetooth',
    });

    return {
        component: Widget.Box({
            className: Utils.merge(
                [options.theme.bar.buttons.style.bind('value'), label.bind('value')],
                (style, showLabel) => {
                    const styleMap = {
                        default: 'style1',
                        split: 'style2',
                        wave: 'style3',
                        wave2: 'style3',
                    };
                    return `bluetooth-container ${styleMap[style]} ${!showLabel ? 'no-label' : ''}`;
                },
            ),
            children: options.bar.bluetooth.label.bind('value').as((showLabel) => {
                if (showLabel) {
                    return [btIcon, btText];
                }
                return [btIcon];
            }),
        }),
        isVisible: true,
        boxClass: 'bluetooth',
        props: {
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
            on_primary_click: (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                openMenu(clicked, event, 'bluetoothmenu');
            },
        },
    };
};

export { Bluetooth };
