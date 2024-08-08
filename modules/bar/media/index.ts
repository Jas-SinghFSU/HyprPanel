import Gdk from 'gi://Gdk?version=3.0';
const mpris = await Service.import("mpris");
import { openMenu } from "../utils.js";
import options from "options";
import { Mpris } from 'types/service/mpris.js';
import { getCurrentPlayer } from 'lib/shared/media.js';

const { show_artist, truncation, truncation_size } = options.bar.media;

const Media = () => {
    const activePlayer = Variable(mpris.players[0]);

    mpris.connect("changed", () => {
        const curPlayer = getCurrentPlayer(activePlayer.value);
        activePlayer.value = curPlayer;
    });

    const getIconForPlayer = (playerName: string): string => {
        const windowTitleMap = [
            ["Mozilla Firefox", "󰈹 "],
            ["Microsoft Edge", "󰇩 "],
            ["(.*)Discord(.*)", " "],
            ["Plex", "󰚺 "],
            ["(.*) Spotify Free", "󰓇 "],
            ["(.*)Spotify Premium", "󰓇 "],
            ["Spotify", "󰓇 "],
            ["(.*)", "󰝚 "],
        ];

        const foundMatch = windowTitleMap.find((wt) =>
            RegExp(wt[0]).test(playerName),
        );

        return foundMatch ? foundMatch[1] : "󰝚";
    };

    const songIcon = Variable("");

    const mediaLabel = Utils.watch("󰎇 Media 󰎇", [mpris, show_artist, truncation, truncation_size], () => {
        if (activePlayer.value) {
            const { track_title, identity, track_artists } = activePlayer.value;
            const trackArtist = show_artist.value
                ? ` - ${track_artists.join(', ')}`
                : ``;
            songIcon.value = getIconForPlayer(identity);
            return track_title.length === 0
                ? `No media playing...`
                : truncation.value
                    ? `${track_title + trackArtist}`.substring(0, truncation_size.value)
                    : `${track_title + trackArtist}`;
        } else {
            songIcon.value = "";
            return "󰎇 Media 󰎇";
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
                            label: songIcon.bind("value"),
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
            on_scroll_up: () => mpris.getPlayer("")?.next(),
            on_scroll_down: () => mpris.getPlayer("")?.previous(),
            on_primary_click: (clicked: any, event: Gdk.Event) => {
                openMenu(clicked, event, "mediamenu");
            },
        },
    };
};

export { Media };
