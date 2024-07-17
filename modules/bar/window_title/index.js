const hyprland = await Service.import("hyprland");

const filterTitle = (windowtitle) => {
  const windowTitleMap = [
    ["kitty", "󰄛   Kitty Terminal"],
    ["firefox", "󰈹   Firefox"],
    ["microsoft-edge", "󰇩   Edge"],
    ["discord", "    Discord"],
    ["org.kde.dolphin", "   Dolphin"],
    ["plex", "󰚺   Plex"],
    ["steam", "   Steam"],
    ["spotify", "󰓇   Spotify"],
    ["obsidian", "󱓧   Obsidian"],
    ["^$", "󰇄   Desktop"],
    ["(.+)", `󰣆   ${windowtitle.class.charAt(0).toUpperCase() + windowtitle.class.slice(1)}`],
  ];

  const foundMatch = windowTitleMap.find((wt) =>
    RegExp(wt[0]).test(windowtitle.class.toLowerCase()),
  );

  return foundMatch ? foundMatch[1] : windowtitle.class;
};

const ClientTitle = () => {
  return {
    component: Widget.Label({
      class_name: "window_title",
      label: hyprland.active.bind("client").as((v) => filterTitle(v)),
    }),
    isVisible: true,
    boxClass: "windowtitle",
  };
};

export { ClientTitle };
