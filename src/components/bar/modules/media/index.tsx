import { openMenu } from '../../utils/menu.js';
import options from 'src/options.js';
import { runAsyncCommand } from 'src/components/bar/utils/helpers.js';
import { generateMediaLabel } from './helpers/index.js';
import { useHook } from 'src/lib/shared/hookHandler.js';
import { mprisService } from 'src/lib/constants/services.js';
import Variable from 'astal/variable.js';
import { onMiddleClick, onPrimaryClick, onSecondaryClick } from 'src/lib/shared/eventHandlers.js';
import { bind } from 'astal/binding.js';
import { BarBoxChild } from 'src/lib/types/bar.js';
import { Astal } from 'astal/gtk3';
import { activePlayer, mediaAlbum, mediaArtist, mediaTitle } from 'src/globals/media.js';

const { truncation, truncation_size, show_label, show_active_only, rightClick, middleClick, format } =
    options.bar.media;

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

    const componentClassName = Variable.derive([options.theme.bar.buttons.style, show_label], (style: string) => {
        const styleMap: Record<string, string> = {
            default: 'style1',
            split: 'style2',
            wave: 'style3',
            wave2: 'style3',
        };
        return `media-container ${styleMap[style]}`;
    });

    const component = (
        <box
            className={componentClassName()}
            onDestroy={() => {
                songIcon.drop();
                mediaLabel.drop();
                componentClassName.drop();
            }}
        >
            <label className={'bar-button-icon media txt-icon bar'} label={bind(songIcon).as((icn) => icn || '󰝚')} />
            <label className={'bar-button-label media'} label={mediaLabel()} />
        </box>
    );

    return {
        component,
        isVis,
        boxClass: 'media',
        props: {
            setup: (self: Astal.Button): void => {
                useHook(self, options.bar.scrollSpeed, () => {
                    const disconnectPrimary = onPrimaryClick(self, (clicked, event) => {
                        openMenu(clicked, event, 'mediamenu');
                    });

                    const disconnectSecondary = onSecondaryClick(self, (clicked, event) => {
                        runAsyncCommand(rightClick.get(), { clicked, event });
                    });

                    const disconnectMiddle = onMiddleClick(self, (clicked, event) => {
                        runAsyncCommand(middleClick.get(), { clicked, event });
                    });

                    return (): void => {
                        disconnectPrimary();
                        disconnectSecondary();
                        disconnectMiddle();
                    };
                });
            },
        },
    };
};

export { Media };
