import { Gtk } from 'astal/gtk3';
import { PlaybackDevices } from './PlaybackDevices.js';
import { InputDevices } from './InputDevices.js';

export const AvailableDevices = (): JSX.Element => {
    return (
        <box vertical className={'menu-section-container playback'}>
            {/* Playback Devices Section */}
            <box className={'menu-label-container playback'} halign={Gtk.Align.FILL}>
                <label
                    className={'menu-label audio playback'}
                    halign={Gtk.Align.START}
                    hexpand
                    label={'Playback Devices'}
                />
            </box>
            <box className={'menu-items-section playback'} vertical>
                <box className={'menu-container playback'} vertical>
                    <PlaybackDevices />
                </box>
            </box>

            {/* Input Devices Section */}
            <box className={'menu-label-container input'} halign={Gtk.Align.FILL}>
                <label className={'menu-label audio input'} halign={Gtk.Align.START} hexpand label={'Input Devices'} />
            </box>
            <box className={'menu-items-section input'} vertical>
                <box className={'menu-container input'} vertical>
                    <InputDevices />
                </box>
            </box>
        </box>
    );
};
