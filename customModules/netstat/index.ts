import options from "options";
import { module } from "../module"

import { inputHandler } from "customModules/utils";
import { computeNetwork } from "./computeNetwork";
import { NetstatLabelType } from "lib/types/bar";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import Button from "types/widgets/button";
import { NetworkResourceData } from "lib/types/customModules/network";
import { NETWORK_LABEL_TYPES } from "lib/types/defaults/bar";
import { GET_DEFAULT_NETSTAT_DATA } from "lib/types/defaults/netstat";

const {
    label,
    labelType,
    rateUnit,
    icon,
    round,
    leftClick,
    rightClick,
    middleClick,
    pollingInterval
} = options.bar.customModules.netstat;

export const Netstat = () => {
    const networkUsage = Variable(GET_DEFAULT_NETSTAT_DATA(rateUnit.value),
        {
            poll: [
                pollingInterval.value,
                () => {
                    return computeNetwork(round, "enp42s0", rateUnit.value);
                }
            ],
        },
    );

    const renderNetworkLabel = (labelType: NetstatLabelType, network: NetworkResourceData) => {
        switch (labelType) {
            case "in":
                return `↓ ${network.in}`;
            case "out":
                return `↑ ${network.out}`;
            default:
                return `↓ ${network.in} ↑ ${network.out}`;
        }
    };

    const networkModule = module({
        textIcon: icon.bind("value"),
        label: Utils.merge(
            [networkUsage.bind("value"), labelType.bind("value")],
            (network: NetworkResourceData, lblTyp: NetstatLabelType) => {
                return renderNetworkLabel(lblTyp, network);
            }),
        tooltipText: labelType.bind("value").as(lblTyp => {
            return lblTyp === "full" ? "Ingress / Egress" : lblTyp === "in" ? "Ingress" : "Egress";
        }),
        boxClass: "netstat",
        showLabel: label.bind("value"),
        props: {
            setup: (self: Button<Gtk.Widget, Gtk.Widget>) => {
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
                            labelType.value = NETWORK_LABEL_TYPES[(NETWORK_LABEL_TYPES.indexOf(labelType.value) + 1) % NETWORK_LABEL_TYPES.length] as NetstatLabelType;
                        }
                    },
                    onScrollDown: {
                        fn: () => {
                            labelType.value = NETWORK_LABEL_TYPES[(NETWORK_LABEL_TYPES.indexOf(labelType.value) - 1 + NETWORK_LABEL_TYPES.length) % NETWORK_LABEL_TYPES.length] as NetstatLabelType;
                        }
                    },
                });
            },
        }
    });

    return networkModule;
}
