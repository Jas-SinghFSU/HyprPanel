import { Gtk } from 'astal/gtk3'
import { SystemUtilities } from 'src/core/system/SystemUtilities'
import { optionalDependencies } from 'src/services/cli/commander/commands/system/dependencies/optional'
import { BrightnessHeader } from './Header'
import { BrightnessIcon } from './Icon'
import { BrightnessPercentage } from './Percentage'
import { BrightnessSlider } from './Slider'

const brightnessDep = optionalDependencies.find((dep) => dep.package === 'brightnessctl');
const canAdjustBrightness =
    brightnessDep && brightnessDep.check.every((cmd) => SystemUtilities.checkExecutable([cmd]));

const Brightness = (): JSX.Element => {
    if (!canAdjustBrightness) {
        return (
            <box className={'menu-section-container brightness unavailable'} vertical>
                <BrightnessHeader />
                <box className={'menu-items-section'} valign={Gtk.Align.FILL} vexpand vertical>
                    <label
                        className={'menu-label unavailable'}
                        halign={Gtk.Align.CENTER}
                        label={'Brightness control is unavailable.\nPlease install brightnessctl.'}
                        hexpand
                        justify={Gtk.Justification.CENTER}
                    />
                </box>
            </box>
        );
    }

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

export { Brightness }

