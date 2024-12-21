import { audioService } from 'src/lib/constants/services.js';
import { bind } from 'astal/binding.js';
import { AudioDevice } from './Device';
import { NotFoundButton } from './NotFoundButton';

export const InputDevices = (): JSX.Element => {
    const inputDevices = bind(audioService, 'microphones');

    return (
        <box className={'menu-items-section input'} vertical>
            <box className={'menu-container input'} vertical>
                {inputDevices.as((devices) => {
                    if (!devices || devices.length === 0) {
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
