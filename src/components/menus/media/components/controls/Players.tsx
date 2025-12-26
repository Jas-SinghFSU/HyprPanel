import { bind, Variable } from 'astal';
import { Astal, Gtk, Widget } from 'astal/gtk3';
import { getNextPlayer, getPreviousPlayer } from './helpers';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import { isPrimaryClick } from 'src/lib/events/mouse';
import options from 'src/configuration';
import { filterPlayers } from 'src/lib/shared/media';

const mprisService = AstalMpris.get_default();

export const PreviousPlayer = (): JSX.Element => {
    const { ignore } = options.menus.media;

    const className = Variable.derive(
        [bind(mprisService, 'players'), bind(ignore)],
        (players: AstalMpris.Player[], ignoredApps: string[]) => {
            const filteredPlayers = filterPlayers(players, ignoredApps);
            const isDisabled = filteredPlayers.length <= 1 ? 'disabled' : 'enabled';

            return `media-indicator-control-button ${isDisabled}`;
        },
    );

    const onClick = (_: Widget.Button, event: Astal.ClickEvent): void => {
        if (!isPrimaryClick(event)) {
            return;
        }

        const allPlayers = mprisService.get_players();
        const filteredPlayers = filterPlayers(allPlayers, ignore.get());
        const isDisabled = filteredPlayers.length <= 1;

        if (!isDisabled) {
            getPreviousPlayer();
        }
    };

    return (
        <button
            className={className()}
            halign={Gtk.Align.CENTER}
            hasTooltip
            tooltipText={'Previous Player'}
            onClick={onClick}
            onDestroy={() => {
                className.drop();
            }}
        >
            <label label={'󰅁'} />
        </button>
    );
};

export const NextPlayer = (): JSX.Element => {
    const { ignore } = options.menus.media;

    const className = Variable.derive(
        [bind(mprisService, 'players'), bind(ignore)],
        (players: AstalMpris.Player[], ignoredApps: string[]) => {
            const filteredPlayers = filterPlayers(players, ignoredApps);
            const isDisabled = filteredPlayers.length <= 1 ? 'disabled' : 'enabled';
            return `media-indicator-control-button ${isDisabled}`;
        },
    );
    const onClick = (_: Widget.Button, event: Astal.ClickEvent): void => {
        if (!isPrimaryClick(event)) {
            return;
        }

        const allPlayers = mprisService.get_players();
        const filteredPlayers = filterPlayers(allPlayers, ignore.get());
        const isDisabled = filteredPlayers.length <= 1;

        if (!isDisabled) {
            getNextPlayer();
        }
    };
    return (
        <button
            className={className()}
            halign={Gtk.Align.CENTER}
            hasTooltip
            tooltipText={'Next Player'}
            onClick={onClick}
            onDestroy={() => {
                className.drop();
            }}
        >
            <label label={'󰅂'} />
        </button>
    );
};
