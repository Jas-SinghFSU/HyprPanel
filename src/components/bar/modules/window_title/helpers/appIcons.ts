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
    ['zen', '', 'Zen Browser'],

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
    ['teamspeak', '', 'TeamSpeak'],
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

const overrides = {
    kitty: '',
};

/**
 * Generates a mapping of application names to their corresponding icons.
 * Uses the defaultWindowTitleMap to create the base mapping and applies any overrides.
 *
 * @returns An object where keys are application names and values are icon names.
 * If an application name exists in the overrides, that value is used instead of the default.
 *
 * @example
 * // Given:
 * defaultWindowTitleMap = [['kitty', '󰄛', 'Kitty Terminal'], ['firefox', '󰈹', 'Firefox']]
 * overrides = { 'kitty': '' }
 *
 * // Returns:
 * { 'kitty': '', 'firefox': '󰈹' }
 */
export const defaultApplicationIconMap = defaultWindowTitleMap.reduce(
    (iconMapAccumulator: Record<string, string>, windowTitles) => {
        const currentIconMap = iconMapAccumulator;

        const appName: string = windowTitles[0];
        const appIcon: string = windowTitles[1];

        if (!(appName in currentIconMap)) {
            currentIconMap[appName] = appIcon;
        }

        return currentIconMap;
    },
    overrides,
);
