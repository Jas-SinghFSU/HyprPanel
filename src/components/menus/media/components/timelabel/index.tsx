import { bind } from 'astal';
import options from 'src/configuration';
import { timeStamp } from 'src/services/media';

const { displayTime } = options.menus.media;

export const MediaTimeStamp = (): JSX.Element => {
    if (!displayTime.get()) {
        return <box />;
    }

    return (
        <box className="media-indicator-current-time-label" hexpand>
            <label className="time-label" label={bind(timeStamp)} hexpand />
        </box>
    );
};
