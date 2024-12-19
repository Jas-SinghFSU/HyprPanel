import { Gtk } from 'astal/gtk3';
import LevelBar from 'src/components/shared/LevelBar';
import { OSDOrientation } from 'src/lib/types/options';
import { setupOsdBar } from './helpers';

export const OSDBar = ({ orientation }: OSDBarProps): JSX.Element => {
    const barOrientation = orientation === 'vertical' ? Gtk.Orientation.VERTICAL : Gtk.Orientation.HORIZONTAL;

    return (
        <box className={'osd-bar-container'}>
            <LevelBar
                className={'osd-bar'}
                orientation={barOrientation}
                inverted={orientation === 'vertical'}
                mode={Gtk.LevelBarMode.CONTINUOUS}
                setup={setupOsdBar}
            />
        </box>
    );
};

interface OSDBarProps {
    orientation: OSDOrientation;
}
