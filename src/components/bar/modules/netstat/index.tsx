import { Module } from '../../shared/module';
import NetworkService from 'src/services/system/network';
import { bind, Variable } from 'astal';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from '../../types';
import { NetstatLabelType } from 'src/services/system/types';
import { InputHandlerService } from '../../utils/input/inputHandler';
import options from 'src/configuration';
import { cycleArray, setupNetworkServiceBindings } from './helpers';

const inputHandler = InputHandlerService.getInstance();
const networkService = NetworkService.getInstance();
const astalNetworkService = AstalNetwork.get_default();

const NETWORK_LABEL_TYPES: NetstatLabelType[] = ['full', 'in', 'out'];

const {
    label,
    labelType,
    dynamicIcon,
    icon,
    networkInLabel,
    networkOutLabel,
    leftClick,
    rightClick,
    middleClick,
} = options.bar.customModules.netstat;

setupNetworkServiceBindings();

export const Netstat = (): BarBoxChild => {
    const renderNetworkLabel = (
        lblType: NetstatLabelType,
        networkData: { in: string; out: string },
    ): string => {
        switch (lblType) {
            case 'in':
                return `${networkInLabel.get()} ${networkData.in}`;
            case 'out':
                return `${networkOutLabel.get()} ${networkData.out}`;
            default:
                return `${networkInLabel.get()} ${networkData.in} ${networkOutLabel.get()} ${networkData.out}`;
        }
    };

    const iconBinding = Variable.derive(
        [
            bind(astalNetworkService, 'primary'),
            bind(astalNetworkService, 'wifi'),
            bind(astalNetworkService, 'wired'),
        ],
        (primary, wifi, wired) => {
            if (primary === AstalNetwork.Primary.WIRED) {
                return wired?.icon_name;
            }
            return wifi?.icon_name;
        },
    );

    const labelBinding = Variable.derive(
        [bind(networkService.network), bind(labelType)],
        (networkData, lblType: NetstatLabelType) => renderNetworkLabel(lblType, networkData),
    );

    const netstatModule = Module({
        useTextIcon: bind(dynamicIcon).as((useDynamicIcon) => !useDynamicIcon),
        icon: iconBinding(),
        textIcon: bind(icon),
        label: labelBinding(),
        tooltipText: bind(labelType).as((lblType) => {
            return lblType === 'full' ? 'Ingress / Egress' : lblType === 'in' ? 'Ingress' : 'Egress';
        }),
        boxClass: 'netstat',
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler.attachHandlers(self, {
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
                            const nextLabelType = cycleArray(NETWORK_LABEL_TYPES, labelType.get(), 'next');
                            labelType.set(nextLabelType);
                        },
                    },
                    onScrollDown: {
                        fn: () => {
                            const prevLabelType = cycleArray(NETWORK_LABEL_TYPES, labelType.get(), 'prev');
                            labelType.set(prevLabelType);
                        },
                    },
                });
            },
            onDestroy: () => {
                labelBinding.drop();
                iconBinding.drop();
                networkService.stopPoller();
            },
        },
    });

    return netstatModule;
};
