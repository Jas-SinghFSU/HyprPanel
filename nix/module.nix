self: { lib, pkgs, config, ... }:
let
  inherit (lib) types mkIf mkOption mkEnableOption;

  cfg = config.programs.hyprpanel;

  jsonFormat = pkgs.formats.json { };
  
  # No package option
  package = if pkgs ? hyprpanel then pkgs.hyprpanel
  else abort ''

  ********************************************************************************
  *                                  HyprPanel                                   *
  *------------------------------------------------------------------------------*
  *                         You didn't add the overlay!                          *
  *                                                                              *
  * Either set 'overlay.enable = true' or manually add it to 'nixpkgs.overlays'. *
  * If you use the 'nixosModule' for Home Manager and have 'useGlobalPkgs' set,  *
  *                  you will need to add the overlay yourself.                  *
  ********************************************************************************
  '';

  # Shorthand lambda for self-documenting options under settings
  mkStrOption = default: mkOption { type = types.str; default = default; };
  mkIntOption = default: mkOption { type = types.int; default = default; };
  mkBoolOption = default: mkOption { type = types.bool; default = default; };
  mkStrListOption = default: mkOption { type = types.listOf types.str; default = default; };
  mkFloatOption = default: mkOption { type = types.float; default = default; };

  # TODO: Please merge https://github.com/Jas-SinghFSU/HyprPanel/pull/497
  #       Do not ask what these do...
  flattenAttrs = attrSet: prefix:
    let
      process = key: value:
        if builtins.isAttrs value then
          flattenAttrs value "${prefix}${key}."
        else
          { "${prefix}${key}" = value; };
    in
      builtins.foldl' (acc: key:
        acc // process key attrSet.${key}
      ) {} (builtins.attrNames attrSet);

  toNestedValue =
    let
      escapeString = s: builtins.replaceStrings [ "\"" ] [ "\\\"" ] s;
    in
    value:
      if builtins.isBool value then
        if value then "true" else "false"
      else if (builtins.isInt value || builtins.isFloat value) then
        builtins.toString value
      else if builtins.isString value then
        "\"" + escapeString value + "\""
      else if builtins.isList value then
        let
          items = builtins.map toNestedValue value;
        in
          "[\n" + (builtins.concatStringsSep ", " items) + "\n]"
      else if builtins.isAttrs value then
        let
          keys = builtins.attrNames value;
          toKeyValue = k: "\"${k}\": ${toNestedValue value.${k}}";
          inner = builtins.concatStringsSep ", " (builtins.map toKeyValue keys);
        in
          "{\n" + inner + "\n}"
      else
        abort "Unexpected error! Please post a new issue and @benvonh...";

  toNestedObject = attrSet:
    let
      keys = builtins.attrNames attrSet;
      kvPairs = builtins.map (k: "\"${k}\": ${toNestedValue attrSet.${k}}") keys;
    in
      "{\n  " + builtins.concatStringsSep ",\n  " kvPairs + "\n}";
