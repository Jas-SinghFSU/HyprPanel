import { openMenu } from '../../utils/menu.js';
import options from 'src/options.js';
import { getCurrentPlayer } from 'src/lib/shared/media.js';
import { runAsyncCommand } from 'src/components/bar/utils/helpers.js';
import { generateMediaLabel } from './helpers.js';
import { useHook } from 'src/lib/shared/hookHandler.js';
import { mpris } from 'src/lib/constants/services.js';
import Variable from 'astal/variable.js';
import { GtkWidget } from 'src/lib/types/widget.js';
import { onMiddleClick, onPrimaryClick, onSecondaryClick } from 'src/lib/shared/eventHandlers.js';
import { bind } from 'astal/binding.js';
import AstalMpris from 'gi://AstalMpris?version=0.1';

const { truncation, truncation_size, show_label, show_active_only, rightClick, middleClick, format } =
    options.bar.media;

const Media = (): GtkWidget => {
    const activePlayer = Variable(mpris.get_players()[0]);
    const isVis = Variable(!show_active_only.value);

    show_active_only.subscribe(() => {
        isVis.set(!show_active_only.value || mpris.get_players().length > 0);
    });

    Variable.derive([bind(activePlayer.get(), 'playbackStatus')], (status: AstalMpris.PlaybackStatus) => {
        console.log('in');

        const curPlayer = getCurrentPlayer(activePlayer.get());
        activePlayer.set(curPlayer);
        isVis.set(!show_active_only.value || mpris.get_players().length > 0);
    });

    mpris.connect('player-added', () => {
        console.log('test');

        const curPlayer = getCurrentPlayer(activePlayer.get());
        activePlayer.set(curPlayer);
        isVis.set(!show_active_only.value || mpris.get_players().length > 0);
    });

    mpris.connect('player-closed', () => {
        console.log('closed');

        const curPlayer = getCurrentPlayer(activePlayer.get());
        activePlayer.set(curPlayer);
        isVis.set(!show_active_only.value || mpris.get_players().length > 0);
    });

    const songIcon = Variable('');

    activePlayer.subscribe((player: AstalMpris.Player) => {
        console.log(player);
    });

    const mediaLabel = Variable.derive(
        [bind(mpris, 'players'), truncation, truncation_size, show_label, format],
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
        <box className={componentClassName()}>
            <label className={'bar-button-icon media txt-icon bar'} label={bind(songIcon).as((icn) => icn || '󰝚')} />
            <label className={'bar-button-label media'} label={mediaLabel()} />
        </box>
    );

    return {
        component,
        isVis,
        boxClass: 'media',
        props: {
            setup: (self: GtkWidget): void => {
                useHook(self, options.bar.scrollSpeed, () => {
                    const disconnectPrimary = onPrimaryClick(self, (clicked, event) => {
                        openMenu(clicked, event, 'dashboardmenu');
                    });

                    const disconnectSecondary = onSecondaryClick(self, (clicked, event) => {
                        runAsyncCommand(rightClick.value, { clicked, event });
                    });

                    const disconnectMiddle = onMiddleClick(self, (clicked, event) => {
                        runAsyncCommand(middleClick.value, { clicked, event });
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
