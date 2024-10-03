{
  description = "A Bar/Panel for Hyprland with extensive customizability.";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    ags.url = "github:Aylur/ags";
  };

  outputs = inputs: let
    systems = [
      "x86_64-linux"
      "x86_64-darwin"
      "aarch64-darwin"
      "aarch64-linux"
    ];
    forEachSystem = inputs.nixpkgs.lib.genAttrs systems;
    pkgsFor = forEachSystem (
      system:
        import inputs.nixpkgs {
          inherit system;
          config.allowUnfree = true;
        }
    );

    devShellFor = system:
      inputs.nixpkgs.lib.genAttrs ["default"] (
        _:
          inputs.nixpkgs.legacyPackages.${system}.mkShell {
            buildInputs = [
              pkgsFor.${system}.esbuild
              pkgsFor.${system}.fish
              pkgsFor.${system}.typescript
              pkgsFor.${system}.bun
              pkgsFor.${system}.libnotify
              pkgsFor.${system}.dart-sass
              pkgsFor.${system}.fd
              pkgsFor.${system}.btop
              pkgsFor.${system}.bluez
              pkgsFor.${system}.libgtop
              pkgsFor.${system}.gobject-introspection
              pkgsFor.${system}.glib
              pkgsFor.${system}.bluez-tools
              pkgsFor.${system}.grimblast
              pkgsFor.${system}.gpu-screen-recorder
              pkgsFor.${system}.brightnessctl
              pkgsFor.${system}.gnome-bluetooth
              pkgsFor.${system}.python3
              pkgsFor.${system}.matugen
              inputs.ags.packages.${system}.agsWithTypes
            ];
            nativeBuildInputs = with pkgsFor.${system}; [
              nixfmt-rfc-style
              nil
            ];
            shellHook = ''
              export GDK_BACKEND=wayland
              export GI_TYPELIB_PATH=${pkgsFor.${system}.libgtop}/lib/girepository-1.0:${pkgsFor.${system}.glib}/lib/girepository-1.0:$GI_TYPELIB_PATH
            '';
          }
      );
  in {
    devShells = forEachSystem devShellFor;

    overlay = final: prev: {
      hyprpanel =
        if final ? callPackage
        then (final.callPackage ./nix {inherit inputs;}).desktop.script
        else inputs.self.packages.${prev.stdenv.system}.default;
    };
    packages = forEachSystem (
      system: let
        pkgs = pkgsFor.${system};
      in {
        default = (pkgs.callPackage ./nix {inherit inputs;}).desktop.script;
      }
    );
  };
}
