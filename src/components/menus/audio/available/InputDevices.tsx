import { bind } from 'astal';
import { AudioDevice } from './Device';
import { NotFoundButton } from './NotFoundButton';
import AstalWp from 'gi://AstalWp?version=0.1';

const wireplumber = AstalWp.get_default() as AstalWp.Wp;
const audioService = wireplumber.audio;

export const InputDevices = (): JSX.Element => {
    const inputDevices = bind(audioService, 'microphones');

    return (
        <box className={'menu-items-section input'} vertical>
            <box className={'menu-container input'} vertical>
                {inputDevices.as((devices) => {
                    if (devices === null || devices.length === 0) {
                        return <NotFoundButton type={'input'} />;
                    }

                    return devices.map((device) => {
                        return <AudioDevice device={device} type={'input'} icon={''} />;
                    });
                })}
            </box>
        </box>
    );
};
