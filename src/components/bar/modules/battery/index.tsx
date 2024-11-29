import { batteryService } from 'src/lib/constants/services.js';
import { Astal } from 'astal/gtk3';
import { openMenu } from '../../utils/menu';
import options from 'src/options';
import { BarBoxChild } from 'src/lib/types/bar.js';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import Variable from 'astal/variable';
import { bind } from 'astal/binding.js';
import AstalBattery from 'gi://AstalBattery?version=0.1';
import { GtkWidget } from 'src/lib/types/widget';
import { useHook } from 'src/lib/shared/hookHandler';
import { onMiddleClick, onPrimaryClick, onScroll, onSecondaryClick } from 'src/lib/shared/eventHandlers';

const { label: show_label, rightClick, middleClick, scrollUp, scrollDown, hideLabelWhenFull } = options.bar.battery;

const BatteryLabel = (): BarBoxChild => {
    const isVis = Variable(batteryService.isPresent);

    const batIcon = Variable.derive(
        [bind(batteryService, 'percentage'), bind(batteryService, 'charging'), bind(batteryService, 'state')],
        (batPercent: number, batCharging: boolean, state: AstalBattery.State) => {
            const batCharged = state === AstalBattery.State.FULLY_CHARGED;

            if (batCharged) {
                return `battery-level-100-charged-symbolic`;
            } else {
                return `battery-level-${Math.floor(batPercent / 10) * 10}${batCharging ? '-charging' : ''}-symbolic`;
            }
        },
    );

    batteryService.connect('notify', () => {
        isVis.set(batteryService.isPresent);
    });

    const formatTime = (seconds: number): Record<string, number> => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return { hours, minutes };
    };

    const generateTooltip = (timeSeconds: number, isCharging: boolean, isCharged: boolean): string => {
        if (isCharged) {
            return 'Full';
        }

        const { hours, minutes } = formatTime(timeSeconds);
        if (isCharging) {
            return `Time to full: ${hours} h ${minutes} min`;
        } else {
            return `Time to empty: ${hours} h ${minutes} min`;
        }
    };

    const componentClassName = Variable.derive(
        [bind(options.theme.bar.buttons.style), bind(show_label)],
        (style, showLabel) => {
            const styleMap = {
                default: 'style1',
                split: 'style2',
                wave: 'style3',
                wave2: 'style3',
            };
            return `battery-container ${styleMap[style]} ${!showLabel ? 'no-label' : ''}`;
        },
    );

    const componentTooltip = Variable.derive(
        [bind(batteryService, 'charging'), bind(batteryService, 'timeToFull'), bind(batteryService, 'timeToEmpty')],
        (isCharging, timeToFull, timeToEmpty) => {
            if (isCharging) {
                return `Time to full: ${timeToFull}`;
            } else {
                return `Time to empty: ${timeToEmpty}`;
            }
        },
    );

    const componentChildren = Variable.derive(
        [
            bind(batteryService, 'isPresent'),
            bind(show_label),
            bind(batteryService, 'percentage'),
            bind(hideLabelWhenFull),
        ],
        (isPresent, showLabel, percentage, hideLabelWhenFull) => {
            const isCharged = Math.round(percentage) === 100;

            const children: GtkWidget = [];

            const icon = <icon className={'bar-button-icon battery'} icon={batIcon()} />;
            const label = <label className={'bar-button-label battery'} label={`${Math.round(percentage)}%`} />;

            if (!isPresent) {
                return children;
            }

            children.push(icon);

            if (showLabel && !(isCharged && hideLabelWhenFull)) {
                children.push(label);
            }

            return children;
        },
    );
    const component = (
        <box
            className={componentClassName()}
            visible={bind(batteryService, 'isPresent')}
            tooltipText={componentTooltip()}
            setup={(self: GtkWidget) => {
                useHook(self, batteryService, () => {
                    const isCharged = Math.round(batteryService.percentage) === 100;

                    self.tooltipText = generateTooltip(batteryService.timeToFull, batteryService.charging, isCharged);
                });
            }}
        >
            {componentChildren()}
        </box>
    );

    return {
        component,
        isVis,
        boxClass: 'battery',
        props: {
            setup: (self: Astal.Button): void => {
                useHook(self, options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.value);

                    const disconnectPrimary = onPrimaryClick(self, (clicked, event) => {
                        openMenu(clicked, event, 'energymenu');
                    });

                    const disconnectSecondary = onSecondaryClick(self, (clicked, event) => {
                        runAsyncCommand(rightClick.value, { clicked, event });
                    });

                    const disconnectMiddle = onMiddleClick(self, (clicked, event) => {
                        runAsyncCommand(middleClick.value, { clicked, event });
                    });

                    const disconnectScroll = onScroll(self, throttledHandler, scrollUp.value, scrollDown.value);
                    return (): void => {
                        disconnectPrimary();
                        disconnectSecondary();
                        disconnectMiddle();
                        disconnectScroll();
                    };
                });
            },
        },
    };
};

export { BatteryLabel };
