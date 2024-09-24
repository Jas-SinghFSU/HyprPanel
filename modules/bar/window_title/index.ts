const hyprland = await Service.import('hyprland');
import { BarBoxChild } from 'lib/types/bar';
import options from 'options';
import { Attribute, Child } from 'lib/types/widget';
import { ActiveClient } from 'types/service/hyprland';
import Label from 'types/widgets/label';
import { runAsyncCommand, throttledScrollHandler } from 'customModules/utils';
import Button from 'types/widgets/button';
import Gdk from 'types/@girs/gdk-3.0/gdk-3.0';

const { leftClick, rightClick, middleClick, scrollDown, scrollUp } = options.bar.windowtitle;

const filterTitle = (windowtitle: ActiveClient): Record<string, string> => {
    const windowTitleMap = [
        // user provided values
        ...options.bar.windowtitle.title_map.value,
        // Original Entries
        ['kitty', '󰄛', 'Kitty Terminal'],
        ['firefox', '󰈹', 'Firefox'],
        ['microsoft-edge', '󰇩', 'Edge'],
        ['discord', '', 'Discord'],
        ['vesktop', '', 'Vesktop'],
        ['org.kde.dolphin', '', 'Dolphin'],
        ['plex', '󰚺', 'Plex'],
        ['steam', '', 'Steam'],
        ['spotify', '󰓇', 'Spotify'],
        ['ristretto', '󰋩', 'Ristretto'],
        ['obsidian', '󱓧', 'Obsidian'],

        // Browsers
        ['google-chrome', '', 'Google Chrome'],
        ['brave-browser', '󰖟', 'Brave Browser'],
        ['chromium', '', 'Chromium'],
        ['opera', '', 'Opera'],
        ['vivaldi', '󰖟', 'Vivaldi'],
        ['waterfox', '󰖟', 'Waterfox'],
        ['thorium', '󰖟', 'Waterfox'],
        ['tor-browser', '', 'Tor Browser'],
        ['floorp', '󰈹', 'Floorp'],

        // Terminals
        ['gnome-terminal', '', 'GNOME Terminal'],
        ['konsole', '', 'Konsole'],
        ['alacritty', '', 'Alacritty'],
        ['wezterm', '', 'Wezterm'],
        ['foot', '󰽒', 'Foot Terminal'],
        ['tilix', '', 'Tilix'],
        ['xterm', '', 'XTerm'],
        ['urxvt', '', 'URxvt'],
        ['st', '', 'st Terminal'],

        // Development Tools
        ['code', '󰨞', 'Visual Studio Code'],
        ['vscode', '󰨞', 'VS Code'],
        ['sublime-text', '', 'Sublime Text'],
        ['atom', '', 'Atom'],
        ['android-studio', '󰀴', 'Android Studio'],
        ['intellij-idea', '', 'IntelliJ IDEA'],
        ['pycharm', '󱃖', 'PyCharm'],
        ['webstorm', '󱃖', 'WebStorm'],
        ['phpstorm', '󱃖', 'PhpStorm'],
        ['eclipse', '', 'Eclipse'],
        ['netbeans', '', 'NetBeans'],
        ['docker', '', 'Docker'],
        ['vim', '', 'Vim'],
        ['neovim', '', 'Neovim'],
        ['neovide', '', 'Neovide'],
        ['emacs', '', 'Emacs'],

        // Communication Tools
        ['slack', '󰒱', 'Slack'],
        ['telegram-desktop', '', 'Telegram'],
        ['org.telegram.desktop', '', 'Telegram'],
        ['whatsapp', '󰖣', 'WhatsApp'],
        ['teams', '󰊻', 'Microsoft Teams'],
        ['skype', '󰒯', 'Skype'],
        ['thunderbird', '', 'Thunderbird'],

        // File Managers
        ['nautilus', '󰝰', 'Files (Nautilus)'],
        ['thunar', '󰝰', 'Thunar'],
        ['pcmanfm', '󰝰', 'PCManFM'],
        ['nemo', '󰝰', 'Nemo'],
        ['ranger', '󰝰', 'Ranger'],
        ['doublecmd', '󰝰', 'Double Commander'],
        ['krusader', '󰝰', 'Krusader'],

        // Media Players
        ['vlc', '󰕼', 'VLC Media Player'],
        ['mpv', '', 'MPV'],
        ['rhythmbox', '󰓃', 'Rhythmbox'],

        // Graphics Tools
        ['gimp', '', 'GIMP'],
        ['inkscape', '', 'Inkscape'],
        ['krita', '', 'Krita'],
        ['blender', '󰂫', 'Blender'],

        // Video Editing
        ['kdenlive', '', 'Kdenlive'],

        // Games and Gaming Platforms
        ['lutris', '󰺵', 'Lutris'],
        ['heroic', '󰺵', 'Heroic Games Launcher'],
        ['minecraft', '󰍳', 'Minecraft'],
        ['csgo', '󰺵', 'CS:GO'],
        ['dota2', '󰺵', 'Dota 2'],

        // Office and Productivity
        ['evernote', '', 'Evernote'],
        ['sioyek', '', 'Sioyek'],

        // Cloud Services and Sync
        ['dropbox', '󰇣', 'Dropbox'],

        // Desktop
        ['^$', '󰇄', 'Desktop'],

        // Fallback icon
        ['(.+)', '󰣆', `${windowtitle.class.charAt(0).toUpperCase() + windowtitle.class.slice(1)}`],
    ];

    const foundMatch = windowTitleMap.find((wt) => RegExp(wt[0]).test(windowtitle.class.toLowerCase()));

    // return the default icon if no match is found or
    // if the array element matched is not of size 3
    if (!foundMatch || foundMatch.length !== 3) {
        return {
            icon: windowTitleMap[windowTitleMap.length - 1][1],
            label: windowTitleMap[windowTitleMap.length - 1][2],
        };
    }

    return {
        icon: foundMatch[1],
        label: foundMatch[2],
    };
};

