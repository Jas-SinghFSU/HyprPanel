import GLib from 'gi://GLib';
import { DateTime } from 'types/@girs/glib-2.0/glib-2.0.cjs';

export const clock = Variable(GLib.DateTime.new_now_local(), {
    poll: [1000, (): DateTime => GLib.DateTime.new_now_local()],
});

export const uptime = Variable(0, {
    poll: [60_000, 'cat /proc/uptime', (line): number => Number.parseInt(line.split('.')[0]) / 60],
});

export const distro = {
    id: GLib.get_os_info('ID'),
    logo: GLib.get_os_info('LOGO'),
};

export const distroIcon = ((): string => {
    switch (distro.id) {
        case 'fedora':
            return '';
        case 'arch':
            return '';
        case 'nixos':
            return '';
        case 'debian':
            return '';
        case 'opensuse-tumbleweed':
            return '';
        case 'ubuntu':
            return '';
        case 'endeavouros':
            return '';
        case 'manjaro':
            return '';
        case 'popos':
            return '';
        case 'garuda':
            return '';
        case 'zorin':
            return '';
        case 'mxlinux':
            return '';
        case 'arcolinux':
            return '';
        case 'gentoo':
            return '';
        case 'artix':
            return '';
        case 'centos':
            return '';
        case 'void':
            return '';
        case 'linuxmint':
            return '';
        case 'archlabs':
            return '';
        case 'archcraft':
            return '';
        case 'slackware':
            return '';
        default:
            return '';
    }
})();
