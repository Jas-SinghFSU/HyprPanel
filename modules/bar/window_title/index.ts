const hyprland = await Service.import("hyprland");
import options from 'options';
import { ActiveClient } from 'types/service/hyprland'

const filterTitle = (windowtitle: ActiveClient) => {
    const windowTitleMap = [
        // user provided values
        ...options.bar.windowtitle.title_map.value,
        // Original Entries
        ["kitty", "󰄛", "Kitty Terminal"],
        ["firefox", "󰈹", "Firefox"],
        ["microsoft-edge", "󰇩", "Edge"],
        ["discord", "", "Discord"],
        ["org.kde.dolphin", "", "Dolphin"],
        ["plex", "󰚺", "Plex"],
        ["steam", "", "Steam"],
        ["spotify", "󰓇", "Spotify"],
        ["obsidian", "󱓧", "Obsidian"],

        // Browsers
        ["google-chrome", "", "Google Chrome"],
        ["brave-browser", "󰖟", "Brave Browser"],
        ["chromium", "", "Chromium"],
        ["opera", "", "Opera"],
        ["vivaldi", "󰖟", "Vivaldi"],
        ["waterfox", "󰖟", "Waterfox"],
        ["thorium", "󰖟", "Waterfox"],
        ["tor-browser", "", "Tor Browser"],

        // Terminals
        ["gnome-terminal", "", "GNOME Terminal"],
        ["konsole", "", "Konsole"],
        ["alacritty", "", "Alacritty"],
        ["wezterm", "", "Wezterm"],
        ["foot", "󰽒", "Foot Terminal"],
        ["tilix", "", "Tilix"],
        ["xterm", "", "XTerm"],
        ["urxvt", "", "URxvt"],
        ["st", "", "st Terminal"],

        // Development Tools
        ["code", "󰨞", "Visual Studio Code"],
        ["vscode", "󰨞", "VS Code"],
        ["sublime-text", "", "Sublime Text"],
        ["atom", "", "Atom"],
        ["android-studio", "󰀴", "Android Studio"],
        ["intellij-idea", "", "IntelliJ IDEA"],
        ["pycharm", "󱃖", "PyCharm"],
        ["webstorm", "󱃖", "WebStorm"],
        ["phpstorm", "󱃖", "PhpStorm"],
        ["eclipse", "", "Eclipse"],
        ["netbeans", "", "NetBeans"],
        ["docker", "", "Docker"],
        ["vim", "", "Vim"],
        ["neovim", "", "Neovim"],
        ["emacs", "", "Emacs"],

        // Communication Tools
        ["slack", "󰒱", "Slack"],
        ["telegram-desktop", "", "Telegram"],
        ["whatsapp", "󰖣", "WhatsApp"],
        ["teams", "󰊻", "Microsoft Teams"],
        ["skype", "󰒯", "Skype"],
        ["thunderbird", "", "Thunderbird"],

        // File Managers
        ["nautilus", "󰝰", "Files (Nautilus)"],
        ["thunar", "󰝰", "Thunar"],
        ["pcmanfm", "󰝰", "PCManFM"],
        ["nemo", "󰝰", "Nemo"],
        ["ranger", "󰝰", "Ranger"],
        ["doublecmd", "󰝰", "Double Commander"],
        ["krusader", "󰝰", "Krusader"],

        // Media Players
        ["vlc", "󰕼", "VLC Media Player"],
        ["mpv", "", "MPV"],
        ["rhythmbox", "󰓃", "Rhythmbox"],

        // Graphics Tools
        ["gimp", "", "GIMP"],
        ["inkscape", "", "Inkscape"],
        ["krita", "", "Krita"],
        ["blender", "󰂫", "Blender"],

        // Video Editing
        ["kdenlive", "", "Kdenlive"],

        // Games and Gaming Platforms
        ["lutris", "󰺵", "Lutris"],
        ["heroic", "󰺵", "Heroic Games Launcher"],
        ["minecraft", "󰍳", "Minecraft"],
        ["csgo", "󰺵", "CS:GO"],
        ["dota2", "󰺵", "Dota 2"],

        // Office and Productivity
        ["evernote", "", "Evernote"],

        // Cloud Services and Sync
        ["dropbox", "󰇣", "Dropbox"],

        // Desktop
        ["^$", "󰇄", "Desktop"],

        // Fallback icon
        ["(.+)", "󰣆", `${windowtitle.class.charAt(0).toUpperCase() + windowtitle.class.slice(1)}`],
    ];

    const foundMatch = windowTitleMap.find((wt) =>
        RegExp(wt[0]).test(windowtitle.class.toLowerCase()),
    );

    // return the default icon if no match is found or
    // if the array element matched is not of size 3
    if (!foundMatch || foundMatch.length !== 3) {
        return {
            icon: windowTitleMap[windowTitleMap.length - 1][1],
            label: windowTitleMap[windowTitleMap.length - 1][2],
        };
    }

    return {
        icon: foundMatch ? foundMatch[1] : windowTitleMap[windowTitleMap.length - 1][1],
        label: foundMatch ? foundMatch[2] : windowTitleMap[windowTitleMap.length - 1][2]
    };
};

const ClientTitle = () => {
    return {
        component: Widget.Box({
            children: [
                Widget.Label({
                    class_name: "bar-button-icon windowtitle txt-icon bar",
                    label: hyprland.active.bind("client").as((v) => filterTitle(v).icon),
                }),
                Widget.Label({
                    class_name: "bar-button-label windowtitle",
                    label: hyprland.active.bind("client").as((v) => filterTitle(v).label),
                })
            ]
        }),
        isVisible: true,
        boxClass: "windowtitle",
    };
};

export { ClientTitle };
