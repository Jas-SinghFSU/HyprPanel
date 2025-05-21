import { GLib } from 'astal';

export const distro = {
    id: GLib.get_os_info('ID'),
    logo: GLib.get_os_info('LOGO'),
};
