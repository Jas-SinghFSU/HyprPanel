import Gdk from 'gi://Gdk?version=3.0';
const mpris = await Service.import('mpris');
import { openMenu } from '../utils.js';
import options from 'options';
import { getCurrentPlayer } from 'lib/shared/media.js';
import { BarBoxChild } from 'lib/types/bar.js';
import Button from 'types/widgets/button.js';
import { Attribute, Child } from 'lib/types/widget.js';
import { runAsyncCommand } from 'customModules/utils.js';

const { truncation, truncation_size, show_label, show_active_only, rightClick, middleClick, format } =
    options.bar.media;

const Media = (): BarBoxChild => {
    const activePlayer = Variable(mpris.players[0]);
    const isVis = Variable(!show_active_only.value);

    show_active_only.connect('changed', () => {
        isVis.value = !show_active_only.value || mpris.players.length > 0;
    });

    mpris.connect('changed', () => {
        const curPlayer = getCurrentPlayer(activePlayer.value);
        activePlayer.value = curPlayer;
        isVis.value = !show_active_only.value || mpris.players.length > 0;
    });

    const getIconForPlayer = (playerName: string): string => {
        const windowTitleMap = [
            ['Firefox', '󰈹'],
            ['Microsoft Edge', '󰇩'],
            ['Discord', ''],
            ['Plex', '󰚺'],
            ['Spotify', '󰓇'],
            ['(.*)', '󰝚'],
        ];

        const foundMatch = windowTitleMap.find((wt) => RegExp(wt[0], 'i').test(playerName));

        return foundMatch ? foundMatch[1] : '󰝚';
    };

    const songIcon = Variable('');

    const mediaLabel = Utils.watch('Media', [mpris, truncation, truncation_size, show_label, format], () => {
        if (activePlayer.value && show_label.value) {
            const { track_title, identity, track_artists, track_album, name } = activePlayer.value;
            songIcon.value = getIconForPlayer(identity);

            const truncatedLabel = format
                .getValue()
                .replace('{title}', track_title)
                .replace('{artists}', track_artists.join(', '))
                .replace('{artist}', track_artists[0] || '')
                .replace('{album}', track_album)
                .replace('{name}', name)
                .replace('{identity}', identity);

            return truncation_size.value > 0 ? truncatedLabel.substring(0, truncation_size.value) : truncatedLabel;
        } else {
            songIcon.value = getIconForPlayer(activePlayer.value?.identity || '');
            return `Media`;
        }
    });

    return {
        component: Widget.Box({
            visible: false,
            child: Widget.Box({
                className: Utils.merge(
                    [options.theme.bar.buttons.style.bind('value'), show_label.bind('value')],
                    (style) => {
                        const styleMap = {
                            default: 'style1',
                            split: 'style2',
                            wave: 'style3',
                            wave2: 'style3',
                        };
                        return `media-container ${styleMap[style]}`;
                    },
                ),
                child: Widget.Box({
                    children: [
                        Widget.Label({
                            class_name: 'bar-button-icon media txt-icon bar',
                            label: songIcon.bind('value').as((v) => v || '󰝚'),
                        }),
                        Widget.Label({
                            class_name: 'bar-button-label media',
                            label: mediaLabel,
                        }),
                    ],
                }),
            }),
        }),
        isVis,
        boxClass: 'media',
        props: {
            on_scroll_up: () => activePlayer.value?.next(),
            on_scroll_down: () => activePlayer.value?.previous(),
            on_primary_click: (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                openMenu(clicked, event, 'mediamenu');
            },
            onSecondaryClick: (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                runAsyncCommand(rightClick.value, { clicked, event });
            },
            onMiddleClick: (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                runAsyncCommand(middleClick.value, { clicked, event });
            },
        },
    };
};

export { Media };
