{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    ags,
  }: let
    systems = ["x86_64-linux" "aarch64-linux"];
    forEachSystem = nixpkgs.lib.genAttrs systems;
  in {
    packages = forEachSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      default = ags.lib.bundle {
        inherit pkgs;
        src = ./.;
        name = "hyprpanel"; # name of executable
        entry = "app.ts";

        extraPackages =
          (with ags.packages.${system}; [
            tray
            hyprland
            apps
            battery
            bluetooth
            mpris
            cava
            network
            notifd
            powerprofiles
            wireplumber
          ])
          ++ (with pkgs; [
            fish
            typescript
            libnotify
            dart-sass
            fd
            btop
            bluez
            libgtop
            gobject-introspection
            glib
            bluez-tools
            grimblast
            brightnessctl
            gnome-bluetooth
            (python3.withPackages (ps:
              with ps; [
                gpustat
                dbus-python
                pygobject3
              ]))
            matugen
            hyprpicker
            hyprsunset
            hypridle
            wireplumber
            networkmanager
            wf-recorder
            upower
            gvfs
            swww
            pywal
          ]);
      };
    });

    # Define .overlay to expose the package as pkgs.hyprpanel based on the system
    overlay = final: prev: {
      hyprpanel = prev.writeShellScriptBin "hyprpanel" ''
        if [ "$#" -eq 0 ]; then
            exec ${self.packages.${final.stdenv.system}.default}/bin/hyprpanel
        else
            exec ${ags.packages.${final.stdenv.system}.io}/bin/astal -i hyprpanel "$*"
        fi
      '';
    };

    homeManagerModules.hyprpanel = import ./nix/module.nix self;
  };
}
