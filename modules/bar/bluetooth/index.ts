const bluetooth = await Service.import('bluetooth')
import Gdk from 'gi://Gdk?version=3.0';
import options from "options";
import { openMenu } from "../utils.js";

const Bluetooth = () => {
    const btIcon = Widget.Label({
        label: bluetooth.bind("enabled").as((v) => v ? "󰂯" : "󰂲"),
        class_name: "bar-button-icon bluetooth",
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
            class_name: "volume",
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
