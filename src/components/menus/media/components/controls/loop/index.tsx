import { mprisService } from 'src/lib/constants/services';
import icons from 'src/lib/icons/icons';
import { Astal, Gtk, Widget } from 'astal/gtk3';
import { isPrimaryClick } from 'src/lib/utils';
import { bind } from 'astal';
import { isLoopActive, loopIconMap, loopTooltipMap } from './helpers';

export type LoopStatus = 'none' | 'track' | 'playlist';

export const Loop = (): JSX.Element => {
    const className = bind(mprisService.players[0], 'loopStatus').as(() => {
        const currentPlayer = mprisService.players[0];

        if (!currentPlayer) {
            return 'media-indicator-control-button loop disabled';
        }

        const isActive = isLoopActive(currentPlayer);
        const loopStatus = currentPlayer.loop_status !== null ? 'enabled' : 'disabled';

        return `media-indicator-control-button loop ${isActive} ${loopStatus}`;
    });

    const tooltipText = bind(mprisService.players[0], 'loopStatus').as(() => {
        const currentPlayer = mprisService.players[0];

        if (!currentPlayer || currentPlayer.loop_status === null) {
            return 'Unavailable';
        }

        return loopTooltipMap[currentPlayer.loop_status];
    });

    const iconBinding = bind(mprisService.players[0], 'loopStatus').as(() => {
        const currentPlayer = mprisService.players[0];

        if (!currentPlayer) {
            return icons.mpris.loop.none;
        }

        const loopStatus = currentPlayer.loop_status;

        if (loopStatus !== null) {
            return icons.mpris.loop[loopIconMap[loopStatus]];
        } else {
            return icons.mpris.loop.none;
        }
    });

    const onClick = (_: Widget.Button, event: Astal.ClickEvent): void => {
        if (!isPrimaryClick(event)) {
            return;
        }

        const currentPlayer = mprisService.players[0];

        if (currentPlayer) {
            currentPlayer.loop();
        }
    };

    return (
        <box className="media-indicator-control loop">
            <button
                className={className}
                halign={Gtk.Align.CENTER}
                hasTooltip
                tooltipText={tooltipText}
                onClick={onClick}
            >
                <icon icon={iconBinding} />
            </button>
        </box>
    );
};
