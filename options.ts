import { opt, mkOptions } from "lib/option"
import { distro } from "lib/variables"
import { icon } from "lib/utils"
import icons from "lib/icons"

const colors = {
    "rosewater": "#f5e0dc",
    "flamingo": "#f2cdcd",
    "pink": "#f5c2e7",
    "mauve": "#cba6f7",
    "red": "#f38ba8",
    "maroon": "#eba0ac",
    "peach": "#fab387",
    "yellow": "#f9e2af",
    "green": "#a6e3a1",
    "teal": "#94e2d5",
    "sky": "#89dceb",
    "sapphire": "#74c7ec",
    "blue": "#89b4fa",
    "lavender": "#b4befe",
    "text": "#cdd6f4",
    "subtext1": "#bac2de",
    "subtext2": "#a6adc8",
    "overlay2": "#9399b2",
    "overlay1": "#7f849c",
    "overlay0": "#6c7086",
    "surface2": "#585b70",
    "surface1": "#45475a",
    "surface0": "#313244",
    "base2": "#242438",
    "base": "#1e1e2e",
    "mantle": "#181825",
    "crust": "#11111b"
};

const options = mkOptions(OPTIONS, {
    autotheme: opt(false),
    theme: {
        notification: {
            background: opt(colors.base),
            actions: {
                background: opt(colors.surface0),
                hover: opt(colors.surface1),
                text: opt(colors.mantle),
            },
            label: opt(colors.lavender),
            date: opt(colors.overlay1),
            text: opt(colors.text),
            labelicon: opt(colors.lavender),
            close: opt(colors.red)
        },
        bar: {
            transparent: opt(false),
            background: opt(colors.crust),
            buttons: {
                monochrome: opt(false),
                background: opt(colors.base2),
                hover: opt(colors.surface1),
                text: opt(colors.lavender),
                icon: opt(colors.lavender),
                dashboard: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    icon: opt(colors.yellow)
                },
                workspaces: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    available: opt(colors.sky),
                    occupied: opt(colors.flamingo),
                    active: opt(colors.pink),
                },
                windowtitle: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.pink),
                    icon: opt(colors.pink)
                },
                media: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.lavender),
                    icon: opt(colors.lavender)
                },
                volume: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.maroon),
                    icon: opt(colors.maroon),
                },
                network: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.mauve),
                    icon: opt(colors.mauve),
                },
                bluetooth: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.sky),
                    icon: opt(colors.sky),
                },
                systray: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                },
                power: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    icon: opt(colors.red),
                },
                battery: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.yellow),
                    icon: opt(colors.yellow),
                },
                clock: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.pink),
                    icon: opt(colors.pink),
                },
                notifications: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    icon: opt(colors.lavender),
                },
            },
            menus: {
                monochrome: opt(true),
                background: opt(colors.crust),
                cards: opt(colors.base),
                border: opt(colors.surface0),
                text: opt(colors.text),
                label: opt(colors.lavender),
                listitems: {
                    passive: opt(colors.text),
                    active: opt(colors.lavender)
                },
                icons: {
                    passive: opt(colors.overlay2),
                    active: opt(colors.lavender)
                },
                switch: {
                    enabled: opt(colors.lavender),
                    disabled: opt(colors.surface0),
                    puck: opt(colors.overlay0)
                },
                buttons: {
                    default: opt(colors.lavender),
                    hover: opt(colors.pink),
                    text: opt(colors.crust)
                },
                dashboard: {
                    background: opt(colors.base2),
                    text: opt(colors.yellow)
                },
                workspaces: {
                    background: opt(colors.base2),
                    available: opt(colors.sky),
                    occupied: opt(colors.flamingo),
                    active: opt(colors.pink),
                },
                progressbar: opt(colors.lavender),
                slider: {
                    primary: opt(colors.lavender),
                    background: opt(colors.surface2),
                    backgroundhover: opt(colors.surface1),
                    puck: opt(colors.overlay0)
                },
                dropdownmenu: {
                    background: opt(colors.crust),
                    text: opt(colors.text),
                    divider: opt(colors.base)
                },
                tooltip: {
                    background: opt(colors.crust),
                    text: opt(colors.text)
                },
                menu: {
                    media: {
                        song: opt(colors.base2),
                        artist: opt(colors.base2),
                        album: opt(colors.base2),
                        buttons: {
                            inactive: {
                                background: opt(colors.surface2),
                                text: opt(colors.crust)
                            },
                            shuffle: {
                                background: opt(colors.lavender),
                                hover: opt(colors.pink),
                                active: opt(colors.pink),
                                text: opt(colors.crust)
                            },
                            previous: {
                                background: opt(colors.lavender),
                                hover: opt(colors.pink),
                                text: opt(colors.crust)
                            },
                            playpause: {
                                background: opt(colors.lavender),
                                hover: opt(colors.pink),
                                text: opt(colors.crust)

                            },
                            next: {
                                background: opt(colors.lavender),
                                hover: opt(colors.pink),
                                text: opt(colors.crust)

                            },
                            loop: {
                                background: opt(colors.lavender),
                                hover: opt(colors.pink),
                                active: opt(colors.pink),
                                text: opt(colors.crust)

                            }
                        },
                        slider: {
                            primary: opt(colors.pink),
                            background: opt(colors.surface2),
                            backgroundhover: opt(colors.surface1),
                            puck: opt(colors.overlay0)
                        }
                    },
                    volume: {
                        card: {
                            color: opt(colors.base),
                        },
                        background: {
                            color: opt(colors.crust),
                        },
                        border: {
                            color: opt(colors.surface0),
                        },
                        label: {
                            color: opt(colors.maroon),
                        },
                        text: opt(colors.text),
                        listitems: {
                            passive: opt(colors.text),
                            active: opt(colors.maroon)
                        },
                        icons: {
                            passive: opt(colors.overlay2),
                            active: opt(colors.maroon),
                            hover: opt(colors.maroon)
                        },
                        audio_slider: {
                            primary: opt(colors.maroon),
                            background: opt(colors.surface2),
                            backgroundhover: opt(colors.surface1),
                            puck: opt(colors.overlay0)
                        },
                        input_slider: {
                            primary: opt(colors.maroon),
                            background: opt(colors.surface2),
                            backgroundhover: opt(colors.surface1),
                            puck: opt(colors.overlay0)
                        }
                    },
                    network: {
                        card: {
                            color: opt(colors.base),
                        },
                        background: {
                            color: opt(colors.crust),
                        },
                        border: {
                            color: opt(colors.surface0),
                        },
                        label: {
                            color: opt(colors.mauve),
                        },
                        text: opt(colors.text),
                        status: {
                            color: opt(colors.overlay0),
                        },
                        listitems: {
                            passive: opt(colors.text),
                            active: opt(colors.mauve)
                        },
                        icons: {
                            passive: opt(colors.overlay2),
                            active: opt(colors.mauve),
                            hover: opt(colors.mauve)
                        },
                        iconbuttons: {
                            passive: opt(colors.text),
                            hover: opt(colors.mauve)
                        },
                    },
                    bluetooth: {
                        card: {
                            color: opt(colors.base),
                        },
                        background: {
                            color: opt(colors.crust),
                        },
                        border: {
                            color: opt(colors.surface0),
                        },
                        label: {
                            color: opt(colors.sky),
                        },
                        text: opt(colors.text),
                        status: opt(colors.overlay0),
                        switch_divider: opt(colors.surface1),
                        switch: {
                            enabled: opt(colors.sky),
                            disabled: opt(colors.surface0),
                            puck: opt(colors.overlay0)
                        },
                        listitems: {
                            passive: opt(colors.text),
                            active: opt(colors.sky)
                        },
                        icons: {
                            passive: opt(colors.overlay2),
                            active: opt(colors.sky),
                            hover: opt(colors.sky)
                        },
                        iconbuttons: {
                            passive: opt(colors.text),
                            hover: opt(colors.sky)
                        },
                    },
                    systray: {
                        background: {
                            color: opt(colors.base2),
                        },
                        dropdownmenu: {
                            background: opt(colors.crust),
                            text: opt(colors.text),
                            divider: opt(colors.base)
                        },
                    },
                    battery: {
                        card: {
                            color: opt(colors.base),
                        },
                        background: {
                            color: opt(colors.crust),
                        },
                        border: {
                            color: opt(colors.surface0),
                        },
                        label: {
                            color: opt(colors.yellow),
                        },
                        text: opt(colors.text),
                        listitems: {
                            passive: opt(colors.text),
                            active: opt(colors.yellow)
                        },
                        icons: {
                            passive: opt(colors.overlay2),
                            active: opt(colors.yellow),
                            hover: opt(colors.yellow)
                        },
                    },
                    clock: {
                        card: {
                            color: opt(colors.base),
                        },
                        background: {
                            color: opt(colors.crust),
                        },
                        border: {
                            color: opt(colors.surface0),
                        },
                        text: opt(colors.text),
                        time: {
                            time: opt(colors.pink),
                            timeperiod: opt(colors.teal),
                        },
                        calendar: {
                            yearmonth: opt(colors.teal),
                            weekdays: opt(colors.pink),
                            paginator: opt(colors.pink),
                            days: opt(colors.text),
                            contextdays: opt(colors.surface2),
                        },
                        weather: {
                            icon: opt(colors.pink),
                            temperature: opt(colors.text),
                            status: opt(colors.teal),
                            stats: opt(colors.pink),
                            thermometer: {
                                extremelyhot: opt(colors.red),
                                hot: opt(colors.peach),
                                moderate: opt(colors.lavender),
                                cold: opt(colors.blue),
                                extremelycold: opt(colors.sky),
                            },
                            hourly: {
                                time: opt(colors.pink),
                                icon: opt(colors.pink),
                                temperature: opt(colors.pink)
                            }
                        },
                    },
                    dashboard: {
                        card: {
                            color: opt(colors.base),
                        },
                        background: {
                            color: opt(colors.crust),
                        },
                        border: {
                            color: opt(colors.surface0),
                        },
                        profile: {
                            card: opt(colors.base),
                            name: opt(colors.pink)
                        },
                        powermenu: {
                            shutdown: opt(colors.red),
                            restart: opt(colors.peach),
                            logout: opt(colors.green),
                            sleep: opt(colors.sky),
                            confirmation: {
                                card: opt(colors.base),
                                background: opt(colors.crust),
                                border: opt(colors.surface0),
                                label: opt(colors.green),
                                body: opt(colors.text),
                                confirm: opt(colors.green),
                                deny: opt(colors.red),
                            }
                        },
                        shortcuts_left: {
                            shortcut1: {
                                background: opt(colors.lavender),
                                hover: opt(colors.pink),
                                text: opt(colors.crust),
                            },
                            shortcut2: {
                                background: opt(colors.lavender),
                                hover: opt(colors.pink),
                                text: opt(colors.crust),
                            },
                            shortcut3: {
                                background: opt(colors.lavender),
                                hover: opt(colors.pink),
                                text: opt(colors.crust),
                            },
                            shortcut4: {
                                background: opt(colors.lavender),
                                hover: opt(colors.pink),
                                text: opt(colors.crust),
                            },
                        },
                        shortcuts_right: {
                            shortcut1: {
                                background: opt(colors.lavender),
                                hover: opt(colors.pink),
                                text: opt(colors.crust),
                            },
                            shortcut2: {
                                background: opt(colors.lavender),
                                hover: opt(colors.pink),
                                text: opt(colors.crust),
                            },
                            shortcut3: {
                                background: opt(colors.lavender),
                                hover: opt(colors.pink),
                                text: opt(colors.crust),
                            },
                            shortcut4: {
                                background: opt(colors.lavender),
                                hover: opt(colors.pink),
                                text: opt(colors.crust),
                            },
                        },
                        controls: {
                            disabled: (colors.surface2),
                            wifi: {
                                background: opt(colors.mauve),
                                text: opt(colors.crust),
                            },
                            bluetooth: {
                                background: opt(colors.sky),
                                text: opt(colors.crust),
                            },
                            notifications: {
                                background: opt(colors.yellow),
                                text: opt(colors.crust),
                            },
                            volume: {
                                background: opt(colors.maroon),
                                text: opt(colors.crust),
                            },
                            input: {
                                background: opt(colors.pink),
                                text: opt(colors.crust),
                            },
                        },
                        directories: {
                            left: {
                                top: {
                                    color: opt(colors.pink),
                                },
                                middle: {
                                    color: opt(colors.yellow),
                                },
                                bottom: {
                                    color: opt(colors.maroon),
                                },
                            },
                            right: {
                                top: {
                                    color: opt(colors.teal),
                                },
                                middle: {
                                    color: opt(colors.mauve),
                                },
                                bottom: {
                                    color: opt(colors.lavender),
                                },
                            }
                        },
                        monitors: {
                            cpu: {
                                icon: opt(colors.maroon),
                                bar: opt(colors.maroon),
                                label: opt(colors.maroon),
                            },
                            ram: {
                                icon: opt(colors.yellow),
                                bar: opt(colors.yellow),
                                label: opt(colors.yellow),
                            },
                            gpu: {
                                icon: opt(colors.green),
                                bar: opt(colors.green),
                                label: opt(colors.green),
                            },
                            disk: {
                                icon: opt(colors.pink),
                                bar: opt(colors.pink),
                                label: opt(colors.pink),
                            },
                        }
                    },
                    notifications: {
                        background: opt(colors.mantle),
                        card: opt(colors.base),
                        border: opt(colors.surface0),
                        switch_divider: opt(colors.surface1),
                        switch: {
                            enabled: opt(colors.lavender),
                            disabled: opt(colors.surface0),
                            puck: opt(colors.overlay0)
                        },
                        clear: {
                            background: opt(colors.red),
                            font: opt(colors.crust)
                        }
                    },
                }
            }
        }
    },

    font: {
        size: opt(13),
        name: opt("Ubuntu Nerd Font"),
    },

    bar: {
        position: opt<"top" | "bottom">("top"),
        layout: {
            start: opt<Array<import("modules/bar/Bar").BarWidget>>([
                "dashboard",
                "workspaces",
                "windowtitle"
            ]),
            center: opt<Array<import("modules/bar/Bar").BarWidget>>([
                "media"
            ]),
            end: opt<Array<import("modules/bar/Bar").BarWidget>>([
                "volume",
                "network",
                "bluetooth",
                "systray",
                "clock",
                "notifications"
            ]),
        },
        launcher: {
            icon: opt(icon(distro.logo, icons.ui.search)),
        },
        workspaces: {
            show_icons: opt(false),
            icons: {
                available: opt(""),
                active: opt(""),
                occupied: opt(""),
            },
            workspaces: opt(7),
            monitorSpecific: opt(true),
        },
        media: {
            icon: opt(true),
            label: opt(true),
        },
        volume: {
            label: opt(true),
        },
        network: {
            status: {
                show: opt(true),
                type: opt<"status" | "connection">("connection"),
            },
        },
        bluetooth: {
            status: opt(true),
        },
        battery: {
            show_label: opt(true),
        },
        systray: {
            ignore: opt([
                "KDE Connect Indicator",
                "spotify-client",
            ]),
        },
        clock: {
            icons: {
                clock: opt(true),
                calendar: opt(true),
            },
            format: opt("%H:%M - %A %e."),
        },
        notifications: {
            show_total: opt(false)
        },
    },

    menus: {
        border: {
            enabled: opt(true),
            size: opt(""),
            outer_gap: opt(""),
            inner_gap: opt(""),
            radius: opt(""),
            card_radius: opt(""),
        },
        dashboard: {
            modules: opt([
                "powermenu",
                "shortcuts",
                "controls",
                "directories",
                "monitor",
            ]),
            order: {
                primary: opt([
                    "powermenu",
                    "shortcuts",
                    "controls",
                    "directories",
                    "monitor",
                ]),
                powermenu: opt([
                    "avatar",
                    "powermenu",
                ]),
                monitor: opt([
                    "cpu",
                    "ram",
                    "gpu",
                    "disk",
                ])
            },
            powermenu: {
                sleep: opt("systemctl suspend"),
                reboot: opt("systemctl reboot"),
                logout: opt("pkill Hyprland"),
                shutdown: opt("shutdown now"),
                avatar: {
                    image: opt<string>,
                    name: opt<"system" | string>("system"),
                },
            },
            shortcuts: {
                left: {
                    shortcut1: {
                        icon: opt(""),
                        command: opt("")
                    },
                    shortcut2: {
                        icon: opt(""),
                        command: opt("")
                    },
                    shortcut3: {
                        icon: opt(""),
                        command: opt("")
                    },
                    shortcut4: {
                        icon: opt(""),
                        command: opt("")
                    },
                },
                right: {
                    shortcut1: {
                        icon: opt(""),
                        command: opt("")
                    },
                    shortcut2: {
                        icon: opt(""),
                        command: opt("")
                    },
                    shortcut3: {
                        icon: opt(""),
                        command: opt("")
                    },
                    shortcut4: {
                        icon: opt(""),
                        command: opt("")
                    },
                }
            },
            directories: {
                left: {
                    directory1: {
                        label: opt(""),
                        command: opt("")
                    },
                    directory2: {
                        label: opt(""),
                        command: opt("")
                    },
                    directory3: {
                        label: opt(""),
                        command: opt("")
                    },
                },
                right: {
                    directory1: {
                        label: opt(""),
                        command: opt("")
                    },
                    directory2: {
                        label: opt(""),
                        command: opt("")
                    },
                    directory3: {
                        label: opt(""),
                        command: opt("")
                    },
                }
            },
        },
        volume: {
            order: opt([
                "volume",
                "devices",
            ])
        },
        network: {
            order: opt([
                "ethernet",
                "wifi",
            ]),
            status: opt(true),
        },
        bluetooth: {
            status: opt(true),
        },
        battery: {
            modules: opt([
                "brightness",
                "powerprofile"
            ]),
            order: opt([
                "brightness",
                "powerprofile"
            ])
        },
        clock: {
            modules: opt([
                "clock",
                "calendar",
                "weather"
            ]),
            order: opt([
                "clock",
                "calendar",
                "weather"
            ]),
            time: {
                military: opt(false),
                seconds: opt(true)
            },
            weather: {
                hourly: opt(true),
                interval: opt(60_000),
                unit: opt<"metric" | "imperial" | "standard">("metric"),
                key: opt<string>(
                    JSON.parse(Utils.readFile(`${App.configDir}/.weather`) || "{}")?.key || "",
                ),
            }
        }
    },

    overview: {
        scale: opt(9),
        workspaces: opt(7),
        monochromeIcon: opt(true),
    },

    powermenu: {
        sleep: opt("systemctl suspend"),
        reboot: opt("systemctl reboot"),
        logout: opt("pkill Hyprland"),
        shutdown: opt("shutdown now"),
        layout: opt<"line" | "box">("line"),
        labels: opt(true),
    },

    osd: {
        progress: {
            vertical: opt(true),
            pack: {
                h: opt<"start" | "center" | "end">("end"),
                v: opt<"start" | "center" | "end">("center"),
            },
        },
        microphone: {
            pack: {
                h: opt<"start" | "center" | "end">("center"),
                v: opt<"start" | "center" | "end">("end"),
            },
        },
    },

    notifications: {
        position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right"]),
        blacklist: opt(["Spotify"]),
    },
})

globalThis["options"] = options
export default options

