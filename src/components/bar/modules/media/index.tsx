import { generateMediaLabel } from './helpers/index.js';
import { onPrimaryClick, onSecondaryClick, onMiddleClick, onScroll } from 'src/lib/shared/eventHandlers';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import { BarBoxChild } from 'src/components/bar/types.js';
import { activePlayer, mediaTitle, mediaAlbum, mediaArtist } from 'src/services/media';
import options from 'src/configuration';
import { runAsyncCommand } from '../../utils/input/commandExecutor';
import { throttledScrollHandler } from '../../utils/input/throttle';
import { openDropdownMenu } from '../../utils/menu';

const mprisService = AstalMpris.get_default();
const {
    truncation,
    truncation_size,
    show_label,
    show_active_only,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
    format,
} = options.bar.media;

const isVis = Variable(!show_active_only.get());

Variable.derive([bind(show_active_only), bind(mprisService, 'players')], (showActive, players) => {
    isVis.set(!showActive || players?.length > 0);
});

const Media = (): BarBoxChild => {
    activePlayer.set(mprisService.get_players()[0]);

    const songIcon = Variable('');

    const mediaLabel = Variable.derive(
        [
            bind(activePlayer),
            bind(truncation),
            bind(truncation_size),
            bind(show_label),
            bind(format),
            bind(mediaTitle),
            bind(mediaAlbum),
            bind(mediaArtist),
        ],
        () => {
            return generateMediaLabel(truncation_size, show_label, format, songIcon, activePlayer);
        },
    );

    const componentClassName = Variable.derive(
        [options.theme.bar.buttons.style, show_label],
        (style: string) => {
            const styleMap: Record<string, string> = {
                default: 'style1',
                split: 'style2',
                wave: 'style3',
                wave2: 'style3',
            };
            return `media-container ${styleMap[style]}`;
        },
    );

    const component = (
        <box
            className={componentClassName()}
            onDestroy={() => {
                songIcon.drop();
                mediaLabel.drop();
                componentClassName.drop();
            }}
        >
            <label
                className={'bar-button-icon media txt-icon bar'}
                label={bind(songIcon).as((icn) => icn || '󰝚')}
            />
            <label className={'bar-button-label media'} label={mediaLabel()} />
        </box>
    );

    return {
        component,
        isVis: bind(isVis),
        boxClass: 'media',
        props: {
            setup: (self: Astal.Button): void => {
                let disconnectFunctions: (() => void)[] = [];

                Variable.derive(
                    [
                        bind(rightClick),
                        bind(middleClick),
                        bind(scrollUp),
                        bind(scrollDown),
                        bind(options.bar.scrollSpeed),
                    ],
                    () => {
                        disconnectFunctions.forEach((disconnect) => disconnect());
                        disconnectFunctions = [];

                        const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.get());

                        disconnectFunctions.push(
                            onPrimaryClick(self, (clicked, event) => {
                                openDropdownMenu(clicked, event, 'mediamenu');
                            }),
                        );

                        disconnectFunctions.push(
                            onSecondaryClick(self, (clicked, event) => {
                                runAsyncCommand(rightClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(
                            onMiddleClick(self, (clicked, event) => {
                                runAsyncCommand(middleClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(
                            onScroll(self, throttledHandler, scrollUp.get(), scrollDown.get()),
                        );
                    },
                );
            },
        },
    };
};

export { Media };
