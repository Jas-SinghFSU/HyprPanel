const hyprland = await Service.import("hyprland");

const filterTitle = (titleString) => {
  const windowTitleMap = [
    ["(.*) - NVIM", "  NeoVim"],
    ["(.*) - nvim", "  NeoVim"],
    ["(.*) - VIM", "  NeoVim"],
    ["(.*)vim (.*)", "  NeoVim"],
    ["(.*) — Mozilla Firefox", "󰈹  Firefox"],
    ["(.*) - Microsoft(.*)Edge", "󰇩  Edge"],
    ["(.*) - Discord", "  Discord"],
    ["(.*) — Dolphin", "  Dolphin"],
    ["Plex", "󰚺  Plex"],
    ["(.*) Steam", "  Steam"],
    ["  ", "󰇄  Desktop"],
    ["(.*) Spotify Free", "󰓇  Spotify"],
    ["(.*)Spotify Premium", "󰓇  Spotify"],
    ["Spotify", "󰓇  Spotify"],
    ["  ~", " Terminal"],
    ["(.*) - Obsidian(.*)", "󱓧  Obsidian"],
    ["(.*)", `󰣆  ${titleString.charAt(0).toUpperCase() + titleString.slice(1)}`],
  ];

  const foundMatch = windowTitleMap.find((wt) =>
    RegExp(wt[0]).test(titleString),
  );

  return foundMatch ? foundMatch[1] : titleString;
};

const ClientTitle = () => {
  return {
    component: Widget.Label({
      class_name: "window_title",
      label: hyprland.active.client.bind("title").as((v) => filterTitle(v)),
    }),
    isVisible: true,
  };
};

export { ClientTitle };
