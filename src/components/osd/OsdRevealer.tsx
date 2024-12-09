import options from 'src/options';
import { OSDLabel } from './label/index';
import { OSDBar } from './bar/index';
import { OSDIcon } from './icon/index';
import { revealerSetup } from './helpers';
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal';

const { orientation } = options.theme.osd;

export const OsdRevealer = (): JSX.Element => {
    const osdOrientation = bind(orientation).as((currentOrientation) => currentOrientation === 'vertical');

    return (
        <revealer transitionType={Gtk.RevealerTransitionType.CROSSFADE} revealChild={false} setup={revealerSetup}>
            <box className={'osd-container'} vertical={osdOrientation}>
                {bind(orientation).as((currentOrientation) => {
                    if (currentOrientation === 'vertical') {
                        return (
                            <box>
                                <OSDLabel />
                                <OSDBar orientation={currentOrientation} />
                                <OSDIcon />
                            </box>
                        );
                    }

                    return (
                        <box>
                            <OSDIcon />
                            <OSDBar orientation={currentOrientation} />
                            <OSDLabel />
                        </box>
                    );
                })}
            </box>
        </revealer>
    );
};