in
{
  options.programs.hyprpanel = {
    enable = mkEnableOption "HyprPanel";
    config.enable = mkBoolOption true; # Generate config
    overlay.enable = mkEnableOption "script overlay";
    systemd.enable = mkEnableOption "systemd integration";
    hyprland.enable = mkEnableOption "Hyprland integration";
    overwrite.enable = mkEnableOption "overwrite config fix";
    
    theme = mkOption {
      type = types.str;
      default = "";
      example = "catppuccin_mocha";
      description = "Theme to import (see ../themes/*.json)";
    };

    override = mkOption {
      type = types.attrs;
      default = {};
      example = ''
        {
          theme.bar.menus.text = "#123ABC";
        }
      '';
      description = ''
        An arbitrary set to override the final config with.
        Useful for overriding colors in your chosen theme.
      '';
    };

    layout = mkOption {
      type = jsonFormat.type;
      default = null;
      example = ''
        {
          "bar.layouts" = {
            "0" = {
              left = [ "dashboard" "workspaces" "windowtitle" ];
              middle = [ "media" ];
              right = [ "volume" "network" "bluetooth" "battery" "systray" "clock" "notifications" ];
            };
            "1" = {
              left = [ "dashboard" "workspaces" "windowtitle" ];
              middle = [ "media" ];
              right = [ "volume" "clock" "notifications" ];
            };
            "2" = {
              left = [ "dashboard" "workspaces" "windowtitle" ];
              middle = [ "media" ];
              right = [ "volume" "clock" "notifications" ];
            };
          };
        };
      '';
      description = "https://hyprpanel.com/configuration/panel.html";
    };

    settings = {
      bar.autoHide = mkStrOption "never";
      bar.battery.hideLabelWhenFull = mkBoolOption false;
      bar.battery.label = mkBoolOption true;
      bar.battery.middleClick = mkStrOption "";
      bar.battery.rightClick = mkStrOption "";
      bar.battery.scrollDown = mkStrOption "";
      bar.battery.scrollUp = mkStrOption "";
      bar.bluetooth.label = mkBoolOption true;
      bar.bluetooth.middleClick = mkStrOption "";
      bar.bluetooth.rightClick = mkStrOption "";
      bar.bluetooth.scrollDown = mkStrOption "";
      bar.bluetooth.scrollUp = mkStrOption "";
      bar.clock.format = mkStrOption "%a %b %d  %I:%M:%S %p";
      bar.clock.icon = mkStrOption "󰸗";
      bar.clock.middleClick = mkStrOption "";
      bar.clock.rightClick = mkStrOption "";
      bar.clock.scrollDown = mkStrOption "";
      bar.clock.scrollUp = mkStrOption "";
      bar.clock.showIcon = mkBoolOption true;
      bar.clock.showTime = mkBoolOption true;
      bar.customModules.cava.showIcon = mkBoolOption true;
      bar.customModules.cava.icon = mkStrOption "";
      bar.customModules.cava.spaceCharacter = mkStrOption " ";
      bar.customModules.cava.barCharacters = mkStrListOption [ "▁" "▂" "▃" "▄" "▅" "▆" "▇" "█" ];
      bar.customModules.cava.showActiveOnly = mkBoolOption false;
      bar.customModules.cava.bars = mkIntOption 10;
      bar.customModules.cava.channels = mkIntOption 2;
      bar.customModules.cava.framerate = mkIntOption 60;
      bar.customModules.cava.samplerate = mkIntOption 44100;
      bar.customModules.cava.autoSensitivity = mkBoolOption true;
      bar.customModules.cava.lowCutoff = mkIntOption 50;
      bar.customModules.cava.highCutoff = mkIntOption 10000;
      bar.customModules.cava.noiseReduction = mkFloatOption 0.77;
      bar.customModules.cava.stereo = mkBoolOption false;
      bar.customModules.cava.leftClick = mkStrOption "";
      bar.customModules.cava.rightClick = mkStrOption "";
      bar.customModules.cava.middleClick = mkStrOption "";
      bar.customModules.cava.scrollUp = mkStrOption "";
      bar.customModules.cava.scrollDown = mkStrOption "";
      bar.customModules.cpu.icon = mkStrOption "";
      bar.customModules.cpu.label = mkBoolOption true;
      bar.customModules.cpu.leftClick = mkStrOption "";
      bar.customModules.cpu.middleClick = mkStrOption "";
      bar.customModules.cpu.pollingInterval = mkIntOption 2000;
      bar.customModules.cpu.rightClick = mkStrOption "";
      bar.customModules.cpu.round = mkBoolOption true;
      bar.customModules.cpu.scrollDown = mkStrOption "";
      bar.customModules.cpu.scrollUp = mkStrOption "";
      bar.customModules.cpuTemp.icon = mkStrOption "";
      bar.customModules.cpuTemp.label = mkBoolOption true;
      bar.customModules.cpuTemp.leftClick = mkStrOption "";
      bar.customModules.cpuTemp.middleClick = mkStrOption "";
      bar.customModules.cpuTemp.pollingInterval = mkIntOption 2000;
      bar.customModules.cpuTemp.rightClick = mkStrOption "";
      bar.customModules.cpuTemp.round = mkBoolOption true;
      bar.customModules.cpuTemp.scrollDown = mkStrOption "";
      bar.customModules.cpuTemp.scrollUp = mkStrOption "";
      bar.customModules.cpuTemp.sensor = mkStrOption "";
      bar.customModules.cpuTemp.showUnit = mkBoolOption true;
      bar.customModules.cpuTemp.unit = mkStrOption "metric";
      bar.customModules.hypridle.label = mkBoolOption true;
      bar.customModules.hypridle.middleClick = mkStrOption "";
      bar.customModules.hypridle.offIcon = mkStrOption "";
      bar.customModules.hypridle.offLabel = mkStrOption "Off";
      bar.customModules.hypridle.onIcon = mkStrOption "";
      bar.customModules.hypridle.onLabel = mkStrOption "On";
      bar.customModules.hypridle.pollingInterval = mkIntOption 2000;
      bar.customModules.hypridle.rightClick = mkStrOption "";
      bar.customModules.hypridle.scrollDown = mkStrOption "";
      bar.customModules.hypridle.scrollUp = mkStrOption "";
      bar.customModules.hyprsunset.label = mkBoolOption true;
      bar.customModules.hyprsunset.middleClick = mkStrOption "";
      bar.customModules.hyprsunset.offIcon = mkStrOption "󰛨";
      bar.customModules.hyprsunset.offLabel = mkStrOption "Off";
      bar.customModules.hyprsunset.onIcon = mkStrOption "󱩌";
      bar.customModules.hyprsunset.onLabel = mkStrOption "On";
      bar.customModules.hyprsunset.pollingInterval = mkIntOption 2000;
      bar.customModules.hyprsunset.rightClick = mkStrOption "";
      bar.customModules.hyprsunset.scrollDown = mkStrOption "";
      bar.customModules.hyprsunset.scrollUp = mkStrOption "";
      bar.customModules.hyprsunset.temperature = mkStrOption "6000k";
      bar.customModules.kbLayout.icon = mkStrOption "󰌌";
      bar.customModules.kbLayout.label = mkBoolOption true;
      bar.customModules.kbLayout.labelType = mkStrOption "code";
      bar.customModules.kbLayout.leftClick = mkStrOption "";
      bar.customModules.kbLayout.middleClick = mkStrOption "";
      bar.customModules.kbLayout.rightClick = mkStrOption "";
      bar.customModules.kbLayout.scrollDown = mkStrOption "";
      bar.customModules.kbLayout.scrollUp = mkStrOption "";
      bar.customModules.netstat.dynamicIcon = mkBoolOption false;
      bar.customModules.netstat.icon = mkStrOption "󰖟";
      bar.customModules.netstat.label = mkBoolOption true;
      bar.customModules.netstat.labelType = mkStrOption "full";
      bar.customModules.netstat.leftClick = mkStrOption "";
      bar.customModules.netstat.middleClick = mkStrOption "";
      bar.customModules.netstat.networkInLabel = mkStrOption "↓";
      bar.customModules.netstat.networkInterface = mkStrOption "";
      bar.customModules.netstat.networkOutLabel = mkStrOption "↑";
      bar.customModules.netstat.pollingInterval = mkIntOption 2000;
      bar.customModules.netstat.rateUnit = mkStrOption "auto";
      bar.customModules.netstat.rightClick = mkStrOption "";
      bar.customModules.netstat.round = mkBoolOption true;
      bar.customModules.power.icon = mkStrOption "";
      bar.customModules.power.leftClick = mkStrOption "menu:powerdropdown";
      bar.customModules.power.middleClick = mkStrOption "";
      bar.customModules.power.rightClick = mkStrOption "";
      bar.customModules.power.scrollDown = mkStrOption "";
      bar.customModules.power.scrollUp = mkStrOption "";
      bar.customModules.power.showLabel = mkBoolOption true;
      bar.customModules.microphone.label = mkBoolOption true;
      bar.customModules.microphone.mutedIcon = mkStrOption "󰍭";
      bar.customModules.microphone.unmutedIcon = mkStrOption "󰍬";
      bar.customModules.microphone.leftClick = mkStrOption "menu:audio";
      bar.customModules.microphone.rightClick = mkStrOption "";
      bar.customModules.microphone.middleClick = mkStrOption "";
      bar.customModules.microphone.scrollUp = mkStrOption "";
      bar.customModules.microphone.scrollDown = mkStrOption "";
      bar.customModules.ram.icon = mkStrOption "";
      bar.customModules.ram.label = mkBoolOption true;
      bar.customModules.ram.labelType = mkStrOption "percentage";
      bar.customModules.ram.leftClick = mkStrOption "";
      bar.customModules.ram.middleClick = mkStrOption "";
      bar.customModules.ram.pollingInterval = mkIntOption 2000;
      bar.customModules.ram.rightClick = mkStrOption "";
      bar.customModules.ram.round = mkBoolOption true;
      bar.customModules.scrollSpeed = mkIntOption 5;
      bar.customModules.storage.icon = mkStrOption "󰋊";
      bar.customModules.storage.label = mkBoolOption true;
      bar.customModules.storage.labelType = mkStrOption "percentage";
      bar.customModules.storage.leftClick = mkStrOption "";
      bar.customModules.storage.middleClick = mkStrOption "";
      bar.customModules.storage.pollingInterval = mkIntOption 2000;
      bar.customModules.storage.rightClick = mkStrOption "";
      bar.customModules.storage.round = mkBoolOption false;
      bar.customModules.submap.disabledIcon = mkStrOption "󰌌";
      bar.customModules.submap.disabledText = mkStrOption "Submap off";
      bar.customModules.submap.enabledIcon = mkStrOption "󰌐";
      bar.customModules.submap.enabledText = mkStrOption "Submap On";
      bar.customModules.submap.label = mkBoolOption true;
      bar.customModules.submap.leftClick = mkStrOption "";
      bar.customModules.submap.middleClick = mkStrOption "";
      bar.customModules.submap.rightClick = mkStrOption "";
      bar.customModules.submap.scrollDown = mkStrOption "";
      bar.customModules.submap.scrollUp = mkStrOption "";
      bar.customModules.submap.showSubmapName = mkBoolOption true;
      bar.customModules.updates.autoHide = mkBoolOption false;
      bar.customModules.updates.icon.pending = mkStrOption "󰏗";
      bar.customModules.updates.icon.updated = mkStrOption "󰏖";
      bar.customModules.updates.label = mkBoolOption true;
      bar.customModules.updates.leftClick = mkStrOption "";
      bar.customModules.updates.middleClick = mkStrOption "";
      bar.customModules.updates.padZero = mkBoolOption true;
      bar.customModules.updates.pollingInterval = mkIntOption 1440000;
      bar.customModules.updates.rightClick = mkStrOption "";
      bar.customModules.updates.scrollDown = mkStrOption "";
      bar.customModules.updates.scrollUp = mkStrOption "";
      bar.customModules.updates.updateCommand = mkStrOption "";
      bar.customModules.weather.label = mkBoolOption true;
      bar.customModules.weather.leftClick = mkStrOption "";
      bar.customModules.weather.middleClick = mkStrOption "";
      bar.customModules.weather.rightClick = mkStrOption "";
      bar.customModules.weather.scrollDown = mkStrOption "";
      bar.customModules.weather.scrollUp = mkStrOption "";
      bar.customModules.weather.unit = mkStrOption "imperial";
      bar.launcher.autoDetectIcon = mkBoolOption false;
      bar.launcher.icon = mkStrOption "󰣇";
      bar.launcher.middleClick = mkStrOption "";
      bar.launcher.rightClick = mkStrOption "";
      bar.launcher.scrollDown = mkStrOption "";
      bar.launcher.scrollUp = mkStrOption "";
      bar.media.format = mkStrOption "{artist: - }{title}";
      bar.media.middleClick = mkStrOption "";
      bar.media.rightClick = mkStrOption "";
      bar.media.scrollDown = mkStrOption "";
      bar.media.scrollUp = mkStrOption "";
      bar.media.show_active_only = mkBoolOption false;
      bar.media.show_label = mkBoolOption true;
      bar.media.truncation = mkBoolOption true;
      bar.media.truncation_size = mkIntOption 30;
      bar.network.label = mkBoolOption true;
      bar.network.middleClick = mkStrOption "";
      bar.network.rightClick = mkStrOption "";
      bar.network.scrollDown = mkStrOption "";
      bar.network.scrollUp = mkStrOption "";
      bar.network.showWifiInfo = mkBoolOption false;
      bar.network.truncation = mkBoolOption true;
      bar.network.truncation_size = mkIntOption 7;
      bar.notifications.hideCountWhenZero = mkBoolOption false;
      bar.notifications.middleClick = mkStrOption "";
      bar.notifications.rightClick = mkStrOption "";
      bar.notifications.scrollDown = mkStrOption "";
      bar.notifications.scrollUp = mkStrOption "";
      bar.notifications.show_total = mkBoolOption false;
      bar.scrollSpeed = mkIntOption 5;
      bar.volume.label = mkBoolOption true;
      bar.volume.middleClick = mkStrOption "";
      bar.volume.rightClick = mkStrOption "";
      bar.volume.scrollDown = mkStrOption "${package}/bin/hyprpanel 'vol -5'";
      bar.volume.scrollUp = mkStrOption "${package}/bin/hyprpanel 'vol +5'";
      bar.windowtitle.class_name = mkBoolOption true;
      bar.windowtitle.custom_title = mkBoolOption true;
      bar.windowtitle.icon = mkBoolOption true;
      bar.windowtitle.label = mkBoolOption true;
      bar.windowtitle.leftClick = mkStrOption "";
      bar.windowtitle.middleClick = mkStrOption "";
      bar.windowtitle.rightClick = mkStrOption "";
      bar.windowtitle.scrollDown = mkStrOption "";
      bar.windowtitle.scrollUp = mkStrOption "";
      bar.windowtitle.truncation = mkBoolOption true;
      bar.windowtitle.truncation_size = mkIntOption 50;
      bar.workspaces.applicationIconEmptyWorkspace = mkStrOption "";
      bar.workspaces.applicationIconFallback = mkStrOption "󰣆";
      bar.workspaces.applicationIconOncePerWorkspace = mkBoolOption true;
      bar.workspaces.icons.active = mkStrOption "";
      bar.workspaces.icons.available = mkStrOption "";
      bar.workspaces.icons.occupied = mkStrOption "";
      bar.workspaces.ignored = mkStrOption "";
      bar.workspaces.monitorSpecific = mkBoolOption true;
      bar.workspaces.numbered_active_indicator = mkStrOption "underline";
      bar.workspaces.reverse_scroll = mkBoolOption false;
      bar.workspaces.scroll_speed = mkIntOption 5;
      bar.workspaces.showAllActive = mkBoolOption true;
      bar.workspaces.showApplicationIcons = mkBoolOption false;
      bar.workspaces.showWsIcons = mkBoolOption false;
      bar.workspaces.show_icons = mkBoolOption false;
      bar.workspaces.show_numbered = mkBoolOption false;
      bar.workspaces.spacing = mkFloatOption 1.0;
      bar.workspaces.workspaceMask = mkBoolOption false;
      bar.workspaces.workspaces = mkIntOption 5;
      dummy = mkBoolOption true;
      hyprpanel.restartAgs = mkBoolOption true;
      # hyprpanel.restartCommand = mkStrOption "${pkgs.procps}/bin/pkill -u $USER -USR1 hyprpanel; ${package}/bin/hyprpanel";
      hyprpanel.restartCommand = mkStrOption "${package}/bin/hyprpanel q; ${package}/bin/hyprpanel";
      menus.clock.time.hideSeconds = mkBoolOption false;
      menus.clock.time.military = mkBoolOption false;
      menus.clock.weather.enabled = mkBoolOption true;
      menus.clock.weather.interval = mkIntOption 60000;
      menus.clock.weather.key = mkStrOption "";
      menus.clock.weather.location = mkStrOption "Los Angeles";
      menus.clock.weather.unit = mkStrOption "imperial";
      menus.dashboard.controls.enabled = mkBoolOption true;
      menus.dashboard.directories.enabled = mkBoolOption true;
      menus.dashboard.directories.left.directory1.command = mkStrOption "bash -c \"xdg-open $HOME/Downloads/\"";
      menus.dashboard.directories.left.directory1.label = mkStrOption "󰉍 Downloads";
      menus.dashboard.directories.left.directory2.command = mkStrOption "bash -c \"xdg-open $HOME/Videos/\"";
      menus.dashboard.directories.left.directory2.label = mkStrOption "󰉏 Videos";
      menus.dashboard.directories.left.directory3.command = mkStrOption "bash -c \"xdg-open $HOME/Projects/\"";
      menus.dashboard.directories.left.directory3.label = mkStrOption "󰚝 Projects";
      menus.dashboard.directories.right.directory1.command = mkStrOption "bash -c \"xdg-open $HOME/Documents/\"";
      menus.dashboard.directories.right.directory1.label = mkStrOption "󱧶 Documents";
      menus.dashboard.directories.right.directory2.command = mkStrOption "bash -c \"xdg-open $HOME/Pictures/\"";
      menus.dashboard.directories.right.directory2.label = mkStrOption "󰉏 Pictures";
      menus.dashboard.directories.right.directory3.command = mkStrOption "bash -c \"xdg-open $HOME/\"";
      menus.dashboard.directories.right.directory3.label = mkStrOption "󱂵 Home";
      menus.dashboard.powermenu.avatar.image = mkStrOption "$HOME/.face.icon";
      menus.dashboard.powermenu.avatar.name = mkStrOption "system";
      menus.dashboard.powermenu.confirmation = mkBoolOption true;
      menus.dashboard.powermenu.logout = mkStrOption "hyprctl dispatch exit";
      menus.dashboard.powermenu.reboot = mkStrOption "systemctl reboot";
      menus.dashboard.powermenu.shutdown = mkStrOption "systemctl poweroff";
      menus.dashboard.powermenu.sleep = mkStrOption "systemctl suspend";
      menus.dashboard.shortcuts.enabled = mkBoolOption true;
      menus.dashboard.shortcuts.left.shortcut1.command = mkStrOption "microsoft-edge-stable";
      menus.dashboard.shortcuts.left.shortcut1.icon = mkStrOption "󰇩";
      menus.dashboard.shortcuts.left.shortcut1.tooltip = mkStrOption "Microsoft Edge";
      menus.dashboard.shortcuts.left.shortcut2.command = mkStrOption "spotify-launcher";
      menus.dashboard.shortcuts.left.shortcut2.icon = mkStrOption "";
      menus.dashboard.shortcuts.left.shortcut2.tooltip = mkStrOption "Spotify";
      menus.dashboard.shortcuts.left.shortcut3.command = mkStrOption "discord";
      menus.dashboard.shortcuts.left.shortcut3.icon = mkStrOption "";
      menus.dashboard.shortcuts.left.shortcut3.tooltip = mkStrOption "Discord";
      menus.dashboard.shortcuts.left.shortcut4.command = mkStrOption "rofi -show drun";
      menus.dashboard.shortcuts.left.shortcut4.icon = mkStrOption "";
      menus.dashboard.shortcuts.left.shortcut4.tooltip = mkStrOption "Search Apps";
      menus.dashboard.shortcuts.right.shortcut1.command = mkStrOption "sleep 0.5 && hyprpicker -a";
      menus.dashboard.shortcuts.right.shortcut1.icon = mkStrOption "";
      menus.dashboard.shortcuts.right.shortcut1.tooltip = mkStrOption "Color Picker";
      menus.dashboard.shortcuts.right.shortcut3.command = mkStrOption "bash -c \"${../scripts/snapshot.sh}\"";
      menus.dashboard.shortcuts.right.shortcut3.icon = mkStrOption "󰄀";
      menus.dashboard.shortcuts.right.shortcut3.tooltip = mkStrOption "Screenshot";
      menus.dashboard.stats.enable_gpu = mkBoolOption false;
      menus.dashboard.stats.enabled = mkBoolOption true;
      menus.dashboard.stats.interval = mkIntOption 2000;
      menus.media.displayTime = mkBoolOption false;
      menus.media.displayTimeTooltip = mkBoolOption false;
      menus.media.hideAlbum = mkBoolOption false;
      menus.media.hideAuthor = mkBoolOption false;
      menus.media.noMediaText = mkStrOption "No Media Currently Playing";
      menus.power.confirmation = mkBoolOption true;
      menus.power.logout = mkStrOption "hyprctl dispatch exit";
      menus.power.lowBatteryNotification = mkBoolOption false;
      menus.power.lowBatteryNotificationText = mkStrOption "Your battery is running low ($POWER_LEVEL %).\\n\\nPlease plug in your charger.";
      menus.power.lowBatteryNotificationTitle = mkStrOption "Warning: Low battery";
      menus.power.lowBatteryThreshold = mkIntOption 20;
      menus.power.reboot = mkStrOption "systemctl reboot";
      menus.power.showLabel = mkBoolOption true;
      menus.power.shutdown = mkStrOption "systemctl poweroff";
      menus.power.sleep = mkStrOption "systemctl suspend";
      menus.transition = mkStrOption "crossfade";
      menus.transitionTime = mkIntOption 200;
      menus.volume.raiseMaximumVolume = mkBoolOption false;
      notifications.active_monitor = mkBoolOption true;
      notifications.cache_actions = mkBoolOption true;
      notifications.clearDelay = mkIntOption 100;
      notifications.displayedTotal = mkIntOption 10;
      notifications.monitor = mkIntOption 0;
      notifications.position = mkStrOption "top right";
      notifications.showActionsOnHover = mkBoolOption false;
      notifications.timeout = mkIntOption 7000;
      scalingPriority = mkStrOption "gdk";
      tear = mkBoolOption false;
      terminal = mkStrOption "$TERM";
      theme.bar.border.location = mkStrOption "none";
      theme.bar.border.width = mkStrOption "0.15em";
      theme.bar.border_radius = mkStrOption "0.4em";
      theme.bar.buttons.background_hover_opacity = mkIntOption 100;
      theme.bar.buttons.background_opacity = mkIntOption 100;
      theme.bar.buttons.battery.enableBorder = mkBoolOption false;
      theme.bar.buttons.battery.spacing = mkStrOption "0.5em";
      theme.bar.buttons.bluetooth.enableBorder = mkBoolOption false;
      theme.bar.buttons.bluetooth.spacing = mkStrOption "0.5em";
      theme.bar.buttons.borderSize = mkStrOption "0.1em";
      theme.bar.buttons.clock.enableBorder = mkBoolOption false;
      theme.bar.buttons.clock.spacing = mkStrOption "0.5em";
      theme.bar.buttons.dashboard.enableBorder = mkBoolOption false;
      theme.bar.buttons.dashboard.spacing = mkStrOption "0.5em";
      theme.bar.buttons.enableBorders = mkBoolOption false;
      theme.bar.buttons.innerRadiusMultiplier = mkStrOption "0.4";
      theme.bar.buttons.media.enableBorder = mkBoolOption false;
      theme.bar.buttons.media.spacing = mkStrOption "0.5em";
      theme.bar.buttons.modules.cpu.enableBorder = mkBoolOption false;
      theme.bar.buttons.modules.cpu.spacing = mkStrOption "0.5em";
      theme.bar.buttons.modules.cpuTemp.enableBorder = mkBoolOption false;
      theme.bar.buttons.modules.cpuTemp.spacing = mkStrOption "0.5em";
      theme.bar.buttons.modules.hypridle.enableBorder = mkBoolOption false;
      theme.bar.buttons.modules.hypridle.spacing = mkStrOption "0.45em";
      theme.bar.buttons.modules.hyprsunset.enableBorder = mkBoolOption false;
      theme.bar.buttons.modules.hyprsunset.spacing = mkStrOption "0.45em";
      theme.bar.buttons.modules.kbLayout.enableBorder = mkBoolOption false;
      theme.bar.buttons.modules.kbLayout.spacing = mkStrOption "0.45em";
      theme.bar.buttons.modules.netstat.enableBorder = mkBoolOption false;
      theme.bar.buttons.modules.microphone.enableBorder = mkBoolOption false;
      theme.bar.buttons.modules.microphone.spacing = mkStrOption "0.45em";
      theme.bar.buttons.modules.netstat.spacing = mkStrOption "0.45em";
      theme.bar.buttons.modules.power.enableBorder = mkBoolOption false;
      theme.bar.buttons.modules.power.spacing = mkStrOption "0.45em";
      theme.bar.buttons.modules.ram.enableBorder = mkBoolOption false;
      theme.bar.buttons.modules.ram.spacing = mkStrOption "0.45em";
      theme.bar.buttons.modules.storage.enableBorder = mkBoolOption false;
      theme.bar.buttons.modules.storage.spacing = mkStrOption "0.45em";
      theme.bar.buttons.modules.submap.enableBorder = mkBoolOption false;
      theme.bar.buttons.modules.submap.spacing = mkStrOption "0.45em";
      theme.bar.buttons.modules.updates.enableBorder = mkBoolOption false;
      theme.bar.buttons.modules.updates.spacing = mkStrOption "0.45em";
      theme.bar.buttons.modules.weather.enableBorder = mkBoolOption false;
      theme.bar.buttons.modules.weather.spacing = mkStrOption "0.45em";
      theme.bar.buttons.monochrome = mkBoolOption false;
      theme.bar.buttons.network.enableBorder = mkBoolOption false;
      theme.bar.buttons.network.spacing = mkStrOption "0.5em";
      theme.bar.buttons.notifications.enableBorder = mkBoolOption false;
      theme.bar.buttons.notifications.spacing = mkStrOption "0.5em";
      theme.bar.buttons.opacity = mkIntOption 100;
      theme.bar.buttons.padding_x = mkStrOption "0.7rem";
      theme.bar.buttons.padding_y = mkStrOption "0.2rem";
      theme.bar.buttons.radius = mkStrOption "0.3em";
      theme.bar.buttons.spacing = mkStrOption "0.25em";
      theme.bar.buttons.style = mkStrOption "default";
      theme.bar.buttons.systray.enableBorder = mkBoolOption false;
      theme.bar.buttons.systray.spacing = mkStrOption "0.5em";
      theme.bar.buttons.volume.enableBorder = mkBoolOption false;
      theme.bar.buttons.volume.spacing = mkStrOption "0.5em";
      theme.bar.buttons.windowtitle.enableBorder = mkBoolOption false;
      theme.bar.buttons.windowtitle.spacing = mkStrOption "0.5em";
      theme.bar.buttons.workspaces.enableBorder = mkBoolOption false;
      theme.bar.buttons.workspaces.fontSize = mkStrOption "1.2em";
      theme.bar.buttons.workspaces.numbered_active_highlight_border = mkStrOption "0.2em";
      theme.bar.buttons.workspaces.numbered_active_highlight_padding = mkStrOption "0.2em";
      theme.bar.buttons.workspaces.numbered_inactive_padding = mkStrOption "0.2em";
      theme.bar.buttons.workspaces.pill.active_width = mkStrOption "12em";
      theme.bar.buttons.workspaces.pill.height = mkStrOption "4em";
      theme.bar.buttons.workspaces.pill.radius = mkStrOption "1.9rem * 0.6";
      theme.bar.buttons.workspaces.pill.width = mkStrOption "4em";
      theme.bar.buttons.workspaces.smartHighlight = mkBoolOption true;
      theme.bar.buttons.workspaces.spacing = mkStrOption "0.5em";
      theme.bar.buttons.y_margins = mkStrOption "0.4em";
      theme.bar.dropdownGap = mkStrOption "2.9em";
      theme.bar.enableShadow = mkBoolOption false;
      theme.bar.floating = mkBoolOption false;
      theme.bar.label_spacing = mkStrOption "0.5em";
      theme.bar.layer = mkStrOption "top";
      theme.bar.location = mkStrOption "top";
      theme.bar.margin_bottom = mkStrOption "0em";
      theme.bar.margin_sides = mkStrOption "0.5em";
      theme.bar.margin_top = mkStrOption "0.5em";
      theme.bar.menus.border.radius = mkStrOption "0.7em";
      theme.bar.menus.border.size = mkStrOption "0.13em";
      theme.bar.menus.buttons.radius = mkStrOption "0.4em";
      theme.bar.menus.card_radius = mkStrOption "0.4em";
      theme.bar.menus.enableShadow = mkBoolOption false;
      theme.bar.menus.menu.battery.scaling = mkIntOption 100;
      theme.bar.menus.menu.bluetooth.scaling = mkIntOption 100;
      theme.bar.menus.menu.clock.scaling = mkIntOption 100;
      theme.bar.menus.menu.dashboard.confirmation_scaling = mkIntOption 100;
      theme.bar.menus.menu.dashboard.profile.radius = mkStrOption "0.4em";
      theme.bar.menus.menu.dashboard.profile.size = mkStrOption "8.5em";
      theme.bar.menus.menu.dashboard.scaling = mkIntOption 100;
      theme.bar.menus.menu.media.card.tint = mkIntOption 85;
      theme.bar.menus.menu.media.scaling = mkIntOption 100;
      theme.bar.menus.menu.network.scaling = mkIntOption 100;
      theme.bar.menus.menu.notifications.height = mkStrOption "58em";
      theme.bar.menus.menu.notifications.pager.show = mkBoolOption true;
      theme.bar.menus.menu.notifications.scaling = mkIntOption 100;
      theme.bar.menus.menu.notifications.scrollbar.radius = mkStrOption "0.2em";
      theme.bar.menus.menu.notifications.scrollbar.width = mkStrOption "0.35em";
      theme.bar.menus.menu.power.radius = mkStrOption "0.4em";
      theme.bar.menus.menu.power.scaling = mkIntOption 90;
      theme.bar.menus.menu.volume.scaling = mkIntOption 100;
      theme.bar.menus.monochrome = mkBoolOption false;
      theme.bar.menus.opacity = mkIntOption 100;
      theme.bar.menus.popover.radius = mkStrOption "0.4em";
      theme.bar.menus.popover.scaling = mkIntOption 100;
      theme.bar.menus.progressbar.radius = mkStrOption "0.3rem";
      theme.bar.menus.scroller.radius = mkStrOption "0.7em";
      theme.bar.menus.scroller.width = mkStrOption "0.25em";
      theme.bar.menus.shadow = mkStrOption "0px 0px 3px 1px #16161e";
      theme.bar.menus.shadowMargins = mkStrOption "5px 5px";
      theme.bar.menus.slider.progress_radius = mkStrOption "0.3rem";
      theme.bar.menus.slider.slider_radius = mkStrOption "0.3rem";
      theme.bar.menus.switch.radius = mkStrOption "0.2em";
      theme.bar.menus.switch.slider_radius = mkStrOption "0.2em";
      theme.bar.menus.tooltip.radius = mkStrOption "0.3em";
      theme.bar.opacity = mkIntOption 100;
      theme.bar.outer_spacing = mkStrOption "1.6em";
      theme.bar.scaling = mkIntOption 100;
      theme.bar.shadow = mkStrOption "0px 1px 2px 1px #16161e";
      theme.bar.shadowMargins = mkStrOption "0px 0px 4px 0px";
      theme.bar.transparent = mkBoolOption false;
      theme.font.name = mkStrOption "Ubuntu Nerd Font";
      theme.font.size = mkStrOption "1.2rem";
      theme.font.weight = mkIntOption 600;
      theme.matugen = mkBoolOption false;
      theme.matugen_settings.contrast = mkIntOption 0;
      theme.matugen_settings.mode = mkStrOption "dark";
      theme.matugen_settings.scheme_type = mkStrOption "tonal-spot";
      theme.matugen_settings.variation = mkStrOption "standard_1";
      theme.notification.border_radius = mkStrOption "0.6em";
      theme.notification.enableShadow = mkBoolOption false;
      theme.notification.opacity = mkIntOption 100;
      theme.notification.scaling = mkIntOption 100;
      theme.notification.shadow = mkStrOption "0px 1px 2px 1px #16161e";
      theme.notification.shadowMargins = mkStrOption "4px 4px";
      theme.osd.active_monitor = mkBoolOption true;
      theme.osd.duration = mkIntOption 2500;
      theme.osd.enable = mkBoolOption true;
      theme.osd.enableShadow = mkBoolOption false;
      theme.osd.location = mkStrOption "right";
      theme.osd.margins = mkStrOption "0px 5px 0px 0px";
      theme.osd.monitor = mkIntOption 0;
      theme.osd.muted_zero = mkBoolOption false;
      theme.osd.opacity = mkIntOption 100;
      theme.osd.orientation = mkStrOption "vertical";
      theme.osd.radius = mkStrOption "0.4em";
      theme.osd.border.size = mkStrOption "0em";
      theme.osd.scaling = mkIntOption 100;
      theme.osd.shadow = mkStrOption "0px 0px 3px 2px #16161e";
      theme.tooltip.scaling = mkIntOption 100;
      wallpaper.enable = mkBoolOption true;
      wallpaper.image = mkStrOption "";
      wallpaper.pywal = mkBoolOption false;
    };
  };

  config = let

    theme =
      if cfg.theme != ""
      then builtins.fromJSON (builtins.readFile ../themes/${cfg.theme}.json)
      else {};

    flatSet = flattenAttrs (lib.attrsets.recursiveUpdate cfg.settings theme) "";

    mergeSet = flatSet // (flattenAttrs cfg.override "");

    fullSet = if cfg.layout == null then mergeSet else mergeSet // cfg.layout;

    finalConfig = toNestedObject fullSet;

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

  in mkIf cfg.enable {

    # nixpkgs.overlays = if cfg.overlay.enable then [ self.overlay ] else null;
    nixpkgs.overlays = lib.optionals cfg.overlay.enable [ self.overlay ];

    home.packages = [
      package
      hyprpanel-diff
      (if pkgs ? nerd-fonts.jetbrains-mono
      then pkgs.nerd-fonts.jetbrains-mono
      # NOTE:(benvonh) Remove after next release 25.05
      else pkgs.nerdfonts.override { fonts = [ "JetBrainsMono" ]; })
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

    # NOTE: Deprecated
    # systemd.user.services = mkIf cfg.systemd.enable {
    #   hyprpanel = {
    #     Unit = {
    #       Description = "A Bar/Panel for Hyprland with extensive customizability.";
    #       Documentation = "https://hyprpanel.com";
    #       PartOf = [ "graphical-session.target" ];
    #       After = [ "graphical-session-pre.target" ];
    #     };
    #     Service = {
    #       ExecStart = "${package}/bin/hyprpanel";
    #       ExecReload = "${pkgs.coreutils}/bin/kill -SIGUSR1 $MAINPID";
    #       Restart = "on-failure";
    #       KillMode = "mixed";
    #     };
    #     Install = { WantedBy = [ "graphical-session.target" ]; };
    #   };
    # };
    warnings = if cfg.systemd.enable then [ "The `systemd.enable` option is now obsolete." ] else [];

    wayland.windowManager.hyprland.settings.exec-once = mkIf cfg.hyprland.enable [ "${package}/bin/hyprpanel" ];
  };
}
