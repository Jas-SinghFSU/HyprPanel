{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    
    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      astal,
      ags,
    }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
      forEachSystem = nixpkgs.lib.genAttrs systems;
      packages =
        system: pkgs:
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
          gtksourceview3
          libsoup_3
          (python3.withPackages (
            ps: with ps; [
              gpustat
              dbus-python
              pygobject3
            ]
          ))
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

    in
    {
      devShells = forEachSystem (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShell {
            buildInputs =
              with pkgs;
              packages system pkgs
              ++ [
                ags.packages.${system}.ags
                astal.packages.${system}.astal3
                astal.packages.${system}.io
                gjs
                meson
                pkg-config
                ninja
              ];
            shellHook = ''
              # Exporting glib-networking modules
              export GIO_EXTRA_MODULES="${pkgs.glib-networking}/lib/gio/modules"
              if [ "''${PWD##*/}" = "HyprPanel" ]; then
                echo "Initialise dependencies required in order for tsserver to work? (y/anything_else)"
                read consent
                if [ "$consent" = "y" ]; then
                  ags types -d .; mkdir node_modules; ln -s ${astal.packages.${system}.gjs}/share/astal/gjs ./node_modules/astal
                fi
              else
                echo "You're not in the HyprPanel root directory, initialisation failed"
              fi
            '';
          };
        }
      );
      packages = forEachSystem (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = ags.lib.bundle {
            inherit pkgs;
            src = ./.;
            name = "hyprpanel"; # name of executable
            entry = "app.ts";

            extraPackages = packages system pkgs;
              
          };
          # Make a wrapper package to avoid overlay
          wrapper = pkgs.writeShellScriptBin "hyprpanel" ''
            # Exporting glib-networking modules
            export GIO_EXTRA_MODULES="${pkgs.glib-networking}/lib/gio/modules"
            if [ "$#" -eq 0 ]; then
                exec ${self.packages.${pkgs.stdenv.system}.default}/bin/hyprpanel
            else
                exec ${ags.packages.${pkgs.stdenv.system}.io}/bin/astal -i hyprpanel "$@"
            fi
          '';
        }
      );

      # Define .overlay to expose the package as pkgs.hyprpanel based on the system
      overlay = final: prev: {
        hyprpanel = prev.writeShellScriptBin "hyprpanel" ''
          if [ "$#" -eq 0 ]; then
              exec ${self.packages.${final.stdenv.system}.default}/bin/hyprpanel
          else
              exec ${ags.packages.${final.stdenv.system}.io}/bin/astal -i hyprpanel "$@"
          fi
        '';
      };

      homeManagerModules.hyprpanel = import ./nix/module.nix self;
    };
}
