import { audioService } from 'src/lib/constants/services.js';
import { bind } from 'astal/binding.js';
import { AudioDevice } from './Device';
import { NotFoundButton } from './NotFoundButton';

export const PlaybackDevices = (): JSX.Element => {
    const playbackDevices = bind(audioService, 'speakers');

    return (
        <box className={'menu-items-section playback'} vertical>
            <box className={'menu-container playback'} vertical>
                {playbackDevices.as((devices) => {
                    if (!devices || devices.length === 0) {
                        return <NotFoundButton type={'playback'} />;
                    }

                    return devices.map((device) => {
                        return <AudioDevice device={device} type={'playback'} icon={''} />;
                    });
                })}
            </box>
        </box>
    );
};