const getTitle = (client: ActiveClient, useCustomTitle: boolean, useClassName: boolean): string => {
    if (useCustomTitle) return filterTitle(client).label;
    if (useClassName) return client.class;

    const title = client.title;
    // If the title is empty or only filled with spaces, fallback to the class name
    if (title.length === 0 || title.match(/^ *$/)) {
        return client.class;
    }
    return title;
};

const truncateTitle = (title: string, max_size: number): string => {
    if (max_size > 0 && title.length > max_size) {
        return title.substring(0, max_size).trim() + '...';
    }
    return title;
};

const ClientTitle = (): BarBoxChild => {
    const { custom_title, class_name, label, icon, truncation, truncation_size } = options.bar.windowtitle;

    return {
        component: Widget.Box({
            className: Utils.merge(
                [options.theme.bar.buttons.style.bind('value'), label.bind('value')],
                (style, showLabel) => {
                    const styleMap = {
                        default: 'style1',
                        split: 'style2',
                        wave: 'style3',
                        wave2: 'style3',
                    };
                    return `windowtitle-container ${styleMap[style]} ${!showLabel ? 'no-label' : ''}`;
                },
            ),
            children: Utils.merge(
                [
                    hyprland.active.bind('client'),
                    custom_title.bind('value'),
                    class_name.bind('value'),
                    label.bind('value'),
                    icon.bind('value'),
                    truncation.bind('value'),
                    truncation_size.bind('value'),
                ],
                (client, useCustomTitle, useClassName, showLabel, showIcon, truncate, truncationSize) => {
                    const children: Label<Child>[] = [];
                    if (showIcon) {
                        children.push(
                            Widget.Label({
                                class_name: 'bar-button-icon windowtitle txt-icon bar',
                                label: filterTitle(client).icon,
                            }),
                        );
                    }

                    if (showLabel) {
                        children.push(
                            Widget.Label({
                                class_name: `bar-button-label windowtitle ${showIcon ? '' : 'no-icon'}`,
                                label: truncateTitle(
                                    getTitle(client, useCustomTitle, useClassName),
                                    truncate ? truncationSize : -1,
                                ),
                            }),
                        );
                    }

                    return children;
                },
            ),
        }),
        isVisible: true,
        boxClass: 'windowtitle',
        props: {
            setup: (self: Button<Child, Attribute>): void => {
                self.hook(options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.value);

                    self.on_primary_click = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        runAsyncCommand(leftClick.value, { clicked, event });
                    };
                    self.on_secondary_click = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        runAsyncCommand(rightClick.value, { clicked, event });
                    };
                    self.on_middle_click = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        runAsyncCommand(middleClick.value, { clicked, event });
                    };
                    self.on_scroll_up = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        throttledHandler(scrollUp.value, { clicked, event });
                    };
                    self.on_scroll_down = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        throttledHandler(scrollDown.value, { clicked, event });
                    };
                });
            },
        },
    };
};

export { ClientTitle };
