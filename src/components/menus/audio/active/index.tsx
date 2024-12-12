import { SelectedInput } from './SelectedInput.js';
import { Gtk } from 'astal/gtk3';
import { SelectedPlayback } from './SelectedPlayback.js';

export const SelectedDevices = (): JSX.Element => {
    return (
        <box className={'menu-section-container volume'} vertical>
            <box className={'menu-label-container volume selected'} halign={Gtk.Align.FILL}>
                <label className={'menu-label audio volume'} halign={Gtk.Align.START} hexpand label={'Volume'} />
            </box>
            <box className={'menu-items-section selected'} vertical>
                <box className={'menu-active-container playback'} vertical>
                    <SelectedPlayback />
                </box>
                <box className={'menu-active-container input'} vertical>
                    <SelectedInput />
                </box>
            </box>
        </box>
    );
};
