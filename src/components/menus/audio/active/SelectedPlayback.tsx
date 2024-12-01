import { audioService } from 'src/lib/constants/services.js';
import { getIcon } from '../utils.js';
import options from 'src/options.js';
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding.js';
import { isPrimaryClick } from 'src/lib/utils.js';
import Variable from 'astal/variable.js';

const { raiseMaximumVolume } = options.menus.volume;

export const SelectedPlayback = (): JSX.Element => {
    return (
        <box className={'menu-slider-container playback'}>
            <button
                className={bind(audioService.defaultSpeaker, 'mute').as(
                    (mute) => `menu-active-button playback ${mute ? 'muted' : ''}`,
                )}
                vexpand={false}
                valign={Gtk.Align.CENTER}
                onClick={(_, event) => {
                    if (isPrimaryClick(event)) {
                        audioService.defaultSpeaker.mute = !audioService.defaultSpeaker.mute;
                    }
                }}
            >
                <icon
                    className={'menu-active-icon playback'}
                    icon={Variable.derive(
                        [bind(audioService.defaultSpeaker, 'volume'), bind(audioService.defaultSpeaker, 'mute')],
                        (vol, isMuted) => {
                            return getIcon(vol, isMuted)['spkr'];
                        },
                    )()}
                />
            </button>
            <box vertical>
                <label
                    className={'menu-active playback'}
                    halign={Gtk.Align.START}
                    truncate
                    expand
                    wrap
                    label={bind(audioService.defaultSpeaker, 'description').as(
                        (description) => description ?? 'Unknown Playback Device',
                    )}
                />
                <slider
                    value={bind(audioService.defaultSpeaker, 'volume')}
                    className={'menu-active-slider menu-slider playback'}
                    drawValue={false}
                    hexpand
                    min={0}
                    max={bind(raiseMaximumVolume).as((raise) => (raise ? 1.5 : 1))}
                    onDragged={({ value, dragging }) => {
                        if (dragging) {
                            audioService.defaultSpeaker.volume = value;
                            audioService.defaultSpeaker.mute = false;
                        }
                    }}
                />
            </box>
            <label
                valign={Gtk.Align.END}
                className={'menu-active-percentage playback'}
                label={bind(audioService.defaultSpeaker, 'volume').as((vol) => `${Math.round(vol * 100)}%`)}
            />
        </box>
    );
};
