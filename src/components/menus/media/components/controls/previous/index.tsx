import { mprisService } from 'src/lib/constants/services';
import icons from 'src/lib/icons/icons';
import { Astal, Gtk, Widget } from 'astal/gtk3';
import { isPrimaryClick } from 'src/lib/utils';
import { bind } from 'astal';

export const PreviousTrack = (): JSX.Element => {
    const className = bind(mprisService.players[0], 'canGoPrevious').as(() => {
        const currentPlayer = mprisService.players[0];

        if (!currentPlayer) {
            return 'media-indicator-control-button prev disabled';
        }

        const canGoPrev = currentPlayer.can_go_previous;
        const prevStatus = canGoPrev ? 'enabled' : 'disabled';

        return `media-indicator-control-button prev ${prevStatus}`;
    });

    const onClick = (_: Widget.Button, event: Astal.ClickEvent): void => {
        if (!isPrimaryClick(event)) {
            return;
        }

        const currentPlayer = mprisService.players[0];

        if (currentPlayer && currentPlayer.can_go_previous) {
            currentPlayer.previous();
        }
    };

    return (
        <button
            className={className}
            halign={Gtk.Align.CENTER}
            hasTooltip
            tooltipText={'Previous Track'}
            onClick={onClick}
        >
            <icon icon={icons.mpris.prev} />
        </button>
    );
};
