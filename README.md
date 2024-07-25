# HyprPanel
A panel built for Hyprland with [Aylur's Gnome Shell](https://github.com/Aylur/ags)

## Requirements
Bun (may require sudo)

```sh
curl -fsSL https://bun.sh/install | bash && \
  ln -s $HOME/.bun/bin/bun /usr/local/bin/bun
```
Additional dependencies:
```
pipewire
bluez
bluez-utils
grimblast
gpu-screen-recorder
hyprpicker
btop
networkmanager
dart-sass
brightnessctl
python
python-gpustat

```

Arch (pacman):
```bash
sudo pacman -S pipewire bluez bluez-utils btop networkmanager dart-sass brightnessctl python
```

Arch (AUR):
```bash
yay -S grimblast gpu-screen-recorder hyprpicker python-gpustat aylurs-gtk-shell-git
```

## Instructions

Once everything is installed you can run the panel with the following command in your terminal:
```bash
ags
```

Or you can add it to your Hyprland config (hyprland.conf) to auto-start with:
```bash
exec-once = ags
```

The HyprPanel comes with a configuration menu which is available by opening the Dashboard menu (click the button in the bar with your Distro's logo) and then clicking the Gear icon;

### Specifying bar layouts per monitor

To specify layouts for each monitor you can create a JSON object such as:
```JSON
{
    "0": {
        "left": [
            "dashboard",
            "workspaces",
            "windowtitle"
        ],
        "middle": [
            "media"
        ],
        "right": [
            "volume",
            "clock",
            "notifications"
        ]
    },
    "1": {
        "left": [
            "dashboard",
            "workspaces",
            "windowtitle"
        ],
        "middle": [
            "media"
        ],
        "right": [
            "volume",
            "clock",
            "notifications"
        ]
    },
    "2": {
        "left": [
            "dashboard",
            "workspaces",
            "windowtitle"
        ],
        "middle": [
            "media"
        ],
        "right": [
            "volume",
            "network",
            "bluetooth",
            "systray",
            "clock",
            "notifications"
        ]
    }
}
```

Where each monitor is defined by its index (0, 1, 2 in this case) and each section (left, middle, right) contains one or more of the following modules:
```js
"battery"
"dashboard"
"workspaces"
"windowtitle"
"media"
"notifications"
"volume"
"network"
"bluetooth"
"clock"
"systray"
```
Since the text-box in the options dialog isn't sufficient, it is recommended that you create this JSON configuration in a text editor elsewhere and paste it into the layout text-box under Configuration > Bar > "Bar Layouts for Monitors".
