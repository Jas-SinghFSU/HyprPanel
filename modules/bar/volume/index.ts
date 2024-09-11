import Gdk from 'gi://Gdk?version=3.0';
const audio = await Service.import("audio");
import { openMenu } from "../utils.js";
import options from "options";
import { VolumeIcons } from 'lib/types/volume.js';
import { Stream } from 'types/service/audio';
import Separator from "types/widgets/separator";
import Label from "types/widgets/label";

const Volume = () => {
    const { label, input, output, hide_muted_label } = options.bar.volume;

    const outputIcons: VolumeIcons = {
        101: "󱄠",
        66: "󰕾",
        34: "󰖀",
        1: "󰕿",
        0: "󰝟",
    };

    const inputIcons: VolumeIcons = {
        51: "󰍬",
        1: "󰍮",
        0: "󰍭",
    };

    const getIcon = (icons: VolumeIcons, volume: number, isMuted: (boolean | null)): string => {
        const keys = Object.keys(icons).map(Number).reverse();
        let icon: number;
        if (isMuted !== false || Math.round(volume * 100) === 0) {
            icon = 0;
        } else {
            icon = keys.find((threshold) => threshold <= Math.round(volume * 100)) ?? keys[0];
        }
        return icons[icon];
    };

    const volIcn = (audio_type: Stream, icons: VolumeIcons, extra_class_name: string, showLabel: boolean, hideMutedLabel: boolean): Label<any> => {
        const class_name = `bar-button-icon volume txt-icon bar ${extra_class_name}`;
        return Widget.Label({
            hexpand: true,
            class_name
        }).hook(audio_type, (self) => {
            if (!self.is_destroyed) {
                self.set_text(getIcon(icons, audio_type.volume, audio_type.is_muted));
                self.class_name = `${class_name} ${!showLabel || (hideMutedLabel && (audio_type.is_muted !== false || Math.round(audio_type.volume * 100) === 0)) ? "no-label" : ""}`;
            }
        });
    };

    const volPctUpdate = (label: Label<any>, audio_type: Stream, hideMutedLabel: boolean): void => {
        if (!label.is_destroyed) {
            label.set_text(audio_type.is_muted !== false ? "0%" : `${Math.round(audio_type.volume * 100)}%`);
            label.set_visible(!(hideMutedLabel && (audio_type.is_muted !== false || Math.round(audio_type.volume * 100) === 0)));
        }
    };

    const volPct = (audio_type: Stream, class_name: string, hideMutedLabel: boolean): Label<any> => {
        const label: Label<any> = Widget.Label({
            hexpand: true,
            class_name: `bar-button-label volume ${class_name}`,
        }).hook(audio_type, (self) => volPctUpdate(self, audio_type, hideMutedLabel));

        // Workaround for ags setting the label visible on creation
        if (hideMutedLabel) {
            Utils.timeout(500, () => volPctUpdate(label, audio_type, hideMutedLabel));
        }
        return label;
    };

    return {
        component: Widget.Box({
            hexpand: true,
            vexpand: true,
            className: Utils.merge([options.theme.bar.buttons.style.bind("value"), label.bind("value")], (style, showLabel) => {
                const styleMap = {
                    default: "style1",
                    split: "style2",
                    wave: "style3",
                    wave2: "style3",
                };

                return `volume ${styleMap[style]} ${!showLabel ? "no-label" : ""}`;
            }),
            children: Utils.merge(
                [label.bind("value"), output.bind("value"), input.bind("value"), hide_muted_label.bind("value")],
                (showLabel, showOutput, showInput, hideMutedLabel) => {
                    let children: (Label<any> | Separator<any>)[] = [];
                    if (showOutput) {
                        children.push(volIcn(audio.speaker, outputIcons, "output", showLabel, hideMutedLabel));
                        if (showLabel) {
                            children.push(volPct(audio.speaker, `output ${!showInput ? "no-separator" : ""}`, hideMutedLabel));
                        }
                    }
                    if (showInput) {
                        if (showOutput) {
                            children.push(Widget.Separator({ vertical: true, class_name: "bar-separator volume" }));
                        }
                        children.push(volIcn(audio.microphone, inputIcons, "input", showLabel, hideMutedLabel));
                        if (showLabel) {
                            children.push(volPct(audio.microphone, "input no-separator", hideMutedLabel));
                        }
                    }
                    return children;
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
