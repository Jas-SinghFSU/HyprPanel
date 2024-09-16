import { opt, mkOptions } from 'lib/option';
import {
    NetstatIcon,
    NetstatLabelType,
    PowerIcon,
    RateUnit,
    ResourceLabelType,
    StorageIcon,
    UpdatesIcon,
} from 'lib/types/bar';
import { KbIcon, KbLabelType } from 'lib/types/customModules/kbLayout';
import {
    ActiveWsIndicator,
    BarButtonStyles,
    BarLocation,
    NotificationAnchor,
    OSDAnchor,
    OSDOrientation,
    WindowLayer,
} from 'lib/types/options';
import { MatugenScheme, MatugenTheme, MatugenVariations } from 'lib/types/options';
import { UnitType } from 'lib/types/weather';
import { WorkspaceIcons, WorkspaceIconsColored } from 'lib/types/workspace';

// WARN: CHANGING THESE VALUES WILL PREVENT MATUGEN COLOR GENERATION FOR THE CHANGED VALUE
export const colors = {
    rosewater: '#f5e0dc',
    flamingo: '#f2cdcd',
    pink: '#f5c2e7',
    mauve: '#cba6f7',
    red: '#f38ba8',
    maroon: '#eba0ac',
    peach: '#fab387',
    yellow: '#f9e2af',
    green: '#a6e3a1',
    teal: '#94e2d5',
    sky: '#89dceb',
    sapphire: '#74c7ec',
    blue: '#89b4fa',
    lavender: '#b4befe',
    text: '#cdd6f4',
    subtext1: '#bac2de',
    subtext2: '#a6adc8',
    overlay2: '#9399b2',
    overlay1: '#7f849c',
    overlay0: '#6c7086',
    surface2: '#585b70',
    surface1: '#45475a',
    surface0: '#313244',
    base2: '#242438',
    base: '#1e1e2e',
    mantle: '#181825',
    crust: '#11111b',
};

// WARN: CHANGING THESE VALUES WILL PREVENT MATUGEN COLOR GENERATION FOR THE CHANGED VALUE
const secondary_colors = {
    text: '#cdd6f3',
    pink: '#f5c2e6',
    red: '#f38ba7',
    peach: '#fab386',
    mantle: '#181824',
    surface1: '#454759',
    surface0: '#313243',
    overlay1: '#7f849b',
    lavender: '#b4befd',
    mauve: '#cba6f6',
    green: '#a6e3a0',
    sky: '#89dcea',
    teal: '#94e2d4',
    yellow: '#f9e2ad',
    maroon: '#eba0ab',
    crust: '#11111a',
    surface2: '#585b69',
};

const tertiary_colors = {
    pink: '#f5c2e8',
    red: '#f38ba9',
    mantle: '#181826',
    surface0: '#313245',
    overlay1: '#7f849d',
    lavender: '#b4beff',
    mauve: '#cba6f8',
    green: '#a6e3a2',
    sky: '#89dcec',
    teal: '#94e2d6',
    yellow: '#f9e2ae',
    maroon: '#eba0ad',
    crust: '#11111c',
    surface2: '#585b71',
};

