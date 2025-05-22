import { opt } from 'src/lib/options';

export default {
    powermenu: {
        confirmation: opt(true),
        sleep: opt('systemctl suspend'),
        reboot: opt('systemctl reboot'),
        logout: opt('hyprctl dispatch exit'),
        shutdown: opt('systemctl poweroff'),
        avatar: {
            image: opt('~/.face.icon'),
            name: opt<'system' | string>('system'),
        },
    },
    stats: {
        enabled: opt(true),
        interval: opt(2000),
        enable_gpu: opt(false),
    },
    recording: {
        path: opt('$HOME/Videos/Screencasts'),
    },
    controls: {
        enabled: opt(true),
    },
    shortcuts: {
        enabled: opt(true),
        left: {
            shortcut1: {
                icon: opt('󰇩'),
                tooltip: opt('Microsoft Edge'),
                command: opt('microsoft-edge-stable'),
            },
            shortcut2: {
                icon: opt(''),
                tooltip: opt('Spotify'),
                command: opt('spotify-launcher'),
            },
            shortcut3: {
                icon: opt(''),
                tooltip: opt('Discord'),
                command: opt('discord'),
            },
            shortcut4: {
                icon: opt(''),
                tooltip: opt('Search Apps'),
                command: opt('rofi -show drun'),
            },
        },
        right: {
            shortcut1: {
                icon: opt(''),
                tooltip: opt('Color Picker'),
                command: opt('sleep 0.5 && hyprpicker -a'),
            },
            shortcut3: {
                icon: opt('󰄀'),
                tooltip: opt('Screenshot'),
                command: opt(`bash -c "${SRC_DIR}/scripts/snapshot.sh"`),
            },
        },
    },
    directories: {
        enabled: opt(true),
        left: {
            directory1: {
                label: opt('󰉍 Downloads'),
                command: opt('bash -c "xdg-open $HOME/Downloads/"'),
            },
            directory2: {
                label: opt('󰉏 Videos'),
                command: opt('bash -c "xdg-open $HOME/Videos/"'),
            },
            directory3: {
                label: opt('󰚝 Projects'),
                command: opt('bash -c "xdg-open $HOME/Projects/"'),
            },
        },
        right: {
            directory1: {
                label: opt('󱧶 Documents'),
                command: opt('bash -c "xdg-open $HOME/Documents/"'),
            },
            directory2: {
                label: opt('󰉏 Pictures'),
                command: opt('bash -c "xdg-open $HOME/Pictures/"'),
            },
            directory3: {
                label: opt('󱂵 Home'),
                command: opt('bash -c "xdg-open $HOME/"'),
            },
        },
    },
};
