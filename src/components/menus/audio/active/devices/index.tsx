import { BindableChild } from 'astal/gtk3/astalify';
import { audioService } from 'src/lib/constants/services';
import { SliderItem } from '../sliderItem/SliderItem';
import { ActiveDeviceMenu } from '..';

const ActiveDeviceContainer = ({ children }: ActiveDeviceContainerProps): JSX.Element => {
    return (
        <box className={'menu-items-section selected'} name={ActiveDeviceMenu.Devices} vertical>
            {children}
        </box>
    );
};

export const ActiveDevices = (): JSX.Element => {
    return (
        <ActiveDeviceContainer>
            <SliderItem type={'playback'} device={audioService.defaultSpeaker} />
            <SliderItem type={'input'} device={audioService.defaultMicrophone} />
        </ActiveDeviceContainer>
    );
};

interface ActiveDeviceContainerProps {
    children?: BindableChild | BindableChild[];
}
