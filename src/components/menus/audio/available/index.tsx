import { PlaybackDevices } from './PlaybackDevices.js';
import { InputDevices } from './InputDevices.js';
import { Header } from './Header.js';

export const AvailableDevices = (): JSX.Element => {
    return (
        <box vertical className={'menu-section-container playback'}>
            <Header type={'playback'} label={'Playback Device'} />
            <PlaybackDevices />

            <Header type={'input'} label={'Input Device'} />
            <InputDevices />
        </box>
    );
};
