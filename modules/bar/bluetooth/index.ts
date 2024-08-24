const bluetooth = await Service.import('bluetooth')
import Gdk from 'gi://Gdk?version=3.0';
import options from "options";
import { openMenu } from "../utils.js";

const { label } = options.bar.bluetooth;

const Bluetooth = () => {
    const btIcon = Widget.Label({
        label: bluetooth.bind("enabled").as((v) => v ? "󰂯" : "󰂲"),
        class_name: "bar-button-icon bluetooth txt-icon bar",
    });

    const btText = Widget.Label({
        label: Utils.merge([
            bluetooth.bind("enabled"),
            bluetooth.bind("connected_devices"),
        ],
            (btEnabled, btDevices) => {
                return btEnabled && btDevices.length ? ` Connected (${btDevices.length})`
                    : btEnabled ? "On"
                        : "Off"

            }),
        class_name: "bar-button-label bluetooth",
    });

    return {
        component: Widget.Box({
            className: Utils.merge([options.theme.bar.buttons.style.bind("value"), label.bind("value")], (style, showLabel) => {
                const styleMap = {
                    default: "style1",
                    split: "style2",
                    wave: "style3",
                };
                return `bluetooth ${styleMap[style]} ${!showLabel ? "no-label" : ""}`;
            }),
            children: options.bar.bluetooth.label.bind("value").as((showLabel) => {
                if (showLabel) {
                    return [btIcon, btText];
                }
                return [btIcon];
            }),
        }),
        isVisible: true,
        boxClass: "bluetooth",
        props: {
            on_primary_click: (clicked: any, event: Gdk.Event) => {
                openMenu(clicked, event, "bluetoothmenu");
            },
        },
    };

}

export { Bluetooth }
