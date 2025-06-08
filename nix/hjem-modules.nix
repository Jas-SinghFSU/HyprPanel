{
  config,
  lib,
  pkgs,
  ...
}: let
  inherit (lib.modules) mkIf;
  inherit (lib.options) mkOption mkEnableOption mkPackageOption;
  inherit (lib.meta) getExe;

  types = lib.types;
  json = pkgs.formats.json {};
  cfg = config.rum.programs.hyprpanel;
  # Theme file auto-load logic from hm module
  themeFile =
    if cfg.themeName != ""
    then builtins.fromJSON (builtins.readFile ../themes/${cfg.themeName}.json)
    else {};
in {
  options.rum.programs.hyprpanel = {
    enable = mkEnableOption "HyprPanel status bar";

    package = mkPackageOption pkgs "hyprpanel" {};

    hyprland.enable = mkEnableOption "Integrate with Hyprland exec-once";

    themeName = mkOption {
      type = types.str;
      default = "catppuccin_mocha";
      example = "catppuccin_mocha";
      description = "Theme name to load from ../themes/<themeName>.json.";
    };

    override = mkOption {
      type = json.type;
      default = {};
      example = {
        "theme.notification.background" = "#181826";
        "theme.notification.close_button.background" = "#f38ba7";
        "theme.bar.buttons.clock.icon" = "#11111b";
        "theme.bar.buttons.clock.text" = "#cdd6f4";
      };
      description = ''
        Additional theme values for overriding loaded themes.
      '';
    };

    settings = mkOption {
      type = json.type;
      default = {};
      example = {
        bar.layouts = {
          "0" = {
            left = ["dashboard" "workspaces" "windowtitle"];
            middle = ["media"];
            right = ["volume" "network" "bluetooth" "battery" "systray" "clock" "notifications"];
          };
        };
        theme.bar.scaling = 85;
        scalingPriority = "both";
        tear = true;
        menus.transition = "crossfade";
        theme.notification.scaling = 80;
        theme.osd.scaling = 80;
        theme.bar.menus.menu.dashboard.scaling = 75;
        theme.bar.menus.menu.dashboard.confirmation_scaling = 80;
        theme.bar.menus.menu.media.scaling = 80;
        theme.bar.menus.menu.volume.scaling = 80;
        theme.bar.menus.menu.network.scaling = 80;
        theme.bar.menus.menu.bluetooth.scaling = 80;
        theme.bar.menus.menu.battery.scaling = 80;
        theme.bar.menus.menu.clock.scaling = 80;
        theme.bar.menus.menu.notifications.scaling = 80;
        theme.bar.menus.menu.power.scaling = 80;
        theme.tooltip.scaling = 80;
      };
      description = ''
        The configuration converted into JSON and written to
        {file}`$HOME/.config/hyprpanel/config.json`.

        Please refer to [HyprPanel documentation](https://hyprpanel.com/configuration/settings.html)
        for details.
      '';
    };

    systemd.enable = mkEnableOption "Enable systemd user service for HyprPanel";
  };

  config = mkIf cfg.enable {
    hj.packages = [cfg.package];

    hj.files.".config/hyprpanel/config.json".source = mkIf (cfg.settings != {}) (
      json.generate "hyprpanel-config.json"
      (cfg.settings // themeFile // cfg.override)
    );

    hj.rum.programs.hyprland.settings.exec-once =
      mkIf cfg.hyprland.enable [(getExe cfg.package)];

    systemd.user.services.hyprpanel = mkIf cfg.systemd.enable {
      description = "HyprPanel status bar for graphical session";
      wantedBy = ["graphical-session.target"];
      serviceConfig = {
        ExecStart = "${getExe cfg.package}";
        ExecReload = "${pkgs.coreutils}/bin/kill -SIGUSR1 $MAINPID";
        Restart = "on-failure";
        RestartSec = 2;
        KillMode = "mixed";
      };
    };
  };
}
