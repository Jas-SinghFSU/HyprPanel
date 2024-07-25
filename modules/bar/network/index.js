const network = await Service.import("network");
import options from "options";
import { openMenu } from "../utils.js";

const Network = () => {
    const wifiIndicator = [
        Widget.Icon({
            class_name: "bar-network-icon",
            icon: network.wifi.bind("icon_name"),
        }),
        Widget.Label({
            class_name: "bar-network-label",
            label: Utils.merge(
                [network.bind("wifi"), options.bar.network.label.bind("value")],
                (wifi, showLabel) => {
                    if (showLabel) {
                        return wifi.ssid ? `  ${wifi.ssid.substring(0, 7)}` : "  --";
                    }
                    return "";
                },
            ),
        }),
    ];

    const wiredIndicator = [
        Widget.Icon({
            class_name: "bar-network-icon",
            icon: network.wired.bind("icon_name"),
        }),
        Widget.Label({
            class_name: "bar-network-label",
            label: Utils.merge(
                [network.bind("wired"), options.bar.network.label.bind("value")],
                (_, showLabel) => {
                    if (showLabel) {
                        return "  Wired";
                    }
                    return "";
                },
            ),
        }),
    ];

    return {
        component: Widget.Box({
            vpack: "center",
            class_name: "bar-network",
            children: network
                .bind("primary")
                .as((w) => (w === "wired" ? wiredIndicator : wifiIndicator)),
        }),
        isVisible: true,
        boxClass: "network",
        props: {
            on_primary_click: (clicked, event) => {
                openMenu(clicked, event, "networkmenu");
            },
        },
    };
};

export { Network };
