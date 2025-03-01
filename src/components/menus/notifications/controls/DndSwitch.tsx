import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';

const notifdService = AstalNotifd.get_default();

export const DndSwitch = (): JSX.Element => {
    return (
        <switch
            className={'menu-switch notifications'}
            valign={Gtk.Align.CENTER}
            active={bind(notifdService, 'dontDisturb').as((dontDisturb) => !dontDisturb)}
            setup={(self) => {
                self.connect('notify::active', () => {
                    notifdService.set_dont_disturb(!self.active);
                });
            }}
        />
    );
};
