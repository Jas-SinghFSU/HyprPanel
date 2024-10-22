import options from 'options';
import { module } from '../module';
import { inputHandler } from 'customModules/utils';
import { computeNetwork } from './computeNetwork';
import { BarBoxChild, NetstatLabelType } from 'lib/types/bar';
import Button from 'types/widgets/button';
import { NetworkResourceData } from 'lib/types/customModules/network';
import { NETWORK_LABEL_TYPES } from 'lib/types/defaults/bar';
import { GET_DEFAULT_NETSTAT_DATA } from 'lib/types/defaults/netstat';
import { pollVariable } from 'customModules/PollVar';
import { Attribute, Child } from 'lib/types/widget';

const {
    label,
    labelType,
    networkInterface,
    rateUnit,
    icon,
    round,
    leftClick,
    rightClick,
    middleClick,
    pollingInterval,
} = options.bar.customModules.netstat;

export const networkUsage = Variable<NetworkResourceData>(GET_DEFAULT_NETSTAT_DATA(rateUnit.value));

pollVariable(
    // Variable to poll and update with the result of the function passed in
    networkUsage,
    // Variables that should trigger the polling function to update when they change
    [rateUnit.bind('value'), networkInterface.bind('value'), round.bind('value')],
    // Interval at which to poll
    pollingInterval.bind('value'),
    // Function to execute to get the network data
    computeNetwork,
    // Optional parameters to pass to the function
    // round is a boolean that determines whether to round the values
    round,
    // Optional parameters to pass to the function
    // networkInterface is the interface name to filter the data
    networkInterface,
    // Optional parameters to pass to the function
    // rateUnit is the unit to display the data in
    // e.g. KiB, MiB, GiB, etc.
    rateUnit,
);

export const Netstat = (): BarBoxChild => {
    const renderNetworkLabel = (lblType: NetstatLabelType, network: NetworkResourceData): string => {
        switch (lblType) {
            case 'in':
                return `↓ ${network.in}`;
            case 'out':
                return `↑ ${network.out}`;
            default:
                return `↓ ${network.in} ↑ ${network.out}`;
        }
    };

    const netstatModule = module({
        textIcon: icon.bind('value'),
        label: Utils.merge(
            [networkUsage.bind('value'), labelType.bind('value')],
            (network: NetworkResourceData, lblTyp: NetstatLabelType) => renderNetworkLabel(lblTyp, network),
        ),
        tooltipText: labelType.bind('value').as((lblTyp) => {
            return lblTyp === 'full' ? 'Ingress / Egress' : lblTyp === 'in' ? 'Ingress' : 'Egress';
        }),
        boxClass: 'netstat',
        showLabelBinding: label.bind('value'),
        props: {
            setup: (self: Button<Child, Attribute>) => {
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
