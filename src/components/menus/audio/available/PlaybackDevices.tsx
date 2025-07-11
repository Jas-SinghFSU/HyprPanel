import { bind } from 'astal';
import { AudioDevice } from './Device';
import { NotFoundButton } from './NotFoundButton';
import AstalWp from 'gi://AstalWp?version=0.1';

const wireplumber = AstalWp.get_default() as AstalWp.Wp;
const audioService = wireplumber.audio;

export const PlaybackDevices = (): JSX.Element => {
    const playbackDevices = bind(audioService, 'speakers');

    return (
        <box className={'menu-items-section playback'} vertical>
            <box className={'menu-container playback'} vertical>
                {playbackDevices.as((devices) => {
                    if (devices === null || devices.length === 0) {
                        return <NotFoundButton type={'playback'} />;
                    }

                    return devices
                        .slice()
                        .sort((a, b) => a.description.localeCompare(b.description))
                        .map((device) => {
                            return <AudioDevice device={device} type={'playback'} icon={''} />;
                        });
                })}
            </box>
        </box>
    );
};
