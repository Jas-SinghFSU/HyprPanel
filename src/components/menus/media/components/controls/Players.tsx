import { bind } from 'astal';
import { Astal, Gtk, Widget } from 'astal/gtk3';
import { mprisService } from 'src/lib/constants/services';
import { isPrimaryClick } from 'src/lib/utils';
import { getNextPlayer, getPreviousPlayer } from './helpers';

export const PreviousPlayer = (): JSX.Element => {
    const className = bind(mprisService, 'players').as(() => {
        const isDisabled = mprisService.players.length <= 1 ? 'disabled' : 'enabled';

        return `media-indicator-control-button ${isDisabled}`;
    });

    const onClick = (_: Widget.Button, event: Astal.ClickEvent): void => {
        if (!isPrimaryClick(event)) {
            return;
        }
        const isDisabled = mprisService.players.length <= 1;
        console.log(isDisabled);

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
    const className = bind(mprisService, 'players').as(() => {
        const isDisabled = mprisService.players.length <= 1 ? 'disabled' : 'enabled';
        return `media-indicator-control-button ${isDisabled}`;
    });
    const onClick = (_: Widget.Button, event: Astal.ClickEvent): void => {
        if (!isPrimaryClick(event)) {
            return;
        }

        const isDisabled = mprisService.players.length <= 1;

        console.log(isDisabled);

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
