self:
{
  lib,
  pkgs,
  config,
  ...
}:
let
  inherit (lib)
    types
    mkIf
    mkOption
    mkEnableOption
    ;

  cfg = config.programs.hyprpanel;

  # No package option
  package = if pkgs ? hyprpanel then pkgs.hyprpanel else self.packages.${pkgs.stdenv.system}.wrapper;

  mkBoolOption =
    default:
    mkOption {
      type = types.bool;
      default = default;
    };

in
{
  options.programs.hyprpanel = {
    enable = mkEnableOption "HyprPanel";
    config.enable = mkBoolOption true; # Generate config
    overlay.enable = mkEnableOption "script overlay";
    systemd.enable = mkEnableOption "systemd integration";
    hyprland.enable = mkEnableOption "Hyprland integration";
    overwrite.enable = mkEnableOption "overwrite config fix";

    settings = mkOption {
      default = {
        bar.autoHide = "never";
        bar.battery.hideLabelWhenFull = false;
        bar.battery.label = true;
        bar.battery.middleClick = "";
        bar.battery.rightClick = "";
        bar.battery.scrollDown = "";
        bar.battery.scrollUp = "";
        bar.bluetooth.label = true;
        bar.bluetooth.middleClick = "";
        bar.bluetooth.rightClick = "";
        bar.bluetooth.scrollDown = "";
        bar.bluetooth.scrollUp = "";
        bar.clock.format = "%a %b %d  %I:%M:%S %p";
        bar.clock.icon = "󰸗";
        bar.clock.middleClick = "";
        bar.clock.rightClick = "";
        bar.clock.scrollDown = "";
        bar.clock.scrollUp = "";
        bar.clock.showIcon = true;
        bar.clock.showTime = true;
        bar.customModules.cava.showIcon = true;
        bar.customModules.cava.icon = "";
        bar.customModules.cava.spaceCharacter = " ";
        bar.customModules.cava.barCharacters = [
          "▁"
          "▂"
          "▃"
          "▄"
          "▅"
          "▆"
          "▇"
          "█"
        ];
        bar.customModules.cava.showActiveOnly = false;
        bar.customModules.cava.bars = 10;
        bar.customModules.cava.channels = 2;
        bar.customModules.cava.framerate = 60;
        bar.customModules.cava.samplerate = 44100;
        bar.customModules.cava.autoSensitivity = true;
        bar.customModules.cava.lowCutoff = 50;
        bar.customModules.cava.highCutoff = 10000;
        bar.customModules.cava.noiseReduction = 0.77;
        bar.customModules.cava.stereo = false;
        bar.customModules.cava.leftClick = "";
        bar.customModules.cava.rightClick = "";
        bar.customModules.cava.middleClick = "";
        bar.customModules.cava.scrollUp = "";
        bar.customModules.cava.scrollDown = "";
        bar.customModules.cpu.icon = "";
        bar.customModules.cpu.label = true;
        bar.customModules.cpu.leftClick = "";
        bar.customModules.cpu.middleClick = "";
        bar.customModules.cpu.pollingInterval = 2000;
        bar.customModules.cpu.rightClick = "";
        bar.customModules.cpu.round = true;
        bar.customModules.cpu.scrollDown = "";
        bar.customModules.cpu.scrollUp = "";
        bar.customModules.cpuTemp.icon = "";
        bar.customModules.cpuTemp.label = true;
        bar.customModules.cpuTemp.leftClick = "";
        bar.customModules.cpuTemp.middleClick = "";
        bar.customModules.cpuTemp.pollingInterval = 2000;
        bar.customModules.cpuTemp.rightClick = "";
        bar.customModules.cpuTemp.round = true;
        bar.customModules.cpuTemp.scrollDown = "";
        bar.customModules.cpuTemp.scrollUp = "";
        bar.customModules.cpuTemp.sensor = "";
        bar.customModules.cpuTemp.showUnit = true;
        bar.customModules.cpuTemp.unit = "metric";
        bar.customModules.hypridle.label = true;
        bar.customModules.hypridle.middleClick = "";
        bar.customModules.hypridle.offIcon = "";
        bar.customModules.hypridle.offLabel = "Off";
        bar.customModules.hypridle.onIcon = "";
        bar.customModules.hypridle.onLabel = "On";
        bar.customModules.hypridle.pollingInterval = 2000;
        bar.customModules.hypridle.rightClick = "";
        bar.customModules.hypridle.scrollDown = "";
        bar.customModules.hypridle.scrollUp = "";
        bar.customModules.hyprsunset.label = true;
        bar.customModules.hyprsunset.middleClick = "";
        bar.customModules.hyprsunset.offIcon = "󰛨";
        bar.customModules.hyprsunset.offLabel = "Off";
        bar.customModules.hyprsunset.onIcon = "󱩌";
        bar.customModules.hyprsunset.onLabel = "On";
        bar.customModules.hyprsunset.pollingInterval = 2000;
        bar.customModules.hyprsunset.rightClick = "";
        bar.customModules.hyprsunset.scrollDown = "";
        bar.customModules.hyprsunset.scrollUp = "";
        bar.customModules.hyprsunset.temperature = "6000k";
        bar.customModules.kbLayout.icon = "󰌌";
        bar.customModules.kbLayout.label = true;
        bar.customModules.kbLayout.labelType = "code";
        bar.customModules.kbLayout.leftClick = "";
        bar.customModules.kbLayout.middleClick = "";
        bar.customModules.kbLayout.rightClick = "";
        bar.customModules.kbLayout.scrollDown = "";
        bar.customModules.kbLayout.scrollUp = "";
        bar.customModules.netstat.dynamicIcon = false;
        bar.customModules.netstat.icon = "󰖟";
        bar.customModules.netstat.label = true;
        bar.customModules.netstat.labelType = "full";
        bar.customModules.netstat.leftClick = "";
        bar.customModules.netstat.middleClick = "";
        bar.customModules.netstat.networkInLabel = "↓";
        bar.customModules.netstat.networkInterface = "";
        bar.customModules.netstat.networkOutLabel = "↑";
        bar.customModules.netstat.pollingInterval = 2000;
        bar.customModules.netstat.rateUnit = "auto";
        bar.customModules.netstat.rightClick = "";
        bar.customModules.netstat.round = true;
        bar.customModules.power.icon = "";
        bar.customModules.power.leftClick = "menu:powerdropdown";
        bar.customModules.power.middleClick = "";
        bar.customModules.power.rightClick = "";
        bar.customModules.power.scrollDown = "";
        bar.customModules.power.scrollUp = "";
        bar.customModules.power.showLabel = true;
        bar.customModules.microphone.label = true;
        bar.customModules.microphone.mutedIcon = "󰍭";
        bar.customModules.microphone.unmutedIcon = "󰍬";
        bar.customModules.microphone.leftClick = "menu:audio";
        bar.customModules.microphone.rightClick = "";
        bar.customModules.microphone.middleClick = "";
        bar.customModules.microphone.scrollUp = "";
        bar.customModules.microphone.scrollDown = "";
        bar.customModules.ram.icon = "";
        bar.customModules.ram.label = true;
        bar.customModules.ram.labelType = "percentage";
        bar.customModules.ram.leftClick = "";
        bar.customModules.ram.middleClick = "";
        bar.customModules.ram.pollingInterval = 2000;
        bar.customModules.ram.rightClick = "";
        bar.customModules.ram.round = true;
        bar.customModules.scrollSpeed = 5;
        bar.customModules.storage.icon = "󰋊";
        bar.customModules.storage.label = true;
        bar.customModules.storage.labelType = "percentage";
        bar.customModules.storage.leftClick = "";
        bar.customModules.storage.middleClick = "";
        bar.customModules.storage.pollingInterval = 2000;
        bar.customModules.storage.rightClick = "";
        bar.customModules.storage.round = false;
        bar.customModules.submap.disabledIcon = "󰌌";
        bar.customModules.submap.disabledText = "Submap off";
        bar.customModules.submap.enabledIcon = "󰌐";
        bar.customModules.submap.enabledText = "Submap On";
        bar.customModules.submap.label = true;
        bar.customModules.submap.leftClick = "";
        bar.customModules.submap.middleClick = "";
        bar.customModules.submap.rightClick = "";
        bar.customModules.submap.scrollDown = "";
        bar.customModules.submap.scrollUp = "";
        bar.customModules.submap.showSubmapName = true;
        bar.customModules.updates.autoHide = false;
        bar.customModules.updates.icon.pending = "󰏗";
        bar.customModules.updates.icon.updated = "󰏖";
        bar.customModules.updates.label = true;
        bar.customModules.updates.leftClick = "";
        bar.customModules.updates.middleClick = "";
        bar.customModules.updates.padZero = true;
        bar.customModules.updates.pollingInterval = 1440000;
        bar.customModules.updates.rightClick = "";
        bar.customModules.updates.scrollDown = "";
        bar.customModules.updates.scrollUp = "";
        bar.customModules.updates.updateCommand = "";
        bar.customModules.weather.label = true;
        bar.customModules.weather.leftClick = "";
        bar.customModules.weather.middleClick = "";
        bar.customModules.weather.rightClick = "";
        bar.customModules.weather.scrollDown = "";
        bar.customModules.weather.scrollUp = "";
        bar.customModules.weather.unit = "imperial";
        bar.customModules.worldclock.format = "%I:%M:%S %p %Z";
        bar.customModules.worldclock.formatDiffDate = "%a %b %d  %I:%M:%S %p %Z";
        bar.customModules.worldclock.divider = "  ";
        bar.customModules.worldclock.icon = "󱉊";
        bar.customModules.worldclock.middleClick = "";
        bar.customModules.worldclock.rightClick = "";
        bar.customModules.worldclock.scrollDown = "";
        bar.customModules.worldclock.scrollUp = "";
        bar.customModules.worldclock.showIcon = true;
        bar.customModules.worldclock.showTime = true;
        bar.customModules.worldclock.tz = [
          "America/New_York"
          "Europe/Paris"
          "Asia/Tokyo"
        ];
        bar.launcher.autoDetectIcon = false;
        bar.launcher.icon = "󰣇";
        bar.launcher.middleClick = "";
        bar.launcher.rightClick = "";
        bar.launcher.scrollDown = "";
        bar.launcher.scrollUp = "";
        bar.media.format = "{artist: - }{title}";
        bar.media.middleClick = "";
        bar.media.rightClick = "";
        bar.media.scrollDown = "";
        bar.media.scrollUp = "";
        bar.media.show_active_only = false;
        bar.media.show_label = true;
        bar.media.truncation = true;
        bar.media.truncation_size = 30;
        bar.network.label = true;
        bar.network.middleClick = "";
        bar.network.rightClick = "";
        bar.network.scrollDown = "";
        bar.network.scrollUp = "";
        bar.network.showWifiInfo = false;
        bar.network.truncation = true;
        bar.network.truncation_size = 7;
        bar.notifications.hideCountWhenZero = false;
        bar.notifications.middleClick = "";
        bar.notifications.rightClick = "";
        bar.notifications.scrollDown = "";
        bar.notifications.scrollUp = "";
        bar.notifications.show_total = false;
        bar.scrollSpeed = 5;
        bar.systray.ignore = [ ];
        bar.volume.label = true;
        bar.volume.middleClick = "";
        bar.volume.rightClick = "";
        bar.volume.scrollDown = "${package}/bin/hyprpanel 'vol -5'";
        bar.volume.scrollUp = "${package}/bin/hyprpanel 'vol +5'";
        bar.windowtitle.class_name = true;
        bar.windowtitle.custom_title = true;
        bar.windowtitle.icon = true;
        bar.windowtitle.label = true;
        bar.windowtitle.leftClick = "";
        bar.windowtitle.middleClick = "";
        bar.windowtitle.rightClick = "";
        bar.windowtitle.scrollDown = "";
        bar.windowtitle.scrollUp = "";
        bar.windowtitle.truncation = true;
        bar.windowtitle.truncation_size = 50;
        bar.workspaces.applicationIconEmptyWorkspace = "";
        bar.workspaces.applicationIconFallback = "󰣆";
        bar.workspaces.applicationIconOncePerWorkspace = true;
        bar.workspaces.icons.active = "";
        bar.workspaces.icons.available = "";
        bar.workspaces.icons.occupied = "";
        bar.workspaces.ignored = "";
        bar.workspaces.monitorSpecific = true;
        bar.workspaces.numbered_active_indicator = "underline";
        bar.workspaces.reverse_scroll = false;
        bar.workspaces.scroll_speed = 5;
        bar.workspaces.showAllActive = true;
        bar.workspaces.showApplicationIcons = false;
        bar.workspaces.showWsIcons = false;
        bar.workspaces.show_icons = false;
        bar.workspaces.show_numbered = false;
        bar.workspaces.spacing = 1.0;
        bar.workspaces.workspaceMask = false;
        bar.workspaces.workspaces = 5;
        bar.workspaces.workspaceIconMap = { };
        bar.workspaces.applicationIconMap = { };
        dummy = true;
        hyprpanel.restartAgs = true;
        # hyprpanel.restartCommand = "${pkgs.procps}/bin/pkill -u $USER -USR1 hyprpanel; ${package}/bin/hyprpanel";
        hyprpanel.restartCommand = "${package}/bin/hyprpanel q; ${package}/bin/hyprpanel";
        menus.clock.time.hideSeconds = false;
        menus.clock.time.military = false;
        menus.clock.weather.enabled = true;
        menus.clock.weather.interval = 60000;
        menus.clock.weather.key = "";
        menus.clock.weather.location = "Los Angeles";
        menus.clock.weather.unit = "imperial";
        menus.dashboard.controls.enabled = true;
        menus.dashboard.directories.enabled = true;
        menus.dashboard.directories.left.directory1.command = "bash -c \"xdg-open $HOME/Downloads/\"";
        menus.dashboard.directories.left.directory1.label = "󰉍 Downloads";
        menus.dashboard.directories.left.directory2.command = "bash -c \"xdg-open $HOME/Videos/\"";
        menus.dashboard.directories.left.directory2.label = "󰉏 Videos";
        menus.dashboard.directories.left.directory3.command = "bash -c \"xdg-open $HOME/Projects/\"";
        menus.dashboard.directories.left.directory3.label = "󰚝 Projects";
        menus.dashboard.directories.right.directory1.command = "bash -c \"xdg-open $HOME/Documents/\"";
        menus.dashboard.directories.right.directory1.label = "󱧶 Documents";
        menus.dashboard.directories.right.directory2.command = "bash -c \"xdg-open $HOME/Pictures/\"";
        menus.dashboard.directories.right.directory2.label = "󰉏 Pictures";
        menus.dashboard.directories.right.directory3.command = "bash -c \"xdg-open $HOME/\"";
        menus.dashboard.directories.right.directory3.label = "󱂵 Home";
        menus.dashboard.powermenu.avatar.image = "$HOME/.face.icon";
        menus.dashboard.powermenu.avatar.name = "system";
        menus.dashboard.powermenu.confirmation = true;
        menus.dashboard.powermenu.logout = "hyprctl dispatch exit";
        menus.dashboard.powermenu.reboot = "systemctl reboot";
        menus.dashboard.powermenu.shutdown = "systemctl poweroff";
        menus.dashboard.powermenu.sleep = "systemctl suspend";
        menus.dashboard.recording.path = "$HOME/Videos/Screencasts";
        menus.dashboard.shortcuts.enabled = true;
        menus.dashboard.shortcuts.left.shortcut1.command = "microsoft-edge-stable";
        menus.dashboard.shortcuts.left.shortcut1.icon = "󰇩";
        menus.dashboard.shortcuts.left.shortcut1.tooltip = "Microsoft Edge";
        menus.dashboard.shortcuts.left.shortcut2.command = "spotify-launcher";
        menus.dashboard.shortcuts.left.shortcut2.icon = "";
        menus.dashboard.shortcuts.left.shortcut2.tooltip = "Spotify";
        menus.dashboard.shortcuts.left.shortcut3.command = "discord";
        menus.dashboard.shortcuts.left.shortcut3.icon = "";
        menus.dashboard.shortcuts.left.shortcut3.tooltip = "Discord";
        menus.dashboard.shortcuts.left.shortcut4.command = "rofi -show drun";
        menus.dashboard.shortcuts.left.shortcut4.icon = "";
        menus.dashboard.shortcuts.left.shortcut4.tooltip = "Search Apps";
        menus.dashboard.shortcuts.right.shortcut1.command = "sleep 0.5 && hyprpicker -a";
        menus.dashboard.shortcuts.right.shortcut1.icon = "";
        menus.dashboard.shortcuts.right.shortcut1.tooltip = "Color Picker";
        menus.dashboard.shortcuts.right.shortcut3.command = "bash -c \"${../scripts/snapshot.sh}\"";
        menus.dashboard.shortcuts.right.shortcut3.icon = "󰄀";
        menus.dashboard.shortcuts.right.shortcut3.tooltip = "Screenshot";
        menus.dashboard.stats.enable_gpu = false;
        menus.dashboard.stats.enabled = true;
        menus.dashboard.stats.interval = 2000;
        menus.media.displayTime = false;
        menus.media.displayTimeTooltip = false;
        menus.media.hideAlbum = false;
        menus.media.hideAuthor = false;
        menus.media.noMediaText = "No Media Currently Playing";
        menus.power.confirmation = true;
        menus.power.logout = "hyprctl dispatch exit";
        menus.power.lowBatteryNotification = false;
        menus.power.lowBatteryNotificationText = "Your battery is running low ($POWER_LEVEL %).\\n\\nPlease plug in your charger.";
        menus.power.lowBatteryNotificationTitle = "Warning: Low battery";
        menus.power.lowBatteryThreshold = 20;
        menus.power.reboot = "systemctl reboot";
        menus.power.showLabel = true;
        menus.power.shutdown = "systemctl poweroff";
        menus.power.sleep = "systemctl suspend";
        menus.transition = "crossfade";
        menus.transitionTime = 200;
        menus.volume.raiseMaximumVolume = false;
        notifications.active_monitor = true;
        notifications.cache_actions = true;
        notifications.clearDelay = 100;
        notifications.displayedTotal = 10;
        notifications.monitor = 0;
        notifications.position = "top right";
        notifications.showActionsOnHover = false;
        notifications.ignore = [ ];
        notifications.timeout = 7000;
        scalingPriority = "gdk";
        tear = false;
        terminal = "$TERM";
        theme.bar.border.location = "none";
        theme.bar.border.width = "0.15em";
        theme.bar.border_radius = "0.4em";
        theme.bar.buttons.background_hover_opacity = 100;
        theme.bar.buttons.background_opacity = 100;
        theme.bar.buttons.battery.enableBorder = false;
        theme.bar.buttons.battery.spacing = "0.5em";
        theme.bar.buttons.bluetooth.enableBorder = false;
        theme.bar.buttons.bluetooth.spacing = "0.5em";
        theme.bar.buttons.borderSize = "0.1em";
        theme.bar.buttons.clock.enableBorder = false;
        theme.bar.buttons.clock.spacing = "0.5em";
        theme.bar.buttons.dashboard.enableBorder = false;
        theme.bar.buttons.dashboard.spacing = "0.5em";
        theme.bar.buttons.enableBorders = false;
        theme.bar.buttons.innerRadiusMultiplier = "0.4";
        theme.bar.buttons.media.enableBorder = false;
        theme.bar.buttons.media.spacing = "0.5em";
        theme.bar.buttons.modules.cpu.enableBorder = false;
        theme.bar.buttons.modules.cpu.spacing = "0.5em";
        theme.bar.buttons.modules.cpuTemp.enableBorder = false;
        theme.bar.buttons.modules.cpuTemp.spacing = "0.5em";
        theme.bar.buttons.modules.hypridle.enableBorder = false;
        theme.bar.buttons.modules.hypridle.spacing = "0.45em";
        theme.bar.buttons.modules.hyprsunset.enableBorder = false;
        theme.bar.buttons.modules.hyprsunset.spacing = "0.45em";
        theme.bar.buttons.modules.kbLayout.enableBorder = false;
        theme.bar.buttons.modules.kbLayout.spacing = "0.45em";
        theme.bar.buttons.modules.netstat.enableBorder = false;
        theme.bar.buttons.modules.microphone.enableBorder = false;
        theme.bar.buttons.modules.microphone.spacing = "0.45em";
        theme.bar.buttons.modules.netstat.spacing = "0.45em";
        theme.bar.buttons.modules.power.enableBorder = false;
        theme.bar.buttons.modules.power.spacing = "0.45em";
        theme.bar.buttons.modules.ram.enableBorder = false;
        theme.bar.buttons.modules.ram.spacing = "0.45em";
        theme.bar.buttons.modules.storage.enableBorder = false;
        theme.bar.buttons.modules.storage.spacing = "0.45em";
        theme.bar.buttons.modules.submap.enableBorder = false;
        theme.bar.buttons.modules.submap.spacing = "0.45em";
        theme.bar.buttons.modules.updates.enableBorder = false;
        theme.bar.buttons.modules.updates.spacing = "0.45em";
        theme.bar.buttons.modules.weather.enableBorder = false;
        theme.bar.buttons.modules.weather.spacing = "0.45em";
        theme.bar.buttons.modules.worldclock.enableBorder = false;
        theme.bar.buttons.modules.worldclock.spacing = "0.45em";
        theme.bar.buttons.monochrome = false;
        theme.bar.buttons.network.enableBorder = false;
        theme.bar.buttons.network.spacing = "0.5em";
        theme.bar.buttons.notifications.enableBorder = false;
        theme.bar.buttons.notifications.spacing = "0.5em";
        theme.bar.buttons.opacity = 100;
        theme.bar.buttons.padding_x = "0.7rem";
        theme.bar.buttons.padding_y = "0.2rem";
        theme.bar.buttons.radius = "0.3em";
        theme.bar.buttons.spacing = "0.25em";
        theme.bar.buttons.style = "default";
        theme.bar.buttons.systray.enableBorder = false;
        theme.bar.buttons.systray.spacing = "0.5em";
        theme.bar.buttons.volume.enableBorder = false;
        theme.bar.buttons.volume.spacing = "0.5em";
        theme.bar.buttons.windowtitle.enableBorder = false;
        theme.bar.buttons.windowtitle.spacing = "0.5em";
        theme.bar.buttons.workspaces.enableBorder = false;
        theme.bar.buttons.workspaces.fontSize = "1.2em";
        theme.bar.buttons.workspaces.numbered_active_highlight_border = "0.2em";
        theme.bar.buttons.workspaces.numbered_active_highlight_padding = "0.2em";
        theme.bar.buttons.workspaces.numbered_inactive_padding = "0.2em";
        theme.bar.buttons.workspaces.pill.active_width = "12em";
        theme.bar.buttons.workspaces.pill.height = "4em";
        theme.bar.buttons.workspaces.pill.radius = "1.9rem * 0.6";
        theme.bar.buttons.workspaces.pill.width = "4em";
        theme.bar.buttons.workspaces.smartHighlight = true;
        theme.bar.buttons.workspaces.spacing = "0.5em";
        theme.bar.buttons.y_margins = "0.4em";
        theme.bar.dropdownGap = "2.9em";
        theme.bar.enableShadow = false;
        theme.bar.floating = false;
        theme.bar.label_spacing = "0.5em";
        theme.bar.layer = "top";
        theme.bar.location = "top";
        theme.bar.margin_bottom = "0em";
        theme.bar.margin_sides = "0.5em";
        theme.bar.margin_top = "0.5em";
        theme.bar.menus.border.radius = "0.7em";
        theme.bar.menus.border.size = "0.13em";
        theme.bar.menus.buttons.radius = "0.4em";
        theme.bar.menus.card_radius = "0.4em";
        theme.bar.menus.enableShadow = false;
        theme.bar.menus.menu.battery.scaling = 100;
        theme.bar.menus.menu.bluetooth.scaling = 100;
        theme.bar.menus.menu.clock.scaling = 100;
        theme.bar.menus.menu.dashboard.confirmation_scaling = 100;
        theme.bar.menus.menu.dashboard.profile.radius = "0.4em";
        theme.bar.menus.menu.dashboard.profile.size = "8.5em";
        theme.bar.menus.menu.dashboard.scaling = 100;
        theme.bar.menus.menu.media.card.tint = 85;
        theme.bar.menus.menu.media.scaling = 100;
        theme.bar.menus.menu.network.scaling = 100;
        theme.bar.menus.menu.notifications.height = "58em";
        theme.bar.menus.menu.notifications.pager.show = true;
        theme.bar.menus.menu.notifications.scaling = 100;
        theme.bar.menus.menu.notifications.scrollbar.radius = "0.2em";
        theme.bar.menus.menu.notifications.scrollbar.width = "0.35em";
        theme.bar.menus.menu.power.radius = "0.4em";
        theme.bar.menus.menu.power.scaling = 90;
        theme.bar.menus.menu.volume.scaling = 100;
        theme.bar.menus.monochrome = false;
        theme.bar.menus.opacity = 100;
        theme.bar.menus.popover.radius = "0.4em";
        theme.bar.menus.popover.scaling = 100;
        theme.bar.menus.progressbar.radius = "0.3rem";
        theme.bar.menus.scroller.radius = "0.7em";
        theme.bar.menus.scroller.width = "0.25em";
        theme.bar.menus.shadow = "0px 0px 3px 1px #16161e";
        theme.bar.menus.shadowMargins = "5px 5px";
        theme.bar.menus.slider.progress_radius = "0.3rem";
        theme.bar.menus.slider.slider_radius = "0.3rem";
        theme.bar.menus.switch.radius = "0.2em";
        theme.bar.menus.switch.slider_radius = "0.2em";
        theme.bar.menus.tooltip.radius = "0.3em";
        theme.bar.opacity = 100;
        theme.bar.outer_spacing = "1.6em";
        theme.bar.scaling = 100;
        theme.bar.shadow = "0px 1px 2px 1px #16161e";
        theme.bar.shadowMargins = "0px 0px 4px 0px";
        theme.bar.transparent = false;
        theme.font.name = "Ubuntu Nerd Font";
        theme.font.size = "1.2rem";
        theme.font.weight = 600;
        theme.matugen = false;
        theme.matugen_settings.contrast = 0;
        theme.matugen_settings.mode = "dark";
        theme.matugen_settings.scheme_type = "tonal-spot";
        theme.matugen_settings.variation = "standard_1";
        theme.name = "";
        theme.notification.border_radius = "0.6em";
        theme.notification.enableShadow = false;
        theme.notification.opacity = 100;
        theme.notification.scaling = 100;
        theme.notification.shadow = "0px 1px 2px 1px #16161e";
        theme.notification.shadowMargins = "4px 4px";
        theme.osd.active_monitor = true;
        theme.osd.duration = 2500;
        theme.osd.enable = true;
        theme.osd.enableShadow = false;
        theme.osd.location = "right";
        theme.osd.margins = "0px 5px 0px 0px";
        theme.osd.monitor = 0;
        theme.osd.muted_zero = false;
        theme.osd.opacity = 100;
        theme.osd.orientation = "vertical";
        theme.osd.radius = "0.4em";
        theme.osd.border.size = "0em";
        theme.osd.scaling = 100;
        theme.osd.shadow = "0px 0px 3px 2px #16161e";
        theme.tooltip.scaling = 100;
        wallpaper.enable = true;
        wallpaper.image = "";
        wallpaper.pywal = false;
      };
      type = types.attrsOf types.anything;
    };
  };

  config =
    let

      theme =
        if cfg.settings.theme.name != "" then
          builtins.fromJSON (builtins.readFile ../themes/${cfg.settings.theme.name}.json)
        else
          { };

      fullSet =
        if cfg.settings.theme.name != "" then
          lib.attrsets.recursiveUpdate theme cfg.settings
        else
          cfg.settings;

      finalConfig = builtins.toJSON fullSet;

      hyprpanel-diff = pkgs.writeShellApplication {
        runtimeInputs = [ pkgs.colordiff ];
        name = "hyprpanel-diff";
        text = ''
          cd
          echo '------------- HyprPanel -------------'
          echo 'Please ignore the layout diff for now'
          echo '-------------------------------------'
          colordiff ${config.xdg.configFile.hyprpanel.target} \
                    ${config.xdg.configFile.hyprpanel-swap.target}
        '';
      };

    in
    mkIf cfg.enable {

      # nixpkgs.overlays = if cfg.overlay.enable then [ self.overlay ] else null;
      nixpkgs.overlays = lib.mkIf cfg.overlay.enable [ self.overlay ];

      home.packages = [
        package
        hyprpanel-diff
        (
          if pkgs ? nerd-fonts.jetbrains-mono then
            pkgs.nerd-fonts.jetbrains-mono
          # NOTE:(benvonh) Remove after next release 25.05
          else
            pkgs.nerdfonts.override { fonts = [ "JetBrainsMono" ]; }
        )
      ];

      home.activation =
        let
          path = "${config.xdg.configFile.hyprpanel.target}";
        in
        mkIf cfg.overwrite.enable {
          hyprpanel = lib.hm.dag.entryBefore [ "writeBoundary" ] ''
            [[ -L "${path}" ]] || rm -f "${path}"
          '';
        };

      xdg.configFile.hyprpanel = mkIf cfg.config.enable {
        target = "hyprpanel/config.json";
        text = finalConfig;
        # onChange = "${pkgs.procps}/bin/pkill -u $USER -USR1 hyprpanel || true";
        onChange = "${package}/bin/hyprpanel r";
      };

      xdg.configFile.hyprpanel-swap = mkIf cfg.config.enable {
        target = "hyprpanel/config.hm.json";
        text = finalConfig;
      };

      systemd.user.services = mkIf cfg.systemd.enable {
        hyprpanel = {
          Unit = {
            Description = "A Bar/Panel for Hyprland with extensive customizability.";
            Documentation = "https://hyprpanel.com";
            PartOf = [ "graphical-session.target" ];
            After = [ "graphical-session-pre.target" ];
          };
          Service = {
            ExecStart = "${package}/bin/hyprpanel";
            ExecReload = "${pkgs.coreutils}/bin/kill -SIGUSR1 $MAINPID";
            Restart = "on-failure";
            KillMode = "mixed";
          };
          Install = {
            WantedBy = [ "graphical-session.target" ];
          };
        };
      };

      wayland.windowManager.hyprland.settings.exec-once = mkIf cfg.hyprland.enable [
        "${package}/bin/hyprpanel"
      ];
    };
}
