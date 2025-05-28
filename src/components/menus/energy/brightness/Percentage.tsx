import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import BrightnessService from 'src/services/system/brightness';

const brightnessService = BrightnessService.getInstance();

export const BrightnessPercentage = (): JSX.Element => {
    return (
        <label
            className={'brightness-slider-label'}
            label={bind(brightnessService, 'screen').as((screenBrightness) => {
                return `${Math.round(screenBrightness * 100)}%`;
            })}
            valign={Gtk.Align.CENTER}
            vexpand
        />
    );
};
