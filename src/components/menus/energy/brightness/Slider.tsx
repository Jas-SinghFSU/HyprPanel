import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import Brightness from 'src/services/Brightness';

const brightnessService = Brightness.get_default();

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
