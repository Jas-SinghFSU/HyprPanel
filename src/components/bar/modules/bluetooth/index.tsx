import { bluetoothService } from 'src/lib/constants/services.js';
import options from 'src/options.js';
import { openMenu } from '../../utils/menu.js';
import { BarBoxChild } from 'src/lib/types/bar.js';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import { Variable, bind } from 'astal';
import { onMiddleClick, onPrimaryClick, onScroll, onSecondaryClick } from 'src/lib/shared/eventHandlers.js';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { Astal } from 'astal/gtk3';

const { rightClick, middleClick, scrollDown, scrollUp } = options.bar.bluetooth;

const Bluetooth = (): BarBoxChild => {
    const BluetoothIcon = ({ isPowered }: BluetoothIconProps): JSX.Element => (
        <label className={'bar-button-icon bluetooth txt-icon bar'} label={isPowered ? '󰂯' : '󰂲'} />
    );

    const BluetoothLabel = ({ isPowered, devices }: BluetoothLabelProps): JSX.Element => {
        const connectDevices = devices.filter((device) => device.connected);

        const label =
            isPowered && connectDevices.length ? ` Connected (${connectDevices.length})` : isPowered ? 'On' : 'Off';

        return <label label={label} className={'bar-button-label bluetooth'} />;
    };

    const componentClassName = Variable.derive(
        [options.theme.bar.buttons.style, options.bar.bluetooth.label],
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

    const componentBinding = Variable.derive(
        [
            bind(options.bar.bluetooth.label),
            bind(bluetoothService, 'isPowered'),
            bind(bluetoothService, 'devices'),

            bind(bluetoothService, 'isConnected'),
        ],
        (showLabel: boolean, isPowered: boolean, devices: AstalBluetooth.Device[]): JSX.Element => {
            if (showLabel) {
                return (
                    <box>
                        <BluetoothIcon isPowered={isPowered} />
                        <BluetoothLabel isPowered={isPowered} devices={devices} />
                    </box>
                );
            }

            return <BluetoothIcon isPowered={isPowered} />;
        },
    );

    const component = <box className={componentClassName()}>{componentBinding()}</box>;

    return {
        component,
        isVisible: true,
        boxClass: 'bluetooth',
        props: {
            setup: (self: Astal.Button): void => {
                let disconnectFunctions: (() => void)[] = [];

                Variable.derive(
                    [
                        bind(rightClick),
                        bind(middleClick),
                        bind(scrollUp),
                        bind(scrollDown),
                        bind(options.bar.scrollSpeed),
                    ],
                    () => {
                        disconnectFunctions.forEach((disconnect) => disconnect());
                        disconnectFunctions = [];

                        const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.get());

                        disconnectFunctions.push(
                            onPrimaryClick(self, (clicked, event) => {
                                openMenu(clicked, event, 'bluetoothmenu');
                            }),
                        );

                        disconnectFunctions.push(
                            onSecondaryClick(self, (clicked, event) => {
                                runAsyncCommand(rightClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(
                            onMiddleClick(self, (clicked, event) => {
                                runAsyncCommand(middleClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(onScroll(self, throttledHandler, scrollUp.get(), scrollDown.get()));
                    },
                );
            },
            onDestroy: (): void => {
                componentClassName.drop();
                componentBinding.drop();
            },
        },
    };
};

interface BluetoothIconProps {
    isPowered: boolean;
}

interface BluetoothLabelProps {
    isPowered: boolean;
    devices: AstalBluetooth.Device[];
}

export { Bluetooth };
