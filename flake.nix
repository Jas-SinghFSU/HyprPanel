{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    ags.url = "github:aylur/ags";
    astal.url = "github:aylur/astal";
  };

  outputs = { self, nixpkgs, ags, astal }: let
    systems = [
      "x86_64-linux"
      "x86_64-darwin"
      "aarch64-darwin"
      "aarch64-linux"
    ];
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

        # additional libraries and executables to add to gjs' runtime
        extraPackages = [
          ags.packages.${system}.agsFull
          astal.packages.${system}.tray
          astal.packages.${system}.hyprland
          astal.packages.${system}.io
          astal.packages.${system}.apps
          astal.packages.${system}.battery
          astal.packages.${system}.bluetooth
          astal.packages.${system}.mpris
          astal.packages.${system}.network
          astal.packages.${system}.notifd
          astal.packages.${system}.powerprofiles
          astal.packages.${system}.wireplumber
          pkgs.fish
          pkgs.typescript
          pkgs.libnotify
          pkgs.dart-sass
          pkgs.fd
          pkgs.btop
          pkgs.bluez
          pkgs.libgtop
          pkgs.gobject-introspection
          pkgs.glib
          pkgs.bluez-tools
          pkgs.grimblast
          pkgs.gpu-screen-recorder
          pkgs.brightnessctl
          pkgs.gnome-bluetooth
          (pkgs.python3.withPackages (python-pkgs: with python-pkgs; [
            gpustat
            dbus-python
            pygobject3
          ]))
          pkgs.matugen
          pkgs.hyprpicker
          pkgs.hyprsunset
          pkgs.hypridle
          pkgs.wireplumber
          pkgs.networkmanager
          pkgs.upower
          pkgs.gvfs
          pkgs.swww
          pkgs.pywal
        ];
      };
    });

    # Define .overlay to expose the package as pkgs.hyprpanel based on the system
    overlay = final: prev: {
      hyprpanel = self.packages.${prev.stdenv.system}.default;
    };
  };
}
