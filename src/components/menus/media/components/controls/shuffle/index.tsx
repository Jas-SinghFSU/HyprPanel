import { mprisService } from 'src/lib/constants/services';
import { isShuffleActive } from './helpers';
import icons from 'src/lib/icons/icons';
import { Astal, Gtk, Widget } from 'astal/gtk3';
import { isPrimaryClick } from 'src/lib/utils';
import { bind } from 'astal';
import AstalMpris from 'gi://AstalMpris?version=0.1';

export const Shuffle = (): JSX.Element => {
    const className = bind(mprisService.players[0], 'shuffleStatus').as(() => {
        const currentPlayer = mprisService.players[0];

        if (currentPlayer === undefined) {
            return 'media-indicator-control-button shuffle disabled';
        }

        const baseClassName = 'media-indicator-control-button shuffle';
        const isActive = isShuffleActive(currentPlayer);
        const shuffleStatus = currentPlayer.shuffleStatus !== null ? 'enabled' : 'disabled';

        return `${baseClassName} ${isActive} ${shuffleStatus}`;
    });

    const tooltipText = bind(mprisService.players[0], 'shuffleStatus').as(() => {
        const currentPlayer = mprisService.players[0];

        const shuffleTooltipMap = {
            [AstalMpris.Shuffle.ON]: 'Shuffling',
            [AstalMpris.Shuffle.OFF]: 'Not Shuffling',
            [AstalMpris.Shuffle.UNSUPPORTED]: 'Unsupported',
        };

        if (currentPlayer === undefined || currentPlayer.shuffleStatus === null) {
            return shuffleTooltipMap[AstalMpris.Shuffle.UNSUPPORTED];
        }

        return shuffleTooltipMap[currentPlayer.shuffleStatus];
    });

    const onClick = (_: Widget.Button, self: Astal.ClickEvent): void => {
        if (!isPrimaryClick(self)) {
            return;
        }

        const currentPlayer = mprisService.players[0];

        if (currentPlayer !== undefined) {
            currentPlayer.shuffle();
        }
    };

    return (
        <box className={'media-indicator-control shuffle'}>
            <button
                className={className}
                halign={Gtk.Align.CENTER}
                hasTooltip
                tooltipText={tooltipText}
                onClick={onClick}
            >
                <icon icon={icons.mpris.shuffle.enabled} />
            </button>
        </box>
    );
};