const options = mkOptions(OPTIONS, {
    theme: {
        matugen: opt(false),
        matugen_settings: {
            mode: opt<MatugenTheme>('dark'),
            scheme_type: opt<MatugenScheme>('tonal-spot'),
            variation: opt<MatugenVariations>('standard_1'),
            contrast: opt(0.0),
        },
        font: {
            size: opt('1.2rem'),
            name: opt('Ubuntu Nerd Font'),
            weight: opt(600),
        },
        notification: {
            scaling: opt(100),
            background: opt(tertiary_colors.mantle),
            opacity: opt(100),
            actions: {
                background: opt(secondary_colors.lavender),
                text: opt(colors.mantle),
            },
            label: opt(colors.lavender),
            border: opt(secondary_colors.surface0),
            border_radius: opt('0.6em'),
            time: opt(secondary_colors.overlay1),
            text: opt(colors.text),
            labelicon: opt(colors.lavender),
            close_button: {
                background: opt(secondary_colors.red),
                label: opt(colors.crust),
            },
        },
        osd: {
            scaling: opt(100),
            duration: opt(2500),
            enable: opt(true),
            orientation: opt<OSDOrientation>('vertical'),
            opacity: opt(100),
            bar_container: opt(colors.crust),
            icon_container: opt(tertiary_colors.lavender),
            bar_color: opt(tertiary_colors.lavender),
            bar_empty_color: opt(colors.surface0),
            bar_overflow_color: opt(secondary_colors.red),
            icon: opt(colors.crust),
            label: opt(tertiary_colors.lavender),
            monitor: opt(0),
            active_monitor: opt(true),
            radius: opt('0.4em'),
            margins: opt('0px 5px 0px 0px'),
            location: opt<OSDAnchor>('right'),
            muted_zero: opt(false),
        },
        bar: {
            scaling: opt(100),
            floating: opt(false),
            location: opt<BarLocation>('top'),
            layer: opt<WindowLayer>('top'),
            margin_top: opt('0.5em'),
            opacity: opt(100),
            margin_bottom: opt('0em'),
            margin_sides: opt('0.5em'),
            border_radius: opt('0.4em'),
            outer_spacing: opt('1.6em'),
            label_spacing: opt('0.5em'),
            transparent: opt(false),
            dropdownGap: opt('2.9em'),
            background: opt(colors.crust),
            buttons: {
                style: opt<BarButtonStyles>('default'),
                monochrome: opt(false),
                spacing: opt('0.25em'),
                padding_x: opt('0.7rem'),
                padding_y: opt('0.2rem'),
                y_margins: opt('0.4em'),
                radius: opt('0.3em'),
                opacity: opt(100),
                background_opacity: opt(100),
                background_hover_opacity: opt(100),
                background: opt(colors.base2),
                icon_background: opt(colors.base2),
                hover: opt(colors.surface1),
                text: opt(colors.lavender),
                icon: opt(colors.lavender),
                dashboard: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    icon: opt(colors.yellow),
                    spacing: opt('0.5em'),
                },
                workspaces: {
                    background: opt(colors.base2),
                    hover: opt(colors.pink),
                    available: opt(colors.sky),
                    occupied: opt(colors.flamingo),
                    active: opt(colors.pink),
                    numbered_active_highlight_border: opt('0.2em'),
                    numbered_active_highlight_padding: opt('0.2em'),
                    numbered_active_highlighted_text_color: opt(colors.mantle),
                    numbered_active_underline_color: opt(colors.pink),
                    spacing: opt('0.5em'),
                    fontSize: opt('1.2em'),
                },
                windowtitle: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.pink),
                    icon: opt(colors.pink),
                    icon_background: opt(colors.base2),
                    spacing: opt('0.5em'),
                },
                media: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.lavender),
                    icon: opt(colors.lavender),
                    icon_background: opt(colors.base2),
                    spacing: opt('0.5em'),
                },
                volume: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.maroon),
                    icon: opt(colors.maroon),
                    icon_background: opt(colors.base2),
                    spacing: opt('0.5em'),
                },
                network: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.mauve),
                    icon: opt(colors.mauve),
                    icon_background: opt(colors.base2),
                    spacing: opt('0.5em'),
                },
                bluetooth: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.sky),
                    icon: opt(colors.sky),
                    icon_background: opt(colors.base2),
                    spacing: opt('0.5em'),
                },
                systray: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    spacing: opt('0.5em'),
                },
                battery: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.yellow),
                    icon: opt(colors.yellow),
                    icon_background: opt(colors.base2),
                    spacing: opt('0.5em'),
                },
                clock: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    text: opt(colors.pink),
                    icon: opt(colors.pink),
                    icon_background: opt(colors.base2),
                    spacing: opt('0.5em'),
                },
                notifications: {
                    background: opt(colors.base2),
                    hover: opt(colors.surface1),
                    icon: opt(colors.lavender),
                    icon_background: opt(colors.base2),
                    total: opt(colors.lavender),
                    spacing: opt('0.5em'),
                },
                modules: {
                    ram: {
                        background: opt(colors.base2),
                        text: opt(colors.yellow),
                        icon: opt(colors.yellow),
                        icon_background: opt(colors.base2),
                        spacing: opt('0.45em'),
                    },
                    cpu: {
                        background: opt(colors.base2),
                        text: opt(colors.red),
                        icon: opt(colors.red),
                        icon_background: opt(colors.base2),
                        spacing: opt('0.5em'),
                    },
                    storage: {
                        background: opt(colors.base2),
                        text: opt(colors.pink),
                        icon: opt(colors.pink),
                        icon_background: opt(colors.base2),
                        spacing: opt('0.45em'),
                    },
                    netstat: {
                        background: opt(colors.base2),
                        text: opt(colors.green),
                        icon: opt(colors.green),
                        icon_background: opt(colors.base2),
                        spacing: opt('0.45em'),
                    },
                    kbLayout: {
                        background: opt(colors.base2),
                        text: opt(colors.sky),
                        icon: opt(colors.sky),
                        icon_background: opt(colors.base2),
                        spacing: opt('0.45em'),
                    },
                    updates: {
                        background: opt(colors.base2),
                        text: opt(colors.mauve),
                        icon: opt(colors.mauve),
                        icon_background: opt(colors.base2),
                        spacing: opt('0.45em'),
                    },
                    weather: {
                        background: opt(colors.base2),
                        text: opt(colors.lavender),
                        icon: opt(colors.lavender),
                        icon_background: opt(colors.base2),
                        spacing: opt('0.45em'),
                    },
                    power: {
                        background: opt(colors.base2),
                        icon: opt(colors.red),
                        icon_background: opt(colors.base2),
                        spacing: opt('0.45em'),
                    },
                },
            },
            menus: {
                monochrome: opt(false),
                background: opt(colors.crust),
                opacity: opt(100),
                cards: opt(colors.base),
                card_radius: opt('0.4em'),
                border: {
                    size: opt('0.13em'),
                    radius: opt('0.7em'),
                    color: opt(colors.surface0),
                },
                text: opt(colors.text),
                dimtext: opt(colors.surface2),
                feinttext: opt(colors.surface0),
                label: opt(colors.lavender),
                popover: {
                    text: opt(colors.lavender),
                    background: opt(secondary_colors.mantle),
                    border: opt(secondary_colors.mantle),
                },
                listitems: {
                    passive: opt(colors.text),
                    active: opt(secondary_colors.lavender),
                },
                icons: {
                    passive: opt(colors.surface2),
                    active: opt(colors.lavender),
                },
                switch: {
                    enabled: opt(colors.lavender),
                    disabled: opt(tertiary_colors.surface0),
                    puck: opt(secondary_colors.surface1),
                },
                check_radio_button: {
                    background: opt(colors.surface1),
                    active: opt(tertiary_colors.lavender),
                },
                buttons: {
                    default: opt(colors.lavender),
                    active: opt(secondary_colors.pink),
                    disabled: opt(tertiary_colors.surface2),
                    text: opt(secondary_colors.mantle),
                },
                iconbuttons: {
                    passive: opt(secondary_colors.text),
                    active: opt(tertiary_colors.lavender),
                },
                progressbar: {
                    foreground: opt(colors.lavender),
                    background: opt(colors.surface1),
                },
                slider: {
                    primary: opt(colors.lavender),
                    background: opt(tertiary_colors.surface2),
                    backgroundhover: opt(colors.surface1),
                    puck: opt(colors.overlay0),
                },
                dropdownmenu: {
                    background: opt(colors.crust),
                    text: opt(colors.text),
                    divider: opt(colors.base),
                },
                tooltip: {
                    background: opt(colors.crust),
                    text: opt(tertiary_colors.lavender),
                },
                menu: {
                    media: {
                        scaling: opt(100),
                        song: opt(tertiary_colors.lavender),
                        artist: opt(tertiary_colors.teal),
                        album: opt(tertiary_colors.pink),
                        background: {
                            color: opt(colors.crust),
                        },
                        card: {
                            color: opt(colors.base),
                            tint: opt(85),
                        },
                        border: {
                            color: opt(colors.surface0),
                        },
                        buttons: {
                            inactive: opt(colors.surface2),
                            enabled: opt(secondary_colors.teal),
                            background: opt(tertiary_colors.lavender),
                            text: opt(colors.crust),
                        },
                        slider: {
                            primary: opt(colors.pink),
                            background: opt(tertiary_colors.surface2),
                            backgroundhover: opt(colors.surface1),
                            puck: opt(colors.overlay0),
                        },
                    },
                    volume: {
                        scaling: opt(100),
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
                            active: opt(secondary_colors.maroon),
                        },
                        iconbutton: {
                            passive: opt(colors.text),
                            active: opt(colors.maroon),
                        },
                        icons: {
                            passive: opt(colors.overlay2),
                            active: opt(colors.maroon),
                        },
                        audio_slider: {
                            primary: opt(colors.maroon),
                            background: opt(tertiary_colors.surface2),
                            backgroundhover: opt(colors.surface1),
                            puck: opt(colors.surface2),
                        },
                        input_slider: {
                            primary: opt(colors.maroon),
                            background: opt(tertiary_colors.surface2),
                            backgroundhover: opt(colors.surface1),
                            puck: opt(colors.surface2),
                        },
                    },
                    network: {
                        scaling: opt(100),
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
                            active: opt(secondary_colors.mauve),
                        },
                        icons: {
                            passive: opt(colors.overlay2),
                            active: opt(colors.mauve),
                        },
                        iconbuttons: {
                            passive: opt(colors.text),
                            active: opt(colors.mauve),
                        },
                    },
                    bluetooth: {
                        scaling: opt(100),
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
                            disabled: opt(tertiary_colors.surface0),
                            puck: opt(secondary_colors.surface1),
                        },
                        listitems: {
                            passive: opt(colors.text),
                            active: opt(secondary_colors.sky),
                        },
                        icons: {
                            passive: opt(colors.overlay2),
                            active: opt(colors.sky),
                        },
                        iconbutton: {
                            passive: opt(colors.text),
                            active: opt(colors.sky),
                        },
                    },
                    systray: {
                        dropdownmenu: {
                            background: opt(colors.crust),
                            text: opt(colors.text),
                            divider: opt(colors.base),
                        },
                    },
                    battery: {
                        scaling: opt(100),
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
                            passive: opt(secondary_colors.text),
                            active: opt(colors.yellow),
                        },
                        icons: {
                            passive: opt(colors.overlay2),
                            active: opt(colors.yellow),
                        },
                        slider: {
                            primary: opt(colors.yellow),
                            background: opt(tertiary_colors.surface2),
                            backgroundhover: opt(colors.surface1),
                            puck: opt(colors.overlay0),
                        },
                    },
                    clock: {
                        scaling: opt(100),
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
                            paginator: opt(secondary_colors.pink),
                            currentday: opt(colors.pink),
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
                                temperature: opt(colors.pink),
                            },
                        },
                    },
                    dashboard: {
                        scaling: opt(100),
                        confirmation_scaling: opt(100),
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
                            name: opt(colors.pink),
                            size: opt('8.5em'),
                            radius: opt('0.4em'),
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
                                label: opt(colors.lavender),
                                body: opt(colors.text),
                                confirm: opt(colors.green),
                                deny: opt(colors.red),
                                button_text: opt(secondary_colors.crust),
                            },
                        },
                        shortcuts: {
                            background: opt(colors.lavender),
                            text: opt(secondary_colors.mantle),
                            recording: opt(colors.green),
                        },
                        controls: {
                            disabled: opt(colors.surface2),
                            wifi: {
                                background: opt(colors.mauve),
                                text: opt(secondary_colors.mantle),
                            },
                            bluetooth: {
                                background: opt(colors.sky),
                                text: opt(secondary_colors.mantle),
                            },
                            notifications: {
                                background: opt(colors.yellow),
                                text: opt(secondary_colors.mantle),
                            },
                            volume: {
                                background: opt(colors.maroon),
                                text: opt(secondary_colors.mantle),
                            },
                            input: {
                                background: opt(colors.pink),
                                text: opt(secondary_colors.mantle),
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
                            },
                        },
                        monitors: {
                            bar_background: opt(colors.surface1),
                            cpu: {
                                icon: opt(colors.maroon),
                                bar: opt(tertiary_colors.maroon),
                                label: opt(colors.maroon),
                            },
                            ram: {
                                icon: opt(colors.yellow),
                                bar: opt(tertiary_colors.yellow),
                                label: opt(colors.yellow),
                            },
                            gpu: {
                                icon: opt(colors.green),
                                bar: opt(tertiary_colors.green),
                                label: opt(colors.green),
                            },
                            disk: {
                                icon: opt(colors.pink),
                                bar: opt(tertiary_colors.pink),
                                label: opt(colors.pink),
                            },
                        },
                    },
                    power: {
                        scaling: opt(90),
                        radius: opt('0.4em'),
                        background: {
                            color: opt(colors.crust),
                        },
                        border: {
                            color: opt(colors.surface0),
                        },
                        buttons: {
                            shutdown: {
                                background: opt(colors.base),
                                icon_background: opt(secondary_colors.red),
                                text: opt(colors.red),
                                icon: opt(secondary_colors.mantle),
                            },
                            restart: {
                                background: opt(colors.base),
                                icon_background: opt(secondary_colors.peach),
                                text: opt(colors.peach),
                                icon: opt(secondary_colors.mantle),
                            },
                            logout: {
                                background: opt(colors.base),
                                icon_background: opt(secondary_colors.green),
                                text: opt(colors.green),
                                icon: opt(secondary_colors.mantle),
                            },
                            sleep: {
                                background: opt(colors.base),
                                icon_background: opt(secondary_colors.sky),
                                text: opt(colors.sky),
                                icon: opt(secondary_colors.mantle),
                            },
                        },
                    },
                    notifications: {
                        scaling: opt(100),
                        height: opt('58em'),
                        label: opt(colors.lavender),
                        no_notifications_label: opt(colors.surface0),
                        background: opt(colors.crust),
                        card: opt(colors.base),
                        border: opt(colors.surface0),
                        switch_divider: opt(colors.surface1),
                        clear: opt(colors.red),
                        switch: {
                            enabled: opt(colors.lavender),
                            disabled: opt(tertiary_colors.surface0),
                            puck: opt(secondary_colors.surface1),
                        },
                        pager: {
                            show: opt(true),
                            background: opt(colors.crust),
                            button: opt(colors.lavender),
                            label: opt(colors.overlay2),
                        },
                        scrollbar: {
                            color: opt(colors.lavender),
                            width: opt('0.35em'),
                            radius: opt('0.2em'),
                        },
                    },
                },
            },
        },
    },

    bar: {
        layouts: opt({
            '1': {
                left: ['dashboard', 'workspaces', 'windowtitle'],
                middle: ['media'],
                right: ['volume', 'clock', 'notifications'],
            },
            '2': {
                left: ['dashboard', 'workspaces', 'windowtitle'],
                middle: ['media'],
                right: ['volume', 'clock', 'notifications'],
            },
            '0': {
                left: ['dashboard', 'workspaces', 'windowtitle'],
                middle: ['media'],
                right: ['volume', 'network', 'bluetooth', 'battery', 'systray', 'clock', 'notifications'],
            },
        }),
        launcher: {
            icon: opt('󰣇'),
        },
        windowtitle: {
            custom_title: opt(true),
            title_map: opt([]),
            class_name: opt(true),
            label: opt(true),
            icon: opt(true),
            truncation: opt(true),
            truncation_size: opt(50),
        },
        workspaces: {
            show_icons: opt(false),
            show_numbered: opt(false),
            showWsIcons: opt(false),
            numbered_active_indicator: opt<ActiveWsIndicator>('underline'),
            icons: {
                available: opt(''),
                active: opt(''),
                occupied: opt(''),
            },
            workspaceIconMap: opt<WorkspaceIcons | WorkspaceIconsColored>({}),
            workspaces: opt(10),
            spacing: opt(1),
            monitorSpecific: opt(true),
            hideUnoccupied: opt(false),
            workspaceMask: opt(false),
            reverse_scroll: opt(false),
            scroll_speed: opt(5),
        },
        volume: {
            label: opt(true),
        },
        network: {
            truncation: opt(true),
            truncation_size: opt(7),
            label: opt(true),
        },
        bluetooth: {
            label: opt(true),
        },
        battery: {
            label: opt(true),
        },
        systray: {
            ignore: opt<string[]>([]),
        },
        clock: {
            icon: opt('󰸗'),
            showIcon: opt(true),
            showTime: opt(true),
            format: opt('%a %b %d  %I:%M:%S %p'),
        },
        media: {
            show_artist: opt(false),
            truncation: opt(true),
            show_label: opt(true),
            truncation_size: opt(30),
            show_active_only: opt(false),
        },
        notifications: {
            show_total: opt(false),
        },
        customModules: {
            scrollSpeed: opt(5),
            ram: {
                label: opt(true),
                labelType: opt<ResourceLabelType>('percentage'),
                round: opt(true),
                pollingInterval: opt(2000),
                leftClick: opt(''),
                rightClick: opt(''),
                middleClick: opt(''),
            },
            cpu: {
                label: opt(true),
                round: opt(true),
                pollingInterval: opt(2000),
                leftClick: opt(''),
                rightClick: opt(''),
                middleClick: opt(''),
                scrollUp: opt(''),
                scrollDown: opt(''),
            },
            storage: {
                label: opt(true),
                icon: opt<StorageIcon>('󰋊'),
                round: opt(false),
                labelType: opt<ResourceLabelType>('percentage'),
                pollingInterval: opt(2000),
                leftClick: opt(''),
                rightClick: opt(''),
                middleClick: opt(''),
            },
            netstat: {
                label: opt(true),
                networkInterface: opt(''),
                icon: opt<NetstatIcon>('󰖟'),
                round: opt(true),
                labelType: opt<NetstatLabelType>('full'),
                rateUnit: opt<RateUnit>('auto'),
                pollingInterval: opt(2000),
                leftClick: opt(''),
                rightClick: opt(''),
                middleClick: opt(''),
            },
            kbLayout: {
                label: opt(true),
                labelType: opt<KbLabelType>('code'),
                icon: opt<KbIcon>('󰌌'),
                leftClick: opt(''),
                rightClick: opt(''),
                middleClick: opt(''),
                scrollUp: opt(''),
                scrollDown: opt(''),
            },
            updates: {
                updateCommand: opt('$HOME/.config/ags/scripts/checkUpdates.sh -arch'),
                label: opt(true),
                padZero: opt(true),
                icon: opt<UpdatesIcon>('󰏖'),
                pollingInterval: opt(1000 * 60 * 60 * 6),
                leftClick: opt(''),
                rightClick: opt(''),
                middleClick: opt(''),
                scrollUp: opt(''),
                scrollDown: opt(''),
            },
            weather: {
                label: opt(true),
                unit: opt<UnitType>('imperial'),
                leftClick: opt(''),
                rightClick: opt(''),
                middleClick: opt(''),
                scrollUp: opt(''),
                scrollDown: opt(''),
            },
            power: {
                icon: opt<PowerIcon>(''),
                showLabel: opt(true),
                leftClick: opt('menu:powerdropdown'),
                rightClick: opt(''),
                middleClick: opt(''),
                scrollUp: opt(''),
                scrollDown: opt(''),
            },
        },
    },

    menus: {
        power: {
            showLabel: opt(true),
            confirmation: opt(true),
            sleep: opt('systemctl suspend'),
            reboot: opt('systemctl reboot'),
            logout: opt('pkill Hyprland'),
            shutdown: opt('shutdown now'),
        },
        dashboard: {
            powermenu: {
                confirmation: opt(true),
                sleep: opt('systemctl suspend'),
                reboot: opt('systemctl reboot'),
                logout: opt('pkill Hyprland'),
                shutdown: opt('shutdown now'),
                avatar: {
                    image: opt('avatar-default-symbolic'),
                    name: opt<'system' | string>('system'),
                },
            },
            stats: {
                enable_gpu: opt(false),
            },
            shortcuts: {
                left: {
                    shortcut1: {
                        icon: opt('󰇩'),
                        tooltip: opt('Microsoft Edge'),
                        command: opt('microsoft-edge-stable'),
                    },
                    shortcut2: {
                        icon: opt(''),
                        tooltip: opt('Spotify'),
                        command: opt('spotify-launcher'),
                    },
                    shortcut3: {
                        icon: opt(''),
                        tooltip: opt('Discord'),
                        command: opt('discord'),
                    },
                    shortcut4: {
                        icon: opt(''),
                        tooltip: opt('Search Apps'),
                        command: opt('rofi -show drun'),
                    },
                },
                right: {
                    shortcut1: {
                        icon: opt(''),
                        tooltip: opt('Color Picker'),
                        command: opt('hyprpicker -a'),
                    },
                    shortcut3: {
                        icon: opt('󰄀'),
                        tooltip: opt('Screenshot'),
                        command: opt('bash -c "$HOME/.config/ags/services/snapshot.sh"'),
                    },
                },
            },
            directories: {
                left: {
                    directory1: {
                        label: opt('󰉍 Downloads'),
                        command: opt('bash -c "dolphin $HOME/Downloads/"'),
                    },
                    directory2: {
                        label: opt('󰉏 Videos'),
                        command: opt('bash -c "dolphin $HOME/Videos/"'),
                    },
                    directory3: {
                        label: opt('󰚝 Projects'),
                        command: opt('bash -c "dolphin $HOME/Projects/"'),
                    },
                },
                right: {
                    directory1: {
                        label: opt('󱧶 Documents'),
                        command: opt('bash -c "dolphin $HOME/Documents/"'),
                    },
                    directory2: {
                        label: opt('󰉏 Pictures'),
                        command: opt('bash -c "dolphin $HOME/Pictures/"'),
                    },
                    directory3: {
                        label: opt('󱂵 Home'),
                        command: opt('bash -c "dolphin $HOME/"'),
                    },
                },
            },
        },
        clock: {
            time: {
                military: opt(false),
            },
            weather: {
                interval: opt(60000),
                unit: opt<UnitType>('imperial'),
                location: opt('Los Angeles'),
                key: opt<string>(
                    JSON.parse(Utils.readFile(`${App.configDir}/.weather.json`) || '{}')?.weather_api_key || '',
                ),
            },
        },
    },

    terminal: opt('kitty'),

    tear: opt(false),

    wallpaper: {
        enable: opt(true),
        image: opt(''),
        pywal: opt(false),
    },

    notifications: {
        position: opt<NotificationAnchor>('top right'),
        ignore: opt<string[]>([]),
        displayedTotal: opt(10),
        monitor: opt(0),
        active_monitor: opt(true),
        timeout: opt(7000),
        cache_actions: opt(true),
    },

    dummy: opt(true),
});

globalThis['options'] = options;
export default options;
