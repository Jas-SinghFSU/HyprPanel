import { bind } from 'astal';
import { Astal, Gtk, Widget } from 'astal/gtk3';
import { getNextPlayer, getPreviousPlayer } from './helpers';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import { isPrimaryClick } from 'src/lib/events/mouse';

const mprisService = AstalMpris.get_default();

export const PreviousPlayer = (): JSX.Element => {
    const className = bind(mprisService, 'players').as((players) => {
        const isDisabled = players.length <= 1 ? 'disabled' : 'enabled';

        return `media-indicator-control-button ${isDisabled}`;
    });

    const onClick = (_: Widget.Button, event: Astal.ClickEvent): void => {
        if (!isPrimaryClick(event)) {
            return;
        }

        const isDisabled = mprisService.get_players().length <= 1;

        if (!isDisabled) {
            getPreviousPlayer();
        }
    };

    return (
        <button
            className={className}
            halign={Gtk.Align.CENTER}
            hasTooltip
            tooltipText={'Previous Player'}
            onClick={onClick}
        >
            <label label={'󰅁'} />
        </button>
    );
};

export const NextPlayer = (): JSX.Element => {
    const className = bind(mprisService, 'players').as((players) => {
        const isDisabled = players.length <= 1 ? 'disabled' : 'enabled';
        return `media-indicator-control-button ${isDisabled}`;
    });
    const onClick = (_: Widget.Button, event: Astal.ClickEvent): void => {
        if (!isPrimaryClick(event)) {
            return;
        }

        const isDisabled = mprisService.get_players().length <= 1;

        if (!isDisabled) {
            getNextPlayer();
        }
    };
    return (
        <button
            className={className}
            halign={Gtk.Align.CENTER}
            hasTooltip
            tooltipText={'Next Player'}
            onClick={onClick}
        >
            <label label={'󰅂'} />
        </button>
    );
};
