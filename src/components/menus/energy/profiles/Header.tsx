import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import { renderUptime } from './helpers';
import { uptime } from 'src/services/system/uptime';

export const PowerProfileHeader = (): JSX.Element => {
    return (
        <box className="menu-label-container" halign={Gtk.Align.FILL}>
            <label className="menu-label" label="Power Profile" halign={Gtk.Align.START} hexpand />
            <label className="menu-label uptime" label={bind(uptime).as(renderUptime)} tooltipText="Uptime" />
        </box>
    );
};
