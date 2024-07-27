const bluetooth = await Service.import('bluetooth')
import Gdk from 'gi://Gdk?version=3.0';
import options from "options";
import { openMenu } from "../utils.js";

const Bluetooth = () => {
    const btIcon = Widget.Label({
        label: bluetooth.bind("enabled").as((v) => v ? "󰂯" : "󰂲"),
        class_name: "bar-bt_icon",
    });

    const btText = Widget.Label({
        label: Utils.merge([
            bluetooth.bind("enabled"),
            bluetooth.bind("connected_devices"),
            options.bar.bluetooth.label.bind("value")],
            (btEnabled, btDevices, showLabel) => {
                if (showLabel) {
                    return btEnabled && btDevices.length ? ` Connected (${btDevices.length})`
                        : btEnabled ? " On"
                            : " Off"
                }
                return "";

            }),
        class_name: "bar-bt_label",
    });

    return {
        component: Widget.Box({
            class_name: "volume",
            children: [btIcon, btText],
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
