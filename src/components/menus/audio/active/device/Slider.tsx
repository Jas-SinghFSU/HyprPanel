import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import AstalWp from 'gi://AstalWp?version=0.1';
import options from 'src/options';

const { raiseMaximumVolume } = options.menus.volume;

export const Slider = ({ device, type }: SliderProps): JSX.Element => {
    return (
        <box vertical>
            <label
                className={`menu-active ${type}`}
                halign={Gtk.Align.START}
                truncate
                expand
                wrap
                label={bind(device, 'description').as((description) => description ?? `Unknown ${type} Device`)}
            />
            <slider
                value={bind(device, 'volume')}
                className={`menu-active-slider menu-slider ${type}`}
                drawValue={false}
                hexpand
                min={0}
                max={type === 'playback' ? bind(raiseMaximumVolume).as((raise) => (raise ? 1.5 : 1)) : 1}
                onDragged={({ value, dragging }) => {
                    if (dragging) {
                        device.volume = value;
                        device.mute = false;
                    }
                }}
            />
        </box>
    );
};

interface SliderProps {
    device: AstalWp.Endpoint;
    type: 'playback' | 'input';
}
