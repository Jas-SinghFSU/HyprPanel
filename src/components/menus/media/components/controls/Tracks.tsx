import icons from 'src/lib/icons/icons';
import { Astal, Gtk, Widget } from 'astal/gtk3';
import { isPrimaryClick } from 'src/lib/utils';
import { bind } from 'astal';
import { activePlayer, canGoNext, canGoPrevious } from 'src/globals/media';

export const NextTrack = (): JSX.Element => {
    const className = bind(canGoNext).as((skippable) => {
        const nextStatus = skippable ? 'enabled' : 'disabled';

        return `media-indicator-control-button next ${nextStatus}`;
    });

    const onClick = (_: Widget.Button, event: Astal.ClickEvent): void => {
        if (!isPrimaryClick(event)) {
            return;
        }

        const currentPlayer = activePlayer.get();

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

export const PreviousTrack = (): JSX.Element => {
    const className = bind(canGoPrevious).as((rewindable) => {
        const prevStatus = rewindable ? 'enabled' : 'disabled';

        return `media-indicator-control-button prev ${prevStatus}`;
    });

    const onClick = (_: Widget.Button, event: Astal.ClickEvent): void => {
        if (!isPrimaryClick(event)) {
            return;
        }

        const currentPlayer = activePlayer.get();

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
