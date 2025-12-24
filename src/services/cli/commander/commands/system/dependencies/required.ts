import { Dependency } from './types';

export const requiredDependencies: Dependency[] = [
    {
        package: 'wireplumber',
        required: true,
        type: 'executable',
        check: ['wireplumber'],
    },
    {
        package: 'libgtop',
        required: true,
        type: 'library',
        check: ['gtop-2.0'],
    },
    {
        package: 'networkmanager',
        required: true,
        type: 'service',
        check: ['NetworkManager.service'],
    },
    {
        package: 'dart-sass',
        required: true,
        type: 'executable',
        check: ['sass'],
    },
    {
        package: 'wl-clipboard',
        required: true,
        type: 'executable',
        check: ['wl-copy', 'wl-paste'],
    },
    {
        package: 'upower',
        required: true,
        type: 'service',
        check: ['upower.service'],
    },
    {
        package: 'gvfs',
        required: true,
        type: 'executable',
        check: ['/usr/lib/gvfsd', '/usr/libexec/gvfsd', '/usr/lib/gvfs/gvfsd'],
    },
    {
        package: 'gtksourceview3',
        required: true,
        type: 'library',
        check: ['gtksourceview-3.0', 'libgtksourceview-3.0'],
    },
    {
        package: 'libsoup3',
        required: true,
        type: 'library',
        check: ['libsoup-3.0', 'libsoup3'],
    },
    {
        package: 'aylurs-gtk-shell',
        required: true,
        type: 'executable',
        check: ['ags'],
    },
];
