const hyprland = await Service.import("hyprland");
import options from 'options';
import { ActiveClient } from 'types/service/hyprland'
import Label from "types/widgets/label";

const filterTitle = (windowtitle: ActiveClient) => {
    const windowTitleMap = [
        // user provided values
        ...options.bar.windowtitle.title_map.value,
        // Original Entries
        ["kitty", "󰄛", "Kitty Terminal"],
        ["firefox", "󰈹", "Firefox"],
        ["microsoft-edge", "󰇩", "Edge"],
        ["discord", "", "Discord"],
        ["vesktop", "", "Vesktop"],
        ["org.kde.dolphin", "", "Dolphin"],
        ["plex", "󰚺", "Plex"],
        ["steam", "", "Steam"],
        ["spotify", "󰓇", "Spotify"],
        ["ristretto", "󰋩", "Ristretto"],
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
        ["floorp", "󰈹", "Floorp"],

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
        ["neovide", "", "Neovide"],
        ["emacs", "", "Emacs"],

        // Communication Tools
        ["slack", "󰒱", "Slack"],
        ["telegram-desktop", "", "Telegram"],
        ["org.telegram.desktop", "", "Telegram"],
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
        ["sioyek", "", "Sioyek"],


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

const defaultTitle = (client: ActiveClient) => {
    let title = client.title;
    // If the title is empty or only filled with spaces, fallback to the class name
    if (title.length === 0 || title.match(/^ *$/)) {
        title = client.class;
    }
    return title;
};

const truncateTitle = (title: string, max_size: number) => {
    if (max_size > 0 && title.length > max_size) {
        return title.substring(0, max_size).trim() + "...";
    }
    return title;
}

const ClientTitle = () => {
    const { show_custom_title, label: show_label, show_icon, truncation, truncation_size } = options.bar.windowtitle;

    return {
        component: Widget.Box({
            className: Utils.merge([options.theme.bar.buttons.style.bind("value"), show_label.bind("value")], (style, showLabel) => {
                const styleMap = {
                    default: "style1",
                    split: "style2",
                    wave: "style3",
                };
                return `windowtitle ${styleMap[style]} ${!showLabel ? "no-label" : ""}`;
            }),
            children:
                Utils.merge(
                    [hyprland.active.bind("client"), show_custom_title.bind("value"), show_label.bind("value"), show_icon.bind("value"),
                        truncation.bind("value"), truncation_size.bind("value")],
                    (client, showCustomTitle, showLabel, showIcon, truncate, truncationSize) => {
                        const children: Label<any>[] = [];
                        if (showCustomTitle && showIcon) {
                            children.push(Widget.Label({
                                class_name: "bar-button-icon windowtitle txt-icon bar",
                                label: filterTitle(client).icon,
                            }));
                        }
                        if (!showCustomTitle || showLabel) {
                            children.push(Widget.Label({
                                class_name: `bar-button-label windowtitle ${showCustomTitle && showIcon ? "" : "no-icon"}`,
                                label: truncateTitle(showCustomTitle ? filterTitle(client).label : defaultTitle(client), truncate ? truncationSize : -1),
                            }));
                        }
                        return children;
                    }),
        }),
        isVisible: true,
        boxClass: "windowtitle",
        props: {}
    };
};

export { ClientTitle };
