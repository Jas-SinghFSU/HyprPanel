import Gdk from 'gi://Gdk?version=3.0';
const audio = await Service.import("audio");
import { openMenu } from "../utils.js";
import options from "options";

import { globalMousePos } from "globals.js";

const Volume = () => {
    const icons = {
        101: "󰕾",
        66: "󰕾",
        34: "󰖀",
        1: "󰕿",
        0: "󰝟",
    };

    const getIcon = () => {
        const icon = Utils.merge(
            [audio.speaker.bind("is_muted"), audio.speaker.bind("volume")],
            (isMuted, vol) => {
                return isMuted
                    ? 0
                    : [101, 66, 34, 1, 0].find((threshold) => threshold <= vol * 100);
            },
        );

        return icon.as((i) => i !== undefined ? icons[i] : 101);
    };

    const volIcn = Widget.Label({
        vpack: "center",
        label: getIcon(),
        class_name: "bar-button-icon volume",
    });

    const volPct = Widget.Label({
        vpack: "center",
        label: audio.speaker.bind("volume").as((v) => `${Math.round(v * 100)}%`),
        class_name: "bar-button-label volume",
    });

    return {
        component: Widget.Box({
            vpack: "center",
            class_name: "volume",
            children: options.bar.volume.label.bind("value").as((showLabel) => {
                if (showLabel) {
                    return [volIcn, volPct];
                }
                return [volIcn];
            }),
        }),
        isVisible: true,
        boxClass: "volume",
        props: {
            on_primary_click: (clicked: any, event: Gdk.Event) => {
                openMenu(clicked, event, "audiomenu");
            },
        },
    };
};

export { Volume };
