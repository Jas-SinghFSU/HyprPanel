{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachSystem [ "x86_64-linux" "aarch64-linux" ] (
      system:
      let
        inherit (self) outputs;
        inherit (pkgs) lib;

        pkgs = import nixpkgs {
          inherit system;
          overlays = [ (import ./nix/overlay.nix) ];
        };
      in
      {
        inherit pkgs;

        packages = {
          default = pkgs.hyprpanel;
          hyprpanel = self.packages.${system}.default;
        };

        devShell = pkgs.mkShell {
          inputsFrom = [ self.packages.${system}.default ];
          packages = with pkgs; [
            ags
            astal.astal3
            astal.io
            gjs
            meson
            pkg-config
            ninja
          ];
          shellHook = ''
            if [ "''${PWD##*/}" = "HyprPanel" ]; then
              echo "Initialise dependencies required in order for tsserver to work? (y/anything_else)"
              read consent
              if [ "$consent" = "y" ]; then
                ags types -d .; mkdir node_modules; ln -s ${pkgs.astal.gjs}/share/astal/gjs ./node_modules/astal
              fi
            else
              echo "You're not in the HyprPanel root directory, initialisation failed"
            fi
          '';
          GIO_EXTRA_MODULES = "${pkgs.glib-networking}/lib/gio/modules";
        };
      }
    )
    // {
      overlay = builtins.warn ''
        Overlay has been removed, because hyprpanel is now packaged in
        nixpkgs. Update your system and remove the usage of this overlay.
      '' (_: _: { });

      homeManagerModules.hyprpanel = builtins.warn ''
        Home manager module has been removed, because hyprpanel now lives
        in downstream home-manager. Update your system and remove the usage
        of this module.
      '' { };
    };
}
