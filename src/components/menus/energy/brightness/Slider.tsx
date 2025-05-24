import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import BrightnessService from 'src/services/system/brightness';

const brightnessService = BrightnessService.getInstance();

export const BrightnessSlider = (): JSX.Element => {
    return (
        <slider
            className={'menu-active-slider menu-slider brightness'}
            value={bind(brightnessService, 'screen')}
            onDragged={({ value, dragging }) => {
                if (dragging) {
                    brightnessService.screen = value;
                }
            }}
            valign={Gtk.Align.CENTER}
            drawValue={false}
            expand
            min={0}
            max={1}
        />
    );
};
