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

export const distroIcons = [
    ['deepin', ''],
    ['fedora', ''],
    ['arch', ''],
    ['nixos', ''],
    ['debian', ''],
    ['opensuse-tumbleweed', ''],
    ['ubuntu', ''],
    ['endeavouros', ''],
    ['manjaro', ''],
    ['popos', ''],
    ['garuda', ''],
    ['zorin', ''],
    ['mxlinux', ''],
    ['arcolinux', ''],
    ['gentoo', ''],
    ['artix', ''],
    ['centos', ''],
    ['hyperbola', ''],
    ['kubuntu', ''],
    ['mandriva', ''],
    ['xerolinux', ''],
    ['parabola', ''],
    ['void', ''],
    ['linuxmint', ''],
    ['archlabs', ''],
    ['devuan', ''],
    ['freebsd', ''],
    ['openbsd', ''],
    ['slackware', ''],
];

export function getDistroIcon(): string {
    const icon = distroIcons.find(([id]) => id === distro.id);
    return icon ? icon[1] : ''; // default icon if not found
}
