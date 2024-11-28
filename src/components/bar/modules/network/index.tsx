import { network } from 'src/lib/constants/services.js';
import options from 'src/options';
import { openMenu } from '../../utils/menu';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import { GtkWidget } from 'src/lib/types/widget';
import { bind, Variable } from 'astal';
import { onPrimaryClick, onSecondaryClick, onMiddleClick, onScroll } from 'src/lib/shared/eventHandlers';
import { Gtk } from 'astal/gtk3';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { useHook } from 'src/lib/shared/hookHandler';
import { formatWifiInfo } from './helpers.js';

const { label, truncation, truncation_size, rightClick, middleClick, scrollDown, scrollUp, showWifiInfo } =
    options.bar.network;

const networkIcon = (
    <icon
        className={'bar-button-icon network-icon'}
        icon={Variable.derive(
            [bind(network, 'primary'), bind(network, 'wifi'), bind(network, 'wired')],
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
        bind(network, 'primary'),
        bind(network, 'wifi'),
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
    <box vexpand={true} valign={Gtk.Align.FILL} className={componentClassName()}>
        {componentChildren}
    </box>
);

const Network = (): GtkWidget => {
    return {
        component,
        isVisible: true,
        boxClass: 'network',
        props: {
            setup: (self: GtkWidget): void => {
                useHook(self, options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.value);

                    const disconnectPrimary = onPrimaryClick(self, (clicked, event) => {
                        openMenu(clicked, event, 'networkmenu');
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

export { Network };
