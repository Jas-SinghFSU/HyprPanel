import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import { isPrimaryClick } from 'src/lib/utils';
import { getIcon } from '../../utils';
import AstalWp from 'gi://AstalWp?version=0.1';

export const SliderIcon = ({ type, device }: SliderIconProps): JSX.Element => {
    const iconBinding = Variable.derive([bind(device, 'volume'), bind(device, 'mute')], (volume, isMuted) => {
        const iconType = type === 'playback' ? 'spkr' : 'mic';

        const effectiveVolume = volume > 0 ? volume : 100;
        const mutedState = volume > 0 ? isMuted : true;

        return getIcon(effectiveVolume, mutedState)[iconType];
    });

    return (
        <button
            className={bind(device, 'mute').as((isMuted) => `menu-active-button ${type} ${isMuted ? 'muted' : ''}`)}
            vexpand={false}
            valign={Gtk.Align.END}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    device.mute = !device.mute;
                }
            }}
            onDestroy={() => {
                iconBinding.drop();
            }}
        >
            <icon className={`menu-active-icon ${type}`} icon={iconBinding()} />
        </button>
    );
};

interface SliderIconProps {
    type: 'playback' | 'input';
    device: AstalWp.Endpoint;
}
