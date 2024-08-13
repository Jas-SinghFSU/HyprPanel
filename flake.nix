{
  description = "A Bar/Panel for Hyprland with extensive customizability.";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    ags.url = "github:Aylur/ags";
  };

  outputs = inputs:
    let
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

      devShellFor =
        system:
        inputs.nixpkgs.lib.genAttrs [ "default" ] (
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
              pkgsFor.${system}.bluez-tools
              pkgsFor.${system}.grimblast
              pkgsFor.${system}.gpu-screen-recorder
              pkgsFor.${system}.brightnessctl
              pkgsFor.${system}.gnome.gnome-bluetooth
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
              export PATH=$PATH:${pkgsFor.${system}.dart-sass}/bin
              export PATH=$PATH:${pkgsFor.${system}.fd}/bin
              export PATH=$PATH:${pkgsFor.${system}.btop}/bin
              export PATH=$PATH:${pkgsFor.${system}.pipewire}/bin
              export PATH=$PATH:${pkgsFor.${system}.bluez}/bin
              export PATH=$PATH:${pkgsFor.${system}.bluez-tools}/bin
              export PATH=$PATH:${pkgsFor.${system}.grimblast}/bin
              export PATH=$PATH:${pkgsFor.${system}.gpu-screen-recorder}/bin
              export PATH=$PATH:${pkgsFor.${system}.networkmanager}/bin
              export PATH=$PATH:${pkgsFor.${system}.brightnessctl}/bin
              export PATH=$PATH:${pkgsFor.${system}.gnome.gnome-bluetooth}/bin
              export PATH=$PATH:${pkgsFor.${system}.python3}/bin
            '';
          }
        );
    in
    {
      devShells = forEachSystem devShellFor;

      overlay = forEachSystem (
        system:
        let
          pkgs = pkgsFor.${system};
        in
        final: prev: {
          hyprpanel =
            if final ? callPackage
            then (final.callPackage ./nix/default.nix { inherit inputs; }).desktop.script
            else inputs.self.packages.${prev.stdenv.system}.default;
        }
      );

      packages = forEachSystem (
        system:
        let
          pkgs = pkgsFor.${system};
        in
        {
          default = (pkgs.callPackage ./nix { inherit inputs; }).desktop.script;
        }
      );
    };
}
