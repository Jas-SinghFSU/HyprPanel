import { bluetoothService } from 'src/lib/constants/services.js';
import options from 'src/options.js';
import { openMenu } from '../../utils/menu.js';
import { BarBoxChild } from 'src/lib/types/bar.js';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import { bind } from 'astal/binding.js';
import Variable from 'astal/variable.js';
import { GtkWidget } from 'src/lib/types/widget.js';
import { useHook } from 'src/lib/shared/hookHandler.js';
import { onMiddleClick, onPrimaryClick, onScroll, onSecondaryClick } from 'src/lib/shared/eventHandlers.js';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { Astal } from 'astal/gtk3';

const { rightClick, middleClick, scrollDown, scrollUp } = options.bar.bluetooth;

const Bluetooth = (): BarBoxChild => {
    const btIcon = (isPowered: boolean): GtkWidget => (
        <label className={'bar-button-icon bluetooth txt-icon bar'} label={isPowered ? '󰂯' : '󰂲'} />
    );
    const btText = (isPowered: boolean, devices: AstalBluetooth.Device[]): GtkWidget => {
        const connectDevices = devices.filter((device) => device.connected);

        const label =
            isPowered && connectDevices.length ? ` Connected (${connectDevices.length})` : isPowered ? 'On' : 'Off';

        return <label label={label} className={'bar-button-label bluetooth'} />;
    };

    const componentClassName = Variable.derive(
        [options.theme.bar.buttons.style, options.bar.volume.label],
        (style, showLabel) => {
            const styleMap = {
                default: 'style1',
                split: 'style2',
                wave: 'style3',
                wave2: 'style3',
            };
            return `bluetooth-container ${styleMap[style]} ${!showLabel ? 'no-label' : ''}`;
        },
    );

    const component = (
        <box className={componentClassName()}>
            {Variable.derive(
                [
                    bind(options.bar.volume.label),
                    bind(bluetoothService, 'isPowered'),
                    bind(bluetoothService, 'devices'),
                ],
                (showLabel: boolean, isPowered: boolean, devices: AstalBluetooth.Device[]): GtkWidget[] => {
                    if (showLabel) {
                        return [btIcon(isPowered), btText(isPowered, devices)];
                    }
                    return [btIcon(isPowered)];
                },
            )()}
        </box>
    );

    return {
        component,
        isVisible: true,
        boxClass: 'bluetooth',
        props: {
            setup: (self: Astal.Button): void => {
                useHook(self, options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.value);

                    const disconnectPrimary = onPrimaryClick(self, (clicked, event) => {
                        openMenu(clicked, event, 'audiomenu');
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

export { Bluetooth };