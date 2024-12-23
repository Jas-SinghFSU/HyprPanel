# HyprPanel 🚀

A panel built for Hyprland with [Astal](https://github.com/Aylur/astal)

![HyprPanel1](./assets/hp1.png)
![HyprPanel2](./assets/hp2.png)

> NOTE: If you would like to support the project, please instead [donate to Aylur](https://ko-fi.com/aylur) who put in tremendous effort to build AGS. Hyprpanel likely wouldn't exist without it.

## Information

The [HyprPanel Wiki](https://hyprpanel.com/getting_started/installation.html) contains in depth instructions for configuring and installing the panel and all of its dependencies. The instructions below are just the general instructions for installing the panel.

## Arch

```bash
yay -S ags-hyprpanel-git
```

## From Source

### Required

```sh
aylurs-gtk-shell-git
wireplumber
libgtop
bluez
bluez-utils
networkmanager
dart-sass
wl-clipboard
upower
gvfs
```

**NOTE: HyprPanel will not run without the required dependencies.**

### Optional

```sh
## Used for Tracking GPU Usage in your Dashboard (NVidia only)
python
python-gpustat

## To control screen/keyboard brightness
brightnessctl

## Only if a pywal hook from wallpaper changes applied through settings is desired
pywal

## To check for pacman updates in the default script used in the updates module
pacman-contrib

## To switch between power profiles in the battery module
power-profiles-daemon

## To take snapshots with the default snapshot shortcut in the dashboard
grimblast

## To record screen through the dashboard record shortcut
gpu-screen-recorder

## To enable the eyedropper color picker with the default snapshot shortcut in the dashboard
hyprpicker

## To enable hyprland's very own blue light filter
hyprsunset

## To enable hyprland's very own idle inhibitor
hypridle

## To click resource/stat bars in the dashboard and open btop
btop

## To enable matugen based color theming
matugen

## To enable matugen based color theming and setting wallpapers
swww
```

### Arch

pacman:

```bash
 sudo pacman -S --needed wireplumber libgtop bluez bluez-utils btop networkmanager dart-sass wl-clipboard brightnessctl swww python upower pacman-contrib power-profiles-daemon gvfs
```

AUR:

```bash
yay -S --needed aylurs-gtk-shell-git grimblast-git gpu-screen-recorder-git hyprpicker matugen-bin python-gpustat hyprsunset-git hypridle-git
```

### Fedora

COPR - Add [solopasha/hyprland](https://copr.fedorainfracloud.org/coprs/solopasha/hyprland/) for most hyprland-related dependencies, and [hues-sueh/packages](https://copr.fedorainfracloud.org/coprs/heus-sueh/packages/) for matugen. Both provide the `swww` package, so prioritise the former repo:

```bash
sudo dnf copr enable solopasha/hyprland
sudo dnf copr enable heus-sueh/packages
sudo dnf config-manager --save --setopt=copr:copr.fedorainfracloud.org:heus-sueh:packages.priority=200
```

DNF:

```sh
sudo dnf install wireplumber upower libgtop2 bluez bluez-tools grimblast hyprpicker btop NetworkManager wl-clipboard swww brightnessctl gnome-bluetooth aylurs-gtk-shell power-profiles-daemon gvfs nodejs
```

npm:

```bash
npm install -g sass
```

flatpak:

```bash
flatpak install flathub --system com.dec05eba.gpu_screen_recorder
```

#### Optional Dependencies

pip:

```bash
sudo dnf install python python3-pip; pip install gpustat pywal
```

### NixOS

For NixOS/Home-Manager, see [NixOS & Home-Manager instructions](#nixos--home-manager).

## Installation

To install HyprPanel, you can run the following commands:

```bash
git clone https://github.com/Jas-SinghFSU/HyprPanel.git
cd HyprPanel
meson setup build
meson compile -C build
meson install -C build
```

### Installing NerdFonts

HyprPanel uses [Nerdfonts](https://www.nerdfonts.com/) to display icons. You can install them using the following command from within the HyprPanel's `scripts` directory:

```sh
# Installs the JetBrainsMono NerdFonts used for icons
./scripts/install_fonts.sh
```

If you install the fonts after installing HyperPanel, you will need to restart HyperPanel for the changes to take effect.

### NixOS & Home-Manager

<details>
<summary>Overlay Method</summary>
Alternatively, if you're using NixOS and/or Home-Manager, you can setup AGS using the provided Nix Flake. First, add the repository to your Flake's inputs, and enable the overlay.

```nix
# flake.nix

{
  inputs.hyprpanel.url = "github:Jas-SinghFSU/HyprPanel";
  # ...

  outputs = { self, nixpkgs, ... }@inputs:
  let
    # ...
	system = "x86_64-linux"; # change to whatever your system should be.
    pkgs = import nixpkgs {
	  inherit system;
	  # ...
	  overlays = [
        inputs.hyprpanel.overlay
	  ];
	};
  in {
    # ...
  }
}
```

Once you've set up the overlay, you can reference HyprPanel with `pkgs.hyprpanel` as if it were any other Nix package. This means you can reference it as a NixOS system/user package, a Home-Manager user package, or as a direct reference in your Hyprland configuration (if your configuration is managed by Home-Manager). The first three methods will add it to your `$PATH` (first globally, second two user-only), however the final will not.

```nix
# configuration.nix

# install it as a system package
environment.systemPackages = with pkgs; [
  # ...
  hyprpanel
  # ...
];

# or install it as a user package
users.users.<username>.packages = with pkgs; [
  # ...
  hyprpanel
  # ...
];


# home.nix

# install it as a user package with home-manager
home.packages = with pkgs; [
  # ...
  hyprpanel
  # ...
];

# or reference it directly in your Hyprland configuration
wayland.windowManager.hyprland.settings.exec-once = [
  "${pkgs.hyprpanel}/bin/hyprpanel"
];

```
</details>

<details>
<summary>Home Manager Module</summary>
If you want to configure HyprPanel with the Home Manager module, read this section instead.

First, as with the overlay method, add HyprPanel to your flake.
```nix
# flake.nix
{
  inputs = {
    hyprpanel.url = "github:jas-singhfsu/hyprpanel";
    # Good practice to ensure packages in HyprPanel
    # are the same version as your system packages.
    hyprpanel.inputs.nixpkgs.follows = "nixpkgs";
  };

  # ...
}
```

Then, import the Home Manager module and configure it as you wish.
Below is an example of some of the options that are available.
```nix
# *.nix
{ inputs, ... }:
{
  imports = [ inputs.hyprpanel.homeManagerModules.hyprpanel ];
  
  programs.hyprpanel = {

    # Enable the module.
    # Default: false
    enable = true;

    # Automatically restart HyprPanel with systemd.
    # Useful when updating your config so that you
    # don't need to manually restart it.
    # Default: false
    systemd.enable = true;

    # Adds '/nix/store/.../hyprpanel' to the
    # 'exec-once' in your Hyprland config.
    # Default: false
    hyprland.enable = true;

    # Fixes the overwrite issue with HyprPanel.
    # See below for more information.
    # Default: false
    overwrite.enable = true;

    # Import a specific theme from './themes/*.json'.
    # Default: ""
    theme = "gruvbox_split";

    # See 'https://hyprpanel.com/configuration/panel.html'.
    # Default: null
    layout = {
      "bar.layouts" = {
        "0" = {
          left = [ "dashboard" "workspaces" ];
          middle = [ "media" ];
          right = [ "volume" "systray" "notifications" ];
        };
      };
    };

    # See './nix/module.nix:103'.
    # Many of the options from the GUI are included.
    # Default: <same as gui>
    settings = {
      bar.launcher.autoDetectIcon = true;
      bar.workspaces.show_icons = true;

      menus.clock = {
        time = {
          military = true;
          hideSeconds = true;
        };
        weather.unit = "metric";
      };

      menus.dashboard.directories.enabled = false;
      menus.dashboard.stats.enable_gpu = true;

      theme.bar.transparent = true;

      theme.font = {
        name = "CaskaydiaCove NF";
        size = "16px";
      };
    };
  };
}
```
:warning: **Caveat**: Currently, updating the configuration through the GUI will
overwrite the `config.json` file by deleting it and creating a new one in its
place. This causes an error with Home Manager as the config must be a symlink to
the current generation for Home Manager to properly update it. A shorthand fix
is to delete `config.json` if it is NOT a symlink which can be handled for you
with the module by setting the `overwrite.enable` option. An obvious caveat to
this is that you can no longer tweak the configuration through the GUI. The
recommended workflow is to keep track of the differences and apply it later
in the module. This will hopefully be improved in a future update - benvonh.
</details>

### Launch the panel

Afterwards you can run the panel with the following command in your terminal:

```bash
hyprpanel
```

Or you can add it to your Hyprland config (hyprland.conf) to auto-start with:

```bash
exec-once = hyprpanel
```

### Notifications

HyprPanel handles notifications through the AGS built-in notification service. If you're already using a notification daemon such as Dunst or Mako, you may have to stop them to prevent conflicts with HyprPanel.

> NOTE: If your system is in a language other than English, the resource monitor in the dashboard may not work properly.
