import Gdk from 'gi://Gdk?version=3.0';
const network = await Service.import('network');
import options from 'options';
import { openMenu } from '../utils.js';
import { BarBoxChild } from 'lib/types/bar.js';
import Button from 'types/widgets/button.js';
import { Attribute, Child } from 'lib/types/widget.js';
import { runAsyncCommand, throttledScrollHandler } from 'customModules/utils.js';
import { Wifi } from 'types/service/network.js';

const formatFrequency = (frequency: number): string => {
    return `${(frequency / 1000).toFixed(2)}MHz`;
};

const formatWifiInfo = (wifi: Wifi): string => {
    const netSsid = wifi.ssid === '' ? 'None' : wifi.ssid;
    const wifiStrength = wifi.strength >= 0 ? wifi.strength : '--';
    const wifiFreq = wifi.frequency >= 0 ? formatFrequency(wifi.frequency) : '--';

    return `Network: ${netSsid} \nSignal Strength: ${wifiStrength}% \nFrequency: ${wifiFreq}`;
};

const {
    label: networkLabel,
    truncation,
    truncation_size,
    rightClick,
    middleClick,
    scrollDown,
    scrollUp,
    showWifiInfo,
} = options.bar.network;

const Network = (): BarBoxChild => {
    return {
        component: Widget.Box({
            vpack: 'fill',
            vexpand: true,
            className: Utils.merge(
                [options.theme.bar.buttons.style.bind('value'), networkLabel.bind('value')],
                (style, showLabel) => {
                    const styleMap = {
                        default: 'style1',
                        split: 'style2',
                        wave: 'style3',
                        wave2: 'style3',
                    };
                    return `network-container ${styleMap[style]}${!showLabel ? ' no-label' : ''}`;
                },
            ),
            children: [
                Widget.Icon({
                    class_name: 'bar-button-icon network-icon',
                    icon: Utils.merge(
                        [network.bind('primary'), network.bind('wifi'), network.bind('wired')],
                        (pmry, wfi, wrd) => {
                            if (pmry === 'wired') {
                                return wrd.icon_name;
                            }
                            return wfi.icon_name;
                        },
                    ),
                }),
                Widget.Box({
                    child: Utils.merge(
                        [
                            network.bind('primary'),
                            network.bind('wifi'),
                            networkLabel.bind('value'),
                            truncation.bind('value'),
                            truncation_size.bind('value'),
                            showWifiInfo.bind('value'),
                        ],
                        (pmry, wfi, showLbl, trunc, tSize, showWfiInfo) => {
                            if (!showLbl) {
                                return Widget.Box();
                            }
                            if (pmry === 'wired') {
                                return Widget.Label({
                                    class_name: 'bar-button-label network-label',
                                    label: 'Wired'.substring(0, tSize),
                                });
                            }
                            return Widget.Label({
                                class_name: 'bar-button-label network-label',
                                label: wfi.ssid ? `${trunc ? wfi.ssid.substring(0, tSize) : wfi.ssid}` : '--',
                                tooltipText: showWfiInfo ? formatWifiInfo(wfi) : '',
                            });
                        },
                    ),
                }),
            ],
        }),
        isVisible: true,
        boxClass: 'network',
        props: {
            on_primary_click: (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                openMenu(clicked, event, 'networkmenu');
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

export { Network };
