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
gtksourceview3
libsoup3
```

**NOTE: HyprPanel will not run without the required dependencies.**

### Optional

```sh
## Used for Tracking GPU Usage in your Dashboard (NVidia only)
python
python-gpustat

## Used for Tracking GPU Usage in your Dashboard (Amd only)
amdgpu_top

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
wf-recorder

## To enable the eyedropper color picker with the default snapshot shortcut in the dashboard
hyprpicker

## To enable hyprland's very own blue light filter
hyprsunset

## To click resource/stat bars in the dashboard and open btop
btop

## To enable matugen based color theming
matugen

## To enable matugen based color theming and setting wallpapers
swww
```

### Arch

```bash
yay -S --needed aylurs-gtk-shell-git wireplumber libgtop bluez bluez-utils btop networkmanager dart-sass wl-clipboard brightnessctl swww python upower pacman-contrib power-profiles-daemon gvfs gtksourceview3 libsoup3 grimblast-git wf-recorder-git hyprpicker matugen-bin python-gpustat hyprsunset-git
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
sudo dnf install wireplumber upower libgtop2 bluez bluez-tools grimblast hyprpicker btop NetworkManager wl-clipboard swww brightnessctl gnome-bluetooth aylurs-gtk-shell power-profiles-daemon gvfs nodejs wf-recorder
```

npm:

```bash
npm install -g sass
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

Please see https://hyprpanel.com/getting_started/installation.html#nixos.

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
