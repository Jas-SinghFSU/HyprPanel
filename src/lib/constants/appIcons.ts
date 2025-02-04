export const defaultWindowTitleMap = [
    // Misc
    ['kitty', '󰄛', 'Kitty Terminal'],
    ['firefox', '󰈹', 'Firefox'],
    ['microsoft-edge', '󰇩', 'Edge'],
    ['discord', '', 'Discord'],
    ['vesktop', '', 'Vesktop'],
    ['org.kde.dolphin', '', 'Dolphin'],
    ['plex', '󰚺', 'Plex'],
    ['steam', '', 'Steam'],
    ['spotify', '󰓇', 'Spotify'],
    ['ristretto', '󰋩', 'Ristretto'],
    ['obsidian', '󱓧', 'Obsidian'],
    ['rofi', '', 'Rofi'],
    ['qBittorrent$', '', 'QBittorrent'],

    // Browsers
    ['google-chrome', '', 'Google Chrome'],
    ['brave-browser', '󰖟', 'Brave Browser'],
    ['chromium', '', 'Chromium'],
    ['opera', '', 'Opera'],
    ['vivaldi', '󰖟', 'Vivaldi'],
    ['waterfox', '󰖟', 'Waterfox'],
    ['thorium', '󰖟', 'Thorium'],
    ['tor-browser', '', 'Tor Browser'],
    ['floorp', '󰈹', 'Floorp'],

    // Terminals
    ['gnome-terminal', '', 'GNOME Terminal'],
    ['konsole', '', 'Konsole'],
    ['alacritty', '', 'Alacritty'],
    ['wezterm', '', 'Wezterm'],
    ['foot', '󰽒', 'Foot Terminal'],
    ['tilix', '', 'Tilix'],
    ['xterm', '', 'XTerm'],
    ['urxvt', '', 'URxvt'],
    ['com.mitchellh.ghostty', '󰊠', 'Ghostty'],
    ['^st$', '', 'st Terminal'],

    // Development Tools
    ['code', '󰨞', 'Visual Studio Code'],
    ['vscode', '󰨞', 'VS Code'],
    ['sublime-text', '', 'Sublime Text'],
    ['atom', '', 'Atom'],
    ['android-studio', '󰀴', 'Android Studio'],
    ['jetbrains-idea', '', 'IntelliJ IDEA'],
    ['jetbrains-pycharm', '', 'PyCharm'],
    ['jetbrains-webstorm', '', 'WebStorm'],
    ['jetbrains-phpstorm', '', 'PhpStorm'],
    ['eclipse', '', 'Eclipse'],
    ['netbeans', '', 'NetBeans'],
    ['docker', '', 'Docker'],
    ['vim', '', 'Vim'],
    ['neovim', '', 'Neovim'],
    ['neovide', '', 'Neovide'],
    ['emacs', '', 'Emacs'],

    // Communication Tools
    ['slack', '󰒱', 'Slack'],
    ['telegram-desktop', '', 'Telegram'],
    ['org.telegram.desktop', '', 'Telegram'],
    ['whatsapp', '󰖣', 'WhatsApp'],
    ['teams', '󰊻', 'Microsoft Teams'],
    ['skype', '󰒯', 'Skype'],
    ['thunderbird', '', 'Thunderbird'],

    // File Managers
    ['nautilus', '󰝰', 'Files (Nautilus)'],
    ['thunar', '󰝰', 'Thunar'],
    ['pcmanfm', '󰝰', 'PCManFM'],
    ['nemo', '󰝰', 'Nemo'],
    ['ranger', '󰝰', 'Ranger'],
    ['doublecmd', '󰝰', 'Double Commander'],
    ['krusader', '󰝰', 'Krusader'],

    // Media Players
    ['vlc', '󰕼', 'VLC Media Player'],
    ['mpv', '', 'MPV'],
    ['rhythmbox', '󰓃', 'Rhythmbox'],

    // Graphics Tools
    ['gimp', '', 'GIMP'],
    ['inkscape', '', 'Inkscape'],
    ['krita', '', 'Krita'],
    ['blender', '󰂫', 'Blender'],

    // Video Editing
    ['kdenlive', '', 'Kdenlive'],

    // Games and Gaming Platforms
    ['lutris', '󰺵', 'Lutris'],
    ['heroic', '󰺵', 'Heroic Games Launcher'],
    ['minecraft', '󰍳', 'Minecraft'],
    ['csgo', '󰺵', 'CS:GO'],
    ['dota2', '󰺵', 'Dota 2'],

    // Office and Productivity
    ['evernote', '', 'Evernote'],
    ['sioyek', '', 'Sioyek'],

    // Cloud Services and Sync
    ['dropbox', '󰇣', 'Dropbox'],
];

export const defaultApplicationIcons = defaultWindowTitleMap.reduce(
    function (map, obj) {
        const key: string = obj[0];
        if (!(key in map)) {
            map[key] = obj[1];
        }

        return map;
    },
    // Overrides are defined here
    {
        kitty: '',
    },
);
