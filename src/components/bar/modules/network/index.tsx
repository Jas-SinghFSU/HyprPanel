import { networkService } from 'src/lib/constants/services.js';
import options from 'src/options';
import { openMenu } from '../../utils/menu';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import { bind, Variable } from 'astal';
import { onPrimaryClick, onSecondaryClick, onMiddleClick, onScroll } from 'src/lib/shared/eventHandlers';
import { Astal, Gtk } from 'astal/gtk3';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { useHook } from 'src/lib/shared/hookHandler';
import { formatWifiInfo } from './helpers/index.js';
import { BarBoxChild } from 'src/lib/types/bar.js';

const { label, truncation, truncation_size, rightClick, middleClick, scrollDown, scrollUp, showWifiInfo } =
    options.bar.network;

const networkIcon = (
    <icon
        className={'bar-button-icon network-icon'}
        icon={Variable.derive(
            [bind(networkService, 'primary'), bind(networkService, 'wifi'), bind(networkService, 'wired')],
            (primaryNetwork, networkWifi, networkWired) => {
                let iconName = networkWifi?.icon_name;
                if (primaryNetwork === AstalNetwork.Primary.WIRED) {
                    iconName = networkWired.icon_name;
                }
                return iconName;
            },
        )()}
    />
);

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
                label={networkWifi.ssid ? `${trunc ? networkWifi.ssid.substring(0, tSize) : networkWifi.ssid}` : '--'}
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
    <box vexpand valign={Gtk.Align.FILL} className={componentClassName()}>
        {componentChildren}
    </box>
);

const Network = (): BarBoxChild => {
    return {
        component,
        isVisible: true,
        boxClass: 'network',
        props: {
            setup: (self: Astal.Button): void => {
                useHook(self, options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.get());

                    const disconnectPrimary = onPrimaryClick(self, (clicked, event) => {
                        openMenu(clicked, event, 'networkmenu');
                    });

                    const disconnectSecondary = onSecondaryClick(self, (clicked, event) => {
                        runAsyncCommand(rightClick.get(), { clicked, event });
                    });

                    const disconnectMiddle = onMiddleClick(self, (clicked, event) => {
                        runAsyncCommand(middleClick.get(), { clicked, event });
                    });

                    const disconnectScroll = onScroll(self, throttledHandler, scrollUp.get(), scrollDown.get());
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

export { Network };
