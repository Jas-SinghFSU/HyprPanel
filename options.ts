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
        bar: {
            transparent: opt(false),
            background: opt(colors.mantle),
            buttons: {
                monochrome: opt(true),
                background: opt(colors.base2),
                hover: opt(colors.surface1),
                text: opt(colors.lavender),
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
                windowtitle: {
                    background: opt(colors.base2),
                    text: opt(colors.pink)
                },
                media: {
                    background: opt(colors.base2),
                    text: opt(colors.lavender)
                },
                volume: {
                    background: opt(colors.base2),
                    text: opt(colors.maroon)
                },
                network: {
                    background: opt(colors.base2),
                    text: opt(colors.mauve)
                },
                bluetooth: {
                    background: opt(colors.base2),
                    text: opt(colors.sky)
                },
                systray: {
                    background: opt(colors.base2),
                },
                battery: {
                    background: opt(colors.base2),
                    text: opt(colors.yellow)
                },
                clock: {
                    background: opt(colors.base2),
                    text: opt(colors.pink)
                },
                notifications: {
                    background: opt(colors.base2),
                    text: opt(colors.lavender)
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
                    button: opt(colors.overlay0)

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
                notifications: {
                    background: opt(colors.base),
                    actions: {
                        background: opt(colors.surface0),
                        hover: opt(colors.surface1),
                        text: opt(colors.mantle),
                    },
                    label: opt(colors.lavender),
                    date: opt(colors.overlay1),
                    text: opt(colors.text),
                    labelicon: opt(colors.lavender)
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
                        card: opt(colors.base),
                        background: opt(colors.crust),
                        border: opt(colors.surface0),
                        label: opt(colors.maroon),
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
                        slider: {
                            primary: opt(colors.maroon),
                            background: opt(colors.surface2),
                            backgroundhover: opt(colors.surface1),
                            puck: opt(colors.overlay0)
                        }
                    },
                    network: {
                        card: opt(colors.base),
                        background: opt(colors.crust),
                        border: opt(colors.surface0),
                        label: opt(colors.mauve),
                        text: opt(colors.text),
                        status: opt(colors.overlay0),
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
                        card: opt(colors.base),
                        background: opt(colors.crust),
                        border: opt(colors.surface0),
                        label: opt(colors.sky),
                        text: opt(colors.text),
                        status: opt(colors.overlay0),
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
                        background: opt(colors.base2),
                        dropdownmenu: {
                            background: opt(colors.crust),
                            text: opt(colors.text),
                            divider: opt(colors.base)
                        },
                    },
                    battery: {
                        card: opt(colors.base),
                        background: opt(colors.crust),
                        border: opt(colors.surface0),
                        label: opt(colors.yellow),
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
                        card: opt(colors.base),
                        background: opt(colors.crust),
                        border: opt(colors.surface0),
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
                    notifications: {
                        background: opt(colors.base2),
                        text: opt(colors.lavender)
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
        corners: opt(true),
        transparent: opt(false),
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
            icon: {
                colored: opt(true),
                icon: opt(icon(distro.logo, icons.ui.search)),
            },
            label: {
                colored: opt(false),
                label: opt(" Applications"),
            },
            action: opt(() => App.toggleWindow("launcher")),
        },
        date: {
            format: opt("%H:%M - %A %e."),
            action: opt(() => App.toggleWindow("datemenu")),
        },
        battery: {
            bar: opt<"hidden" | "regular" | "whole">("regular"),
            charging: opt("#00D787"),
            percentage: opt(true),
            blocks: opt(7),
            low: opt(30),
        },
        workspaces: {
            workspaces: opt(7),
            monitorSpecific: opt(true),
        },
        taskbar: {
            iconSize: opt(0),
            monochrome: opt(true),
            exclusive: opt(false),
        },
        messages: {
            action: opt(() => App.toggleWindow("datemenu")),
        },
        systray: {
            ignore: opt([
                "KDE Connect Indicator",
                "spotify-client",
            ]),
        },
        media: {
            monochrome: opt(true),
            preferred: opt("spotify"),
            direction: opt<"left" | "right">("right"),
            format: opt("{artists} - {title}"),
            length: opt(40),
        },
        powermenu: {
            monochrome: opt(false),
            action: opt(() => App.toggleWindow("powermenu")),
        },
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

    quicksettings: {
        avatar: {
            image: opt(`/var/lib/AccountsService/icons/${Utils.USER}`),
            size: opt(70),
            name: opt("Linux User")
        },
    },

    calendarmenu: {
        position: opt<"left" | "center" | "right">("center"),
        weather: {
            interval: opt(60_000),
            unit: opt<"metric" | "imperial" | "standard">("metric"),
            key: opt<string>(
                JSON.parse(Utils.readFile(`${App.configDir}/.weather`) || "{}")?.key || "",
            ),
        },
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

