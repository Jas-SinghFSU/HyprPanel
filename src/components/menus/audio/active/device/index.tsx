import AstalWp from 'gi://AstalWp?version=0.1';
import { SliderIcon } from './SliderIcon';
import { Slider } from './Slider';
import { SliderPercentage } from './SliderPercentage';

export const ActiveDevice = ({ type, device }: ActiveDeviceProps): JSX.Element => {
    return (
        <box className={`menu-active-container ${type}`} vertical>
            <box className={`menu-slider-container ${type}`}>
                <SliderIcon type={type} device={device} />
                <Slider type={type} device={device} />
                <SliderPercentage type={type} device={device} />
            </box>
        </box>
    );
};

interface ActiveDeviceProps {
    type: 'playback' | 'input';
    device: AstalWp.Endpoint;
}
