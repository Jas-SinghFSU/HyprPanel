const battery = await Service.import('battery');
import Gdk from 'gi://Gdk?version=3.0';
import { openMenu } from '../utils.js';
import options from 'options';
import { BarBoxChild } from 'lib/types/bar.js';
import Button from 'types/widgets/button.js';
import { Child } from 'lib/types/widget.js';

const { label: show_label } = options.bar.battery;

const BatteryLabel = (): BarBoxChild => {
    const isVis = Variable(battery.available);

    const batIcon = Utils.merge(
        [battery.bind('percent'), battery.bind('charging'), battery.bind('charged')],
        (batPercent: number, batCharging, batCharged) => {
            if (batCharged) return `battery-level-100-charged-symbolic`;
            else return `battery-level-${Math.floor(batPercent / 10) * 10}${batCharging ? '-charging' : ''}-symbolic`;
        },
    );

    battery.connect('changed', ({ available }) => {
        isVis.value = available;
    });

    const formatTime = (seconds: number): Record<string, number> => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return { hours, minutes };
    };

    const generateTooltip = (timeSeconds: number, isCharging: boolean, isCharged: boolean): string => {
        if (isCharged) {
            return 'Fully Charged!!!';
        }

        const { hours, minutes } = formatTime(timeSeconds);
        if (isCharging) {
            return `${hours} hours ${minutes} minutes until full`;
        } else {
            return `${hours} hours ${minutes} minutes left`;
        }
    };

    return {
        component: Widget.Box({
            className: Utils.merge(
                [options.theme.bar.buttons.style.bind('value'), show_label.bind('value')],
                (style, showLabel) => {
                    const styleMap = {
                        default: 'style1',
                        split: 'style2',
                        wave: 'style3',
                        wave2: 'style3',
                    };
                    return `battery ${styleMap[style]} ${!showLabel ? 'no-label' : ''}`;
                },
            ),
            visible: battery.bind('available'),
            tooltip_text: battery.bind('time_remaining').as((t) => t.toString()),
            children: Utils.merge([battery.bind('available'), show_label.bind('value')], (batAvail, showLabel) => {
                if (batAvail && showLabel) {
                    return [
                        Widget.Icon({
                            class_name: 'bar-button-icon battery',
                            icon: batIcon,
                        }),
                        Widget.Label({
                            class_name: 'bar-button-label battery',
                            label: battery.bind('percent').as((p) => `${Math.floor(p)}%`),
                        }),
                    ];
                } else if (batAvail && !showLabel) {
                    return [
                        Widget.Icon({
                            class_name: 'bar-button-icon battery',
                            icon: batIcon,
                        }),
                    ];
                } else {
                    return [];
                }
            }),
            setup: (self) => {
                self.hook(battery, () => {
                    if (battery.available) {
                        self.tooltip_text = generateTooltip(battery.time_remaining, battery.charging, battery.charged);
                    }
                });
            },
        }),
        isVis,
        boxClass: 'battery',
        props: {
            on_primary_click: (clicked: Button<Child, Child>, event: Gdk.Event): void => {
                openMenu(clicked, event, 'energymenu');
            },
        },
    };
};

export { BatteryLabel };
