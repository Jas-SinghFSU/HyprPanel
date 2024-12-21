import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import AstalWp from 'gi://AstalWp?version=0.1';

export const SliderPercentage = ({ type, device }: SliderPercentageProps): JSX.Element => {
    return (
        <label
            className={`menu-active-percentage ${type}`}
            valign={Gtk.Align.END}
            label={bind(device, 'volume').as((vol) => `${Math.round(vol * 100)}%`)}
        />
    );
};

interface SliderPercentageProps {
    type: 'playback' | 'input';
    device: AstalWp.Endpoint;
}
