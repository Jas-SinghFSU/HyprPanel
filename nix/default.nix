{
  inputs,
  pkgs,
  system,
  stdenv,
  lib,
  writeShellScriptBin,
  bun,
  dart-sass,
  fd,
  accountsservice,
  btop,
  pipewire,
  bluez,
  bluez-tools,
  grimblast,
  meson,
  gpu-screen-recorder,
  networkmanager,
  brightnessctl,
  gnome-bluetooth,
  matugen,
  swww,
  gjs,
  ninja,
  python3,
  libgtop,
  gobject-introspection,
  glib,
}: let
  ags = inputs.ags.packages.${system}.default.override {
    extraPackages = [accountsservice];
  };

  pname = "hyprpanel";
  config = stdenv.mkDerivation {
    inherit pname;
    version = "latest";
    src = ../.;

    buildInputs = [
      ags
      ninja
      gjs
    ];

    buildPhase = ''
      # cp -r ../assets ../scripts ../src ../themes ../app.ts ../meson.build ../package.json ../package-lock.json ../tsconfig.json .
      ${meson}/bin/meson setup build
      ${meson}/bin/meson compile -C build
    '';

    installPhase = ''
      pwd > pwd
      echo $out > out
      ${meson}/bin/meson install -C build --destdir=$out
    '';
  };
in {
  desktop = {
    inherit config;
    script = writeShellScriptBin pname ''
      export PATH=$PATH:${lib.makeBinPath [dart-sass fd btop pipewire bluez bluez-tools networkmanager matugen swww grimblast gpu-screen-recorder brightnessctl gnome-bluetooth python3 gjs]}
      export GI_TYPELIB_PATH=${libgtop}/lib/girepository-1.0:${glib}/lib/girepository-1.0:$GI_TYPELIB_PATH
      export HYPRPANEL_DATADIR="/usr/local/share/hyprpanel"

      if [ "$#" -eq 0 ]; then
          exec gjs -m "${config}/usr/local/share/hyprpanel/hyprpanel.js"
      else
          exec astal -i hyprpanel "$@"
      fi
    '';
  };
}
