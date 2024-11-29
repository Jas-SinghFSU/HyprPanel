import { networkService } from 'src/lib/constants/services';
import options from 'src/options';
import { module } from '../../utils/module';
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
    round,
    leftClick,
    rightClick,
    middleClick,
    pollingInterval,
} = options.bar.customModules.netstat;

export const networkUsage = Variable<NetworkResourceData>(GET_DEFAULT_NETSTAT_DATA(rateUnit.value));

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
                return `↓ ${networkService.in}`;
            case 'out':
                return `↑ ${networkService.out}`;
            default:
                return `↓ ${networkService.in} ↑ ${networkService.out}`;
        }
    };

    const netstatModule = module({
        useTextIcon: bind(dynamicIcon).as((useDynamicIcon) => !useDynamicIcon),
        icon: Variable.derive(
            [bind(networkService, 'primary'), bind(networkService, 'wifi'), bind(networkService, 'wired')],
            (pmry, wfi, wrd) => {
                if (pmry === AstalNetwork.Primary.WIRED) {
                    return wrd.icon_name;
                }
                return wfi.icon_name;
            },
        )(),
        textIcon: bind(icon),
        label: Variable.derive(
            [bind(networkUsage), bind(labelType)],
            (networkService: NetworkResourceData, lblTyp: NetstatLabelType) =>
                renderNetworkLabel(lblTyp, networkService),
        )(),
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
                            labelType.value = NETWORK_LABEL_TYPES[
                                (NETWORK_LABEL_TYPES.indexOf(labelType.value) + 1) % NETWORK_LABEL_TYPES.length
                            ] as NetstatLabelType;
                        },
                    },
                    onScrollDown: {
                        fn: () => {
                            labelType.value = NETWORK_LABEL_TYPES[
                                (NETWORK_LABEL_TYPES.indexOf(labelType.value) - 1 + NETWORK_LABEL_TYPES.length) %
                                    NETWORK_LABEL_TYPES.length
                            ] as NetstatLabelType;
                        },
                    },
                });
            },
        },
    });

    return netstatModule;
};
