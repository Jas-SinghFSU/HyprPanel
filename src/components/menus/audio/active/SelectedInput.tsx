import { audioService } from 'src/lib/constants/services.js';
import { getIcon } from '../utils.js';
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding.js';
import { isPrimaryClick } from 'src/lib/utils.js';
import Variable from 'astal/variable.js';

export const SelectedInput = (): JSX.Element => {
    return (
        <box className={'menu-slider-container input'}>
            <button
                className={bind(audioService.defaultMicrophone, 'mute').as(
                    (isMuted) => `menu-active-button input ${isMuted ? 'muted' : ''}`,
                )}
                vexpand={false}
                valign={Gtk.Align.END}
                onClick={(_, event) => {
                    if (isPrimaryClick(event)) {
                        audioService.defaultMicrophone.mute = !audioService.defaultMicrophone.mute;
                    }
                }}
            >
                <icon
                    className={'menu-active-icon input'}
                    icon={Variable.derive(
                        [bind(audioService.defaultMicrophone, 'volume'), bind(audioService.defaultMicrophone, 'mute')],
                        (volume, isMuted) => {
                            const effectiveVolume = volume > 0 ? volume : 100;
                            const mutedState = volume > 0 ? isMuted : true;
                            return getIcon(effectiveVolume, mutedState)['mic'];
                        },
                    )()}
                />
            </button>
            <box vertical>
                <label
                    className={'menu-active input'}
                    halign={Gtk.Align.START}
                    truncate
                    expand
                    wrap
                    label={bind(audioService.defaultMicrophone, 'description').as(
                        (description) => description ?? 'Unknown Input Device',
                    )}
                />
                <slider
                    value={bind(audioService.defaultMicrophone, 'volume')}
                    className={'menu-active-slider menu-slider inputs'}
                    drawValue={false}
                    hexpand
                    min={0}
                    max={1}
                />
            </box>
            <label
                className={'menu-active-percentage input'}
                valign={Gtk.Align.END}
                label={bind(audioService.defaultMicrophone, 'volume').as((vol) => `${Math.round(vol * 100)}%`)}
            />
        </box>
    );
};
