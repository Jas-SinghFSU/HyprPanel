import options from 'src/options';
import { bind } from 'astal';
import { mprisService } from 'src/lib/constants/services';
import { getTimeStamp } from '../timebar/helpers';

const { displayTime } = options.menus.media;

export const MediaTimeStamp = (): JSX.Element => {
    if (!displayTime.get()) {
        return <box />;
    }

    const label = bind(mprisService.players[0], 'position').as((position) => {
        if (mprisService.players[0].length > 0) {
            return getTimeStamp(position, mprisService.players[0].length);
        }
        return '00:00';
    });

    return (
        <box className={'media-indicator-current-time-label'} hexpand>
            <label className={'time-label'} label={label} hexpand />
        </box>
    );
};
