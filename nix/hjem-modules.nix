
{ config, lib, pkgs, ... }:

let
  inherit (lib.modules) mkIf;
  inherit (lib.options) mkOption mkEnableOption mkPackageOption;
  inherit (lib.meta) getExe;

  json = pkgs.formats.json {};
  cfg = config.rum.programs.hyprpanel;
in {
  options.rum.programs.hyprpanel = {
    enable = mkEnableOption "HyprPanel status bar";

    package = mkPackageOption pkgs "hyprpanel" {};

    hyprland.enable = mkEnableOption "Integrate with Hyprland exec-once";

    overwrite.enable = mkEnableOption "Overwrite user config with this module";

    settings = mkOption {
      type = json.type;
      default = {};
      example = {
        bar.layouts = {
          "0" = {
            left = [ "dashboard" "workspaces" "windowtitle" ];
            middle = [ "media" ];
            right = [ "volume" "network" "bluetooth" "battery" "systray" "clock" "notifications" ];
          };
        };
      };
      description = ''
        The configuration converted into JSON and written to
        {file}`$HOME/.config/hyprpanel/config.json`.

        Please refer to [HyprPanel documentation](https://hyprpanel.com/configuration/settings.html)
        for details.
      '';
    };

    override = mkOption {
      type = lib.types.attrs;
      default = {};
      description = ''
        Arbitrary attribute set to override final config.
        Useful for customizing colors, theming, or patching values.
      '';
    };

    systemd.enable = mkEnableOption "Enable systemd user service for HyprPanel";
  };

  config = mkIf cfg.enable {
    hj.packages = [ cfg.package ];

    # Write the JSON configuration file
    hj.files.".config/hyprpanel/config.json".source =
      mkIf (cfg.settings != {}) (
        json.generate "hyprpanel-config.json" (lib.recursiveUpdate cfg.settings cfg.override)
      );

    # Integration with Hyprland exec-once
    hj.rum.programs.hyprland.settings.exec-once =
      mkIf cfg.hyprland.enable [ (getExe cfg.package) ];

    # Systemd user service for HyprPanel
    systemd.user.services.hyprpanel = mkIf cfg.systemd.enable {
      description = "HyprPanel status bar for graphical session";
      wantedBy = [ "graphical-session.target" ];
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

