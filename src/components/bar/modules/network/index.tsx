import { networkService } from 'src/lib/constants/services.js';
import options from 'src/options';
import { openMenu } from '../../utils/menu';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import { bind, Variable } from 'astal';
import { onPrimaryClick, onSecondaryClick, onMiddleClick, onScroll } from 'src/lib/shared/eventHandlers';
import { Astal, Gtk } from 'astal/gtk3';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { BarBoxChild } from 'src/lib/types/bar.js';
import { formatWifiInfo, wiredIcon, wirelessIcon } from './helpers';

const { label, truncation, truncation_size, rightClick, middleClick, scrollDown, scrollUp, showWifiInfo } =
    options.bar.network;

const Network = (): BarBoxChild => {
    const iconBinding = Variable.derive(
        [bind(networkService, 'primary'), bind(wiredIcon), bind(wirelessIcon)],
        (primaryNetwork, wiredIcon, wifiIcon) => {
            const isWired = primaryNetwork === AstalNetwork.Primary.WIRED;
            const iconName = isWired ? wiredIcon : wifiIcon;

            return iconName;
        },
    );

    const networkIcon = <icon className={'bar-button-icon network-icon'} icon={iconBinding()} />;

    const networkLabel = Variable.derive(
        [
            bind(networkService, 'primary'),
            bind(networkService, 'wifi'),
            bind(label),
            bind(truncation),
            bind(truncation_size),
            bind(showWifiInfo),
        ],
        (primaryNetwork, networkWifi, showLabel, trunc, tSize, showWifiInfo) => {
            if (!showLabel) {
                return <box />;
            }
            if (primaryNetwork === AstalNetwork.Primary.WIRED) {
                return <label className={'bar-button-label network-label'} label={'Wired'.substring(0, tSize)} />;
            }
            return (
                <label
                    className={'bar-button-label network-label'}
                    label={
                        networkWifi?.ssid ? `${trunc ? networkWifi.ssid.substring(0, tSize) : networkWifi.ssid}` : '--'
                    }
                    tooltipText={showWifiInfo ? formatWifiInfo(networkWifi) : ''}
                />
            );
        },
    );

    const componentClassName = Variable.derive(
        [bind(options.theme.bar.buttons.style), bind(options.bar.network.label)],
        (style, showLabel) => {
            const styleMap = {
                default: 'style1',
                split: 'style2',
                wave: 'style3',
                wave2: 'style3',
            };
            return `network-container ${styleMap[style]} ${!showLabel ? 'no-label' : ''}`;
        },
    );

    const componentChildren = [networkIcon, networkLabel()];

    const component = (
        <box
            vexpand
            valign={Gtk.Align.FILL}
            className={componentClassName()}
            onDestroy={() => {
                iconBinding.drop();
                networkLabel.drop();
                componentClassName.drop();
            }}
        >
            {componentChildren}
        </box>
    );

    return {
        component,
        isVisible: true,
        boxClass: 'network',
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
                                openMenu(clicked, event, 'networkmenu');
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
        },
    };
};

export { Network };
