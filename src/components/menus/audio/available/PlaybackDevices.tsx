import { audioService } from 'src/lib/constants/services.js';
import { bind } from 'astal/binding.js';
import { isPrimaryClick } from 'src/lib/utils.js';
import { Gtk } from 'astal/gtk3';

export const PlaybackDevices = (): JSX.Element => {
    const playbackDevices = bind(audioService, 'speakers');

    return (
        <>
            {playbackDevices.as((devices) => {
                if (!devices || devices.length === 0) {
                    return (
                        <button className={'menu-unfound-button playback'} sensitive={false}>
                            <box>
                                <label className={'menu-button-name playback'} label={'No playback devices found...'} />
                            </box>
                        </button>
                    );
                }

                return devices.map((device) => (
                    <button
                        className={`menu-button audio playback ${device.id}`}
                        onClick={(_, event) => {
                            if (isPrimaryClick(event)) {
                                device.set_is_default(true);
                            }
                        }}
                    >
                        <box>
                            <box halign={Gtk.Align.START}>
                                <label
                                    className={bind(audioService.defaultSpeaker, 'description').as((currentDesc) =>
                                        device.description === currentDesc
                                            ? 'menu-button-icon active playback txt-icon'
                                            : 'menu-button-icon playback txt-icon',
                                    )}
                                    label={''}
                                />
                                <label
                                    truncate
                                    wrap
                                    className={bind(audioService.defaultSpeaker, 'description').as((currentDesc) =>
                                        device.description === currentDesc
                                            ? 'menu-button-name active playback'
                                            : 'menu-button-name playback',
                                    )}
                                    label={device.description}
                                />
                            </box>
                        </box>
                    </button>
                ));
            })}
        </>
    );
};
