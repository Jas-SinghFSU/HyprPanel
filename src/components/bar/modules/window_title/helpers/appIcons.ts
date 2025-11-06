export const defaultWindowTitleMap = [
    // Misc
    ['qBittorrent$', '', 'QBittorrent'],
    ['rofi', '', 'Rofi'],

    // Browsers
    ['brave-browser', '󰖟', 'Brave Browser'],
    ['chromium', '', 'Chromium'],
    ['firefox', '󰈹', 'Firefox'],
    ['floorp', '󰈹', 'Floorp'],
    ['google-chrome', '', 'Google Chrome'],
    ['microsoft-edge', '󰇩', 'Edge'],
    ['opera', '', 'Opera'],
    ['thorium', '󰖟', 'Thorium'],
    ['tor-browser', '', 'Tor Browser'],
    ['vivaldi', '󰖟', 'Vivaldi'],
    ['waterfox', '󰖟', 'Waterfox'],
    ['zen', '', 'Zen Browser'],

    // Terminals
    ['^st$', '', 'st Terminal'],
    ['alacritty', '', 'Alacritty'],
    ['com.mitchellh.ghostty', '󰊠', 'Ghostty'],
    ['foot', '󰽒', 'Foot Terminal'],
    ['gnome-terminal', '', 'GNOME Terminal'],
    ['kitty', '󰄛', 'Kitty Terminal'],
    ['konsole', '', 'Konsole'],
    ['tilix', '', 'Tilix'],
    ['urxvt', '', 'URxvt'],
    ['wezterm', '', 'Wezterm'],
    ['xterm', '', 'XTerm'],

    // Development Tools
    ['DBeaver', '', 'DBeaver'],
    ['android-studio', '󰀴', 'Android Studio'],
    ['atom', '', 'Atom'],
    ['code', '󰨞', 'Visual Studio Code'],
    ['docker', '', 'Docker'],
    ['eclipse', '', 'Eclipse'],
    ['emacs', '', 'Emacs'],
    ['jetbrains-idea', '', 'IntelliJ IDEA'],
    ['jetbrains-phpstorm', '', 'PhpStorm'],
    ['jetbrains-pycharm', '', 'PyCharm'],
    ['jetbrains-webstorm', '', 'WebStorm'],
    ['neovide', '', 'Neovide'],
    ['neovim', '', 'Neovim'],
    ['netbeans', '', 'NetBeans'],
    ['sublime-text', '', 'Sublime Text'],
    ['vim', '', 'Vim'],
    ['vscode', '󰨞', 'VS Code'],

    // Communication Tools
    ['discord', '', 'Discord'],
    ['legcord', '', 'Legcord'],
    ['webcord', '', 'WebCord'],
    ['org.telegram.desktop', '', 'Telegram'],
    ['skype', '󰒯', 'Skype'],
    ['slack', '󰒱', 'Slack'],
    ['teams', '󰊻', 'Microsoft Teams'],
    ['teamspeak', '', 'TeamSpeak'],
    ['telegram-desktop', '', 'Telegram'],
    ['thunderbird', '', 'Thunderbird'],
    ['vesktop', '', 'Vesktop'],
    ['whatsapp', '󰖣', 'WhatsApp'],

    // File Managers
    ['doublecmd', '󰝰', 'Double Commander'],
    ['krusader', '󰝰', 'Krusader'],
    ['nautilus', '󰝰', 'Files (Nautilus)'],
    ['nemo', '󰝰', 'Nemo'],
    ['org.kde.dolphin', '', 'Dolphin'],
    ['pcmanfm', '󰝰', 'PCManFM'],
    ['ranger', '󰝰', 'Ranger'],
    ['thunar', '󰝰', 'Thunar'],

    // Media Players
    ['mpv', '', 'MPV'],
    ['plex', '󰚺', 'Plex'],
    ['rhythmbox', '󰓃', 'Rhythmbox'],
    ['ristretto', '󰋩', 'Ristretto'],
    ['spotify', '󰓇', 'Spotify'],
    ['vlc', '󰕼', 'VLC Media Player'],

    // Graphics Tools
    ['blender', '󰂫', 'Blender'],
    ['gimp', '', 'GIMP'],
    ['inkscape', '', 'Inkscape'],
    ['krita', '', 'Krita'],

    // Video Editing
    ['kdenlive', '', 'Kdenlive'],

    // Games and Gaming Platforms
    ['csgo', '󰺵', 'CS:GO'],
    ['dota2', '󰺵', 'Dota 2'],
    ['heroic', '󰺵', 'Heroic Games Launcher'],
    ['lutris', '󰺵', 'Lutris'],
    ['minecraft', '󰍳', 'Minecraft'],
    ['steam', '', 'Steam'],

    // Office and Productivity
    ['evernote', '', 'Evernote'],
    ['libreoffice-base', '', 'LibreOffice Base'],
    ['libreoffice-calc', '', 'LibreOffice Calc'],
    ['libreoffice-draw', '', 'LibreOffice Draw'],
    ['libreoffice-impress', '', 'LibreOffice Impress'],
    ['libreoffice-math', '', 'LibreOffice Math'],
    ['libreoffice-writer', '', 'LibreOffice Writer'],
    ['obsidian', '󱓧', 'Obsidian'],
    ['sioyek', '', 'Sioyek'],
    // putting these at the bottom, as they are defaults
    ['libreoffice', '', 'LibreOffice Default'],
    ['title:LibreOffice', '', 'LibreOffice Dialogs'],
    ['soffice', '', 'LibreOffice Base Selector'],

    // Cloud Services and Sync
    ['dropbox', '󰇣', 'Dropbox'],
];

const overrides = {};

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
