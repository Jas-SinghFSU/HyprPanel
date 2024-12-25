self: { lib, pkgs, config, ... }:
let
  inherit (lib) types mkIf mkOption mkEnableOption;

  cfg = config.programs.hyprpanel;

  jsonFormat = pkgs.formats.json { };
  
  # No package option
  package = self.packages.${pkgs.system}.default;

  # Shorthand lambda for self-documenting options under settings
  mkStrOption = default: mkOption { type = types.str; default = default; };
  mkIntOption = default: mkOption { type = types.int; default = default; };
  mkBoolOption = default: mkOption { type = types.bool; default = default; };

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
          "[" + (builtins.concatStringsSep ", " items) + "]"
      else if builtins.isAttrs value then
        let
          keys = builtins.attrNames value;
          toKeyValue = k: "\"${k}\": ${toNestedValue value.${k}}";
          inner = builtins.concatStringsSep ", " (builtins.map toKeyValue keys);
        in
          "{ " + inner + " }"
      else
        abort "Unexpected error! Please post a new issue...";

  toNestedObject = attrSet:
    let
      keys = builtins.attrNames attrSet;
      kvPairs = builtins.map (k: "\"${k}\": ${toNestedValue attrSet.${k}}") keys;
    in
      "{ " + builtins.concatStringsSep ", " kvPairs + " }";
in
{
  options.programs.hyprpanel = {
    enable = mkEnableOption "HyprPanel";
    systemd.enable = mkEnableOption "systemd integration";
    hyprland.enable = mkEnableOption "Hyprland integration";
    overwrite.enable = mkEnableOption "overwrite config fix";
    
    theme = mkOption {
      type = types.str;
      default = "";
      example = "catppuccin_mocha";
      description = "Theme to import (see ./themes/*.json)";
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
      bar.customModules.updates.pollingInterval = mkIntOption 1440000;
      bar.customModules.updates.updateCommand = mkOption {
        type = types.str; default = ""; description = "not applicable with nix";
      };
      bar.launcher.autoDetectIcon = mkBoolOption false;
      bar.launcher.icon = mkStrOption "󰣇";
      bar.launcher.middleClick = mkStrOption "";
      bar.launcher.rightClick = mkStrOption "";
      bar.launcher.scrollDown = mkStrOption "";
      bar.launcher.scrollUp = mkStrOption "";
      bar.workspaces.applicationIconOncePerWorkspace = mkBoolOption true;
      bar.workspaces.hideUnoccupied = mkBoolOption true;
      bar.workspaces.icons.active = mkStrOption "";
      bar.workspaces.icons.available = mkStrOption "";
      bar.workspaces.icons.occupied = mkStrOption "";
      bar.workspaces.monitorSpecific = mkBoolOption true;
      bar.workspaces.numbered_active_indicator = mkStrOption "underline";
      bar.workspaces.showAllActive = mkBoolOption true;
      bar.workspaces.showApplicationIcons = mkBoolOption false;
      bar.workspaces.showWsIcons = mkBoolOption false;
      bar.workspaces.show_icons = mkBoolOption false;
      bar.workspaces.show_numbered = mkBoolOption false;
      bar.workspaces.workspaces = mkIntOption 5;
      hyprpanel.restartAgs = mkBoolOption true;
      # FIXME: Flag does not exist anymore
      # hyprpanel.restartCommand = mkStrOption "hyprpanel -q; hyprpanel";
      hyprpanel.restartCommand = mkStrOption "${pkgs.procps}/bin/pkill -u $USER -USR1 hyprpanel; ${package}/bin/hyprpanel";
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
      menus.transition = mkStrOption "crossfade";
      menus.transitionTime = mkIntOption 200;
      tear = mkBoolOption false;
      terminal = mkStrOption "$TERM";
      theme.bar.border.location = mkStrOption "none";
      theme.bar.buttons.borderSize = mkStrOption "0.1em";
      theme.bar.buttons.dashboard.enableBorder = mkBoolOption false;
      theme.bar.buttons.enableBorders = mkBoolOption false;
      theme.bar.buttons.style = mkStrOption "default";
      theme.bar.buttons.workspaces.enableBorder = mkBoolOption false;
      theme.bar.buttons.workspaces.smartHighlight = mkBoolOption true;
      theme.bar.floating = mkBoolOption false;
      theme.bar.layer = mkStrOption "top";
      theme.bar.location = mkStrOption "top";
      theme.bar.menus.monochrome = mkBoolOption false;
      theme.bar.transparent = mkBoolOption false;
      theme.font.name = mkStrOption "Ubuntu Nerd Font";
      theme.font.size = mkStrOption "1.2rem";
      theme.font.weight = mkIntOption 600;
      theme.matugen = mkBoolOption false;
      theme.matugen_settings.contrast = mkIntOption 0;
      theme.matugen_settings.mode = mkStrOption "dark";
      theme.matugen_settings.scheme_type = mkStrOption "tonal-spot";
      theme.matugen_settings.variation = mkStrOption "standard_1";
      wallpaper.enable = mkBoolOption true;
      wallpaper.image = mkStrOption "";
      wallpaper.pywal = mkBoolOption false;
    };
  };

  config = mkIf cfg.enable {
    # TODO:(benvonh) Nerd font packaging changes in NixOS 25.05
    home.packages = [pkgs.nerd-fonts.jetbrains-mono];

    # NOTE:(benvonh)
    # When changing the configuration through the GUI, HyprPanel will delete the `config.json` file and create a new
    # one in its place which destroys the original symlink to the current Home Manager generation. To work around this,
    # we can automatically delete the `config.json` file before generating a new config by enabling the
    # `overwrite.enable` option. Though, at some point, a proper fix should be implemented.
    home.activation =
      let
        path = "${config.xdg.configFile.hyprpanel.target}";
      in mkIf cfg.overwrite.enable {
        hyprpanel = lib.hm.dag.entryBefore [ "writeBoundary" ] ''
          [[ -L "${path}" ]] || rm "${path}"
        '';
      };

    xdg.configFile.hyprpanel = let
      theme = if cfg.theme != "" then builtins.fromJSON (builtins.readFile ../themes/${cfg.theme}.json) else {};
      flatSet = flattenAttrs (lib.attrsets.recursiveUpdate cfg.settings theme) "";
      mergeSet = if cfg.layout == null then flatSet else flatSet // cfg.layout;
    in {
      target = "hyprpanel/config.json";
      text = toNestedObject mergeSet;
      onChange = "${pkgs.procps}/bin/pkill -u $USER -USR1 hyprpanel || true";
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
        Install = { WantedBy = [ "graphical-session.target" ]; };
      };
    };

    wayland.windowManager.hyprland.settings.exec-once = mkIf cfg.hyprland.enable [ "${package}/bin/hyprpanel" ];
  };
}
