# HyprPanel

A panel built for Hyprland with [Astal](https://github.com/Aylur/astal)

## Project Status

HyprPanel is in maintenance mode. Bugs will still be fixed and PRs are welcome, but new features won't be added.

Through building and maintaining this panel, I've learned a lot from your feedback. There have been some recurring pain points since the start: configurability, installation headaches, too many dependencies, and breaking changes from dependencies HyprPanel relies on. There are also gaps between what I want this panel to be and what the tools/frameworks HyprPanel relies on offer - though this is not to take away from those frameworks. It's more-so that with the vision I have for building a more cohesive shell, I need more control over system services (NetworkManager, Bluetooth, etc.) rather than relying on hacky dbus scripts to bridge the gap. Additionally, this should be obvious but GJS (even with TypeScript) just isn't a good systems language. Additionally, Wayle will use GTK4 instead of GTK3.

To address all of this, I've started working on [Wayle](https://github.com/Jas-SinghFSU/wayle/) - a compositor-agnostic successor built entirely in Rust. I'm building my own services, CLI, and tooling from scratch. The goals: much easier installation, TOML config instead of the JSON mess, better theming with proper Pywal/Matugen/Wallust integration, a real design system, and native system service management out of the box.

If you like HyprPanel, Wayle is meant to have a lot of feature parity with all these improvements. And if you switch to a different compositor/window-manager, you can take your config/shell along with you (assuming the compositor implement the layer shell protocol).

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

## To control screen/keyboard brightness
brightnessctl

## For bluetooth support
bluez
bluez-utils

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

Please see <https://hyprpanel.com/getting_started/installation.html#nixos>.

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
