import { Gtk } from 'astal/gtk3';
import Separator from 'src/components/shared/Separator';
import { ToggleSwitch } from './ToggleSwitch';
import { DiscoverButton } from './DiscoverButton';

export const Controls = (): JSX.Element => {
    return (
        <box className="controls-container" valign={Gtk.Align.START}>
            <ToggleSwitch />
            <Separator className="menu-separator bluetooth" />
            <DiscoverButton />
        </box>
    );
};
