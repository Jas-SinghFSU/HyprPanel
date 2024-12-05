import { Gtk } from 'astal/gtk3';
import Separator from 'src/components/shared/Separator';
import { MenuLabel } from './MenuLabel';
import { DndSwitch } from './DndSwitch';
import { ClearNotificationsButton } from './ClearNotificationsButton';

const Controls = (): JSX.Element => {
    return (
        <box className={'notification-menu-controls'} expand={false} vertical={false}>
            <MenuLabel />
            <box halign={Gtk.Align.END} valign={Gtk.Align.CENTER} expand={false}>
                <DndSwitch />
                <Separator
                    halign={Gtk.Align.CENTER}
                    vexpand={true}
                    className={'menu-separator notification-controls'}
                />
                <ClearNotificationsButton />
            </box>
        </box>
    );
};

export { Controls };
