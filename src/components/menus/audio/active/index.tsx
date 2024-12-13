import { Gtk } from 'astal/gtk3';
import { ActiveDevice } from './device/index.js';
import { audioService } from 'src/lib/constants/services.js';
import { BindableChild } from 'astal/gtk3/astalify.js';

export const SelectedDevices = (): JSX.Element => {
    const Header = (): JSX.Element => (
        <box className={'menu-label-container volume selected'} halign={Gtk.Align.FILL}>
            <label className={'menu-label audio volume'} halign={Gtk.Align.START} hexpand label={'Volume'} />
        </box>
    );

    const ActiveDeviceContainer = ({ children }: ActiveDeviceContainerProps): JSX.Element => {
        return (
            <box className={'menu-items-section selected'} vertical>
                {children}
            </box>
        );
    };

    return (
        <box className={'menu-section-container volume'} vertical>
            <Header />
            <ActiveDeviceContainer>
                <ActiveDevice type={'playback'} device={audioService.defaultSpeaker} />
                <ActiveDevice type={'input'} device={audioService.defaultMicrophone} />
            </ActiveDeviceContainer>
        </box>
    );
};

interface ActiveDeviceContainerProps {
    children?: BindableChild | BindableChild[];
}
