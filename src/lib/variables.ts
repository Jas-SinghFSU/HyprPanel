import { Variable } from 'astal';
import GLib from 'gi://GLib';

export const uptime = Variable(0).poll(
    60_00,
    'cat /proc/uptime',
    (line): number => Number.parseInt(line.split('.')[0]) / 60,
);

export const distro = {
    id: GLib.get_os_info('ID'),
    logo: GLib.get_os_info('LOGO'),
};
