import { networkService } from 'src/lib/constants/services';
import options from 'src/options';
import { Module } from '../../shared/Module';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { computeNetwork } from './helpers';
import { BarBoxChild, NetstatLabelType, RateUnit } from 'src/lib/types/bar';
import { NetworkResourceData } from 'src/lib/types/customModules/network';
import { NETWORK_LABEL_TYPES } from 'src/lib/types/defaults/bar';
import { GET_DEFAULT_NETSTAT_DATA } from 'src/lib/types/defaults/netstat';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { bind, Variable } from 'astal';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { Astal } from 'astal/gtk3';

const {
    label,
    labelType,
    networkInterface,
    rateUnit,
    dynamicIcon,
    icon,
    networkInLabel,
    networkOutLabel,
    round,
    leftClick,
    rightClick,
    middleClick,
    pollingInterval,
} = options.bar.customModules.netstat;

export const networkUsage = Variable<NetworkResourceData>(GET_DEFAULT_NETSTAT_DATA(rateUnit.get()));

const netstatPoller = new FunctionPoller<
    NetworkResourceData,
    [round: Variable<boolean>, interfaceNameVar: Variable<string>, dataType: Variable<RateUnit>]
>(
    networkUsage,
    [bind(rateUnit), bind(networkInterface), bind(round)],
    bind(pollingInterval),
    computeNetwork,
    round,
    networkInterface,
    rateUnit,
);

netstatPoller.initialize('netstat');

export const Netstat = (): BarBoxChild => {
    const renderNetworkLabel = (lblType: NetstatLabelType, networkService: NetworkResourceData): string => {
        switch (lblType) {
            case 'in':
                return `${networkInLabel.get()} ${networkService.in}`;
            case 'out':
                return `${networkOutLabel.get()} ${networkService.out}`;
            default:
                return `${networkInLabel.get()} ${networkService.in} ${networkOutLabel.get()} ${networkService.out}`;
        }
    };

    const iconBinding = Variable.derive(
        [bind(networkService, 'primary'), bind(networkService, 'wifi'), bind(networkService, 'wired')],
        (pmry, wfi, wrd) => {
            if (pmry === AstalNetwork.Primary.WIRED) {
                return wrd?.icon_name;
            }
            return wfi?.icon_name;
        },
    );

    const labelBinding = Variable.derive(
        [bind(networkUsage), bind(labelType)],
        (networkService: NetworkResourceData, lblTyp: NetstatLabelType) => renderNetworkLabel(lblTyp, networkService),
    );

    const netstatModule = Module({
        useTextIcon: bind(dynamicIcon).as((useDynamicIcon) => !useDynamicIcon),
        icon: iconBinding(),
        textIcon: bind(icon),
        label: labelBinding(),
        tooltipText: bind(labelType).as((lblTyp) => {
            return lblTyp === 'full' ? 'Ingress / Egress' : lblTyp === 'in' ? 'Ingress' : 'Egress';
        }),
        boxClass: 'netstat',
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler(self, {
                    onPrimaryClick: {
                        cmd: leftClick,
                    },
                    onSecondaryClick: {
                        cmd: rightClick,
                    },
                    onMiddleClick: {
                        cmd: middleClick,
                    },
                    onScrollUp: {
                        fn: () => {
                            labelType.set(
                                NETWORK_LABEL_TYPES[
                                    (NETWORK_LABEL_TYPES.indexOf(labelType.get()) + 1) % NETWORK_LABEL_TYPES.length
                                ] as NetstatLabelType,
                            );
                        },
                    },
                    onScrollDown: {
                        fn: () => {
                            labelType.set(
                                NETWORK_LABEL_TYPES[
                                    (NETWORK_LABEL_TYPES.indexOf(labelType.get()) - 1 + NETWORK_LABEL_TYPES.length) %
                                        NETWORK_LABEL_TYPES.length
                                ] as NetstatLabelType,
                            );
                        },
                    },
                });
            },
            onDestroy: () => {
                labelBinding.drop();
                iconBinding.drop();
            },
        },
    });

    return netstatModule;
};
