const hyprland = await Service.import("hyprland");
import { ActiveClient } from 'types/service/hyprland'

const filterTitle = (windowtitle: ActiveClient) => {
    const windowTitleMap = [
        ["kitty", "󰄛", "Kitty Terminal"],
        ["firefox", "󰈹", "Firefox"],
        ["microsoft-edge", "󰇩", "Edge"],
        ["discord", "", "Discord"],
        ["org.kde.dolphin", "", "Dolphin"],
        ["plex", "󰚺", "Plex"],
        ["steam", "", "Steam"],
        ["spotify", "󰓇", "Spotify"],
        ["obsidian", "󱓧", "Obsidian"],
        ["^$", "󰇄", "Desktop"],
        ["(.+)", "󰣆", `${windowtitle.class.charAt(0).toUpperCase() + windowtitle.class.slice(1)}`],
    ];

    const foundMatch = windowTitleMap.find((wt) =>
        RegExp(wt[0]).test(windowtitle.class.toLowerCase()),
    );

    return {
        icon: foundMatch ? foundMatch[1] : windowTitleMap[windowTitleMap.length - 1][1],
        label: foundMatch ? foundMatch[2] : windowTitleMap[windowTitleMap.length - 1][2]
    }
};

const ClientTitle = () => {
    return {
        component: Widget.Box({
            children: [
                Widget.Label({
                    class_name: "bar-button-icon windowtitle",
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
