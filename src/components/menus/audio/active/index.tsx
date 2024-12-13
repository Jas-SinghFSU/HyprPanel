import { Gtk } from 'astal/gtk3';
import { ActiveDevice } from './device/index.js';
import { audioService } from 'src/lib/constants/services.js';

export const SelectedDevices = (): JSX.Element => {
    return (
        <box className={'menu-section-container volume'} vertical>
            <box className={'menu-label-container volume selected'} halign={Gtk.Align.FILL}>
                <label className={'menu-label audio volume'} halign={Gtk.Align.START} hexpand label={'Volume'} />
            </box>
            <box className={'menu-items-section selected'} vertical>
                <box className={'menu-active-container playback'} vertical>
                    <ActiveDevice type={'playback'} device={audioService.defaultSpeaker} />
                </box>

                <box className={'menu-active-container input'} vertical>
                    <ActiveDevice type={'input'} device={audioService.defaultMicrophone} />
                </box>
            </box>
        </box>
    );
};
