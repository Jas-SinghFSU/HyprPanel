import Gdk from 'gi://Gdk?version=3.0';
const mpris = await Service.import("mpris");
import { openMenu } from "../utils.js";
import options from "options";
import { getCurrentPlayer } from 'lib/shared/media.js';

const { show_artist, truncation, truncation_size, show_label } = options.bar.media;

const Media = () => {
    const activePlayer = Variable(mpris.players[0]);

    mpris.connect("changed", () => {
        const curPlayer = getCurrentPlayer(activePlayer.value);
        activePlayer.value = curPlayer;
    });

    const getIconForPlayer = (playerName: string): string => {
        const windowTitleMap = [
            ["Firefox", "󰈹 "],
            ["Microsoft Edge", "󰇩 "],
            ["Discord", " "],
            ["Plex", "󰚺 "],
            ["Spotify", "󰓇 "],
            ["(.*)", "󰝚 "],
        ];

        const foundMatch = windowTitleMap.find((wt) =>
            RegExp(wt[0], "i").test(playerName),
        );

        return foundMatch ? foundMatch[1] : "󰝚";
    };

    const songIcon = Variable("");

    const mediaLabel = Utils.watch("Media", [mpris, show_artist, truncation, truncation_size, show_label], () => {
        if (activePlayer.value && show_label.value) {
            const { track_title, identity, track_artists } = activePlayer.value;
            songIcon.value = getIconForPlayer(identity);
            const trackArtist = show_artist.value
                ? ` - ${track_artists.join(', ')}`
                : ``;
            const truncatedLabel = truncation.value 
                ? `${track_title + trackArtist}`.substring(0, truncation_size.value)
                : `${track_title + trackArtist}`;

            return track_title.length === 0
                ? `No media playing...`
                : ((truncatedLabel.length < truncation_size.value) || !truncation.value)
                    ? `${truncatedLabel}`
                    : `${truncatedLabel.substring(0, truncatedLabel.length - 3)}...`;
        } else {
            songIcon.value = getIconForPlayer(activePlayer.value?.identity || "");
            return `Media`;
        }
    });

    return {
        component: Widget.Box({
            visible: false,
            child: Widget.Box({
                class_name: "media",
                child: Widget.Box({
                    children: [
                        Widget.Label({
                            class_name: "bar-button-icon media",
                            label: songIcon.bind("value").as(v => v || "󰝚"),
                        }),
                        Widget.Label({
                            class_name: "bar-button-label media",
                            label: mediaLabel,
                        }),
                    ],
                }),
            }),
        }),
        isVisible: false,
        boxClass: "media",
        name: "media",
        props: {
            on_scroll_up: () => activePlayer.value?.next(),
            on_scroll_down: () => activePlayer.value?.previous(),
            on_primary_click: (clicked: any, event: Gdk.Event) => {
                openMenu(clicked, event, "mediamenu");
            },
        },
    };
};

export { Media };
