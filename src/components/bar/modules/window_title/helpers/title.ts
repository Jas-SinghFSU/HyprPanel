import options from 'src/options';
import { capitalizeFirstLetter } from 'src/lib/utils';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';

export const getWindowMatch = (windowtitle: AstalHyprland.Client): Record<string, string> => {
    const windowTitleMap = [
        // user provided values
        ...options.bar.windowtitle.title_map.value,
        // Original Entries
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

        // Browsers
        ['google-chrome', '', 'Google Chrome'],
        ['brave-browser', '󰖟', 'Brave Browser'],
        ['chromium', '', 'Chromium'],
        ['opera', '', 'Opera'],
        ['vivaldi', '󰖟', 'Vivaldi'],
        ['waterfox', '󰖟', 'Waterfox'],
        ['thorium', '󰖟', 'Waterfox'],
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
        ['st', '', 'st Terminal'],

        // Development Tools
        ['code', '󰨞', 'Visual Studio Code'],
        ['vscode', '󰨞', 'VS Code'],
        ['sublime-text', '', 'Sublime Text'],
        ['atom', '', 'Atom'],
        ['android-studio', '󰀴', 'Android Studio'],
        ['intellij-idea', '', 'IntelliJ IDEA'],
        ['pycharm', '󱃖', 'PyCharm'],
        ['webstorm', '󱃖', 'WebStorm'],
        ['phpstorm', '󱃖', 'PhpStorm'],
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

        // Desktop
        ['^$', '󰇄', 'Desktop'],

        // Fallback icon
        ['(.+)', '󰣆', `${capitalizeFirstLetter(windowtitle?.class ?? 'Unknown')}`],
    ];

    if (windowtitle === null) {
        return {
            icon: '󰇄',
            label: 'Desktop',
        };
    }
    const foundMatch = windowTitleMap.find((wt) => RegExp(wt[0]).test(windowtitle.class.toLowerCase()));

    if (!foundMatch || foundMatch.length !== 3) {
        return {
            icon: windowTitleMap[windowTitleMap.length - 1][1],
            label: windowTitleMap[windowTitleMap.length - 1][2],
        };
    }

    return {
        icon: foundMatch[1],
        label: foundMatch[2],
    };
};

export const getTitle = (client: AstalHyprland.Client, useCustomTitle: boolean, useClassName: boolean): string => {
    if (client === null) return getWindowMatch(client).label;

    if (useCustomTitle) return getWindowMatch(client).label;
    if (useClassName) return client.class;

    const title = client.title;
    // If the title is empty or only filled with spaces, fallback to the class name
    if (title.length === 0 || title.match(/^ *$/)) {
        return client.class;
    }
    return title;
};

export const truncateTitle = (title: string, max_size: number): string => {
    if (max_size > 0 && title.length > max_size) {
        return title.substring(0, max_size).trim() + '...';
    }
    return title;
};
