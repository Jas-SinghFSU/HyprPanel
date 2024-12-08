import { audioService } from 'src/lib/constants/services.js';
import { bind } from 'astal/binding.js';
import { isPrimaryClick } from 'src/lib/utils.js';
import { Gtk } from 'astal/gtk3';

export const InputDevices = (): JSX.Element => {
    const inputDevices = bind(audioService, 'microphones');

    return (
        <>
            {inputDevices.as((devices) => {
                if (!devices || devices.length === 0) {
                    return (
                        <button className={'menu-unfound-button input'} sensitive={false}>
                            <box>
                                <box halign={Gtk.Align.START}>
                                    <label className={'menu-button-name input'} label={'No input devices found...'} />
                                </box>
                            </box>
                        </button>
                    );
                }

                return devices.map((device) => (
                    <button
                        className={`menu-button audio input ${device.id}`}
                        onClick={(_, event) => {
                            if (isPrimaryClick(event)) {
                                device.set_is_default(true);
                            }
                        }}
                    >
                        <box>
                            <box halign={Gtk.Align.START}>
                                <label
                                    className={bind(audioService.defaultMicrophone, 'description').as((currentDesc) =>
                                        device.description === currentDesc
                                            ? 'menu-button-icon active input txt-icon'
                                            : 'menu-button-icon input txt-icon',
                                    )}
                                    label={''}
                                />
                                <label
                                    truncate
                                    wrap
                                    className={bind(audioService.defaultMicrophone, 'description').as((currentDesc) =>
                                        device.description === currentDesc
                                            ? 'menu-button-name active input'
                                            : 'menu-button-name input',
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
