import { mprisService } from 'src/lib/constants/services';
import icons from 'src/lib/icons/icons';
import { Astal, Gtk, Widget } from 'astal/gtk3';
import { isPrimaryClick } from 'src/lib/utils';
import { bind } from 'astal';

export const NextTrack = (): JSX.Element => {
    const className = bind(mprisService.players[0], 'canGoNext').as(() => {
        const currentPlayer = mprisService.players[0];

        if (!currentPlayer) {
            return 'media-indicator-control-button next disabled';
        }

        const canGoNext = currentPlayer.can_go_next;
        const nextStatus = canGoNext ? 'enabled' : 'disabled';

        return `media-indicator-control-button next ${nextStatus}`;
    });

    const onClick = (_: Widget.Button, event: Astal.ClickEvent): void => {
        if (!isPrimaryClick(event)) {
            return;
        }

        const currentPlayer = mprisService.players[0];

        if (currentPlayer && currentPlayer.can_go_next) {
            currentPlayer.next();
        }
    };

    return (
        <box className={'media-indicator-control next'}>
            <button
                className={className}
                halign={Gtk.Align.CENTER}
                hasTooltip
                tooltipText={'Next Track'}
                onClick={onClick}
            >
                <icon icon={icons.mpris.next} />
            </button>
        </box>
    );
};
