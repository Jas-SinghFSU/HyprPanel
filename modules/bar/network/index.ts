import Gdk from 'gi://Gdk?version=3.0';
const network = await Service.import("network");
import options from "options";
import { openMenu } from "../utils.js";

const { label: networkLabel, truncation, truncation_size } = options.bar.network;

const Network = () => {
    return {
        component: Widget.Box({
            vpack: "fill",
            vexpand: true,
            className: Utils.merge([options.theme.bar.buttons.style.bind("value"), networkLabel.bind("value")], (style, showLabel) => {
                const styleMap = {
                    default: "style1",
                    split: "style2",
                    wave: "style3",
                };
                return `network ${styleMap[style]}${!showLabel ? " no-label" : ""}`;
            }),
            children: [
                Widget.Icon({
                    class_name: "bar-button-icon network",
                    icon: Utils.merge([
                        network.bind("primary"),
                        network.bind("wifi"),
                        network.bind("wired")
                    ], (pmry, wfi, wrd) => {
                        if (pmry === "wired") {
                            return wrd.icon_name;
                        }
                        return wfi.icon_name;
                    })
                }),
                Widget.Box({
                    vpack: "center",
                    child: Utils.merge([
                        network.bind("primary"),
                        network.bind("wifi"),
                        networkLabel.bind("value"),
                        truncation.bind("value"),
                        truncation_size.bind("value")
                    ], (pmry, wfi, showLbl, trunc, tSize) => {
                        if (!showLbl) {
                            return Widget.Box();
                        }
                        if (pmry === "wired") {
                            return Widget.Label({
                                class_name: "bar-button-label network",
                                label: "Wired".substring(0, tSize),
                            })
                        }
                        return Widget.Label({
                            class_name: "bar-button-label network",
                            label: wfi.ssid ? `${trunc ? wfi.ssid.substring(0, tSize) : wfi.ssid}` : "--",
                        })

                    })
                }),
            ]
        }),
        isVisible: true,
        boxClass: "network",
        props: {
            on_primary_click: (clicked: any, event: Gdk.Event) => {
                openMenu(clicked, event, "networkmenu");
            },
        },
    };
};

export { Network };
