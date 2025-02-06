import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import Brightness from 'src/services/Brightness';

const brightnessService = Brightness.get_default();

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
