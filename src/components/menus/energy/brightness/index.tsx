import { Gtk } from 'astal/gtk3';
import { BrightnessHeader } from './Header';
import { BrightnessIcon } from './Icon';
import { BrightnessSlider } from './Slider';
import { BrightnessPercentage } from './Percentage';

const Brightness = (): JSX.Element => {
    return (
        <box className={'menu-section-container brightness'} vertical>
            <BrightnessHeader />
            <box className={'menu-items-section'} valign={Gtk.Align.FILL} vexpand vertical>
                <box className={'brightness-container'}>
                    <BrightnessIcon />
                    <BrightnessSlider />
                    <BrightnessPercentage />
                </box>
            </box>
        </box>
    );
};

export { Brightness };
