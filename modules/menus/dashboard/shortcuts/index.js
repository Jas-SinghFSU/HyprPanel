const hyprland = await Service.import("hyprland");
import options from "options";

const { left, right } = options.menus.dashboard.shortcuts;

const Shortcuts = () => {
    const isRecording = Variable(false, {
        poll: [
            1000,
            `${App.configDir}/services/screen_record.sh status`,
            (out) => {
                if (out === "recording") {
                    return true;
                }
                return false;
            },
        ],
    });
    const handleClick = (action, resolver, tOut = 250) => {
        App.closeWindow("dashboardmenu");

        setTimeout(() => {
            Utils.execAsync(action)
                .then((res) => {
                    if (typeof resolver === "function") {
                        return resolver(res);
                    }

                    return res;
                })
                .catch((err) => err);
        }, tOut);
    };

    const recordingDropdown = Widget.Menu({
        class_name: "dropdown recording",
        hpack: "fill",
        hexpand: true,
        setup: (self) => {
            self.hook(hyprland, () => {
                const displays = hyprland.monitors.map((mon) => {
                    return Widget.MenuItem({
                        label: `Display ${mon.name}`,
                        on_activate: () => {
                            App.closeWindow("dashboardmenu");
                            Utils.execAsync(
                                `${App.configDir}/services/screen_record.sh start ${mon.name}`,
                            ).catch((err) => console.error(err));
                        },
                    });
                });

                const apps = hyprland.clients.map((clt) => {
                    return Widget.MenuItem({
                        label: `${clt.class.charAt(0).toUpperCase() + clt.class.slice(1)} (Workspace ${clt.workspace.name})`,
                        on_activate: () => {
                            App.closeWindow("dashboardmenu");
                            Utils.execAsync(
                                `${App.configDir}/services/screen_record.sh start ${clt.focusHistoryID}`,
                            ).catch((err) => console.error(err));
                        },
                    });
                });

                return (self.children = [
                    ...displays,
                    // Disabled since window recording isn't available on wayland
                    // ...apps
                ]);
            });
        },
    });

    return Widget.Box({
        class_name: "shortcuts-container",
        hpack: "fill",
        hexpand: true,
        children: [
            Widget.Box({
                class_name: "container most-used dashboard-card",
                hexpand: true,
                children: [
                    Widget.Box({
                        class_name: "card-button-left-section",
                        vertical: true,
                        hexpand: true,
                        children: [
                            Widget.Button({
                                tooltip_text: left.shortcut1.tooltip.bind("value"),
                                class_name: "dashboard-button top-button",
                                on_primary_click: left.shortcut1.command
                                    .bind("value")
                                    .as((cmd) => () => handleClick(cmd)),
                                child: Widget.Label({
                                    class_name: "button-label",
                                    label: left.shortcut1.icon.bind("value"),
                                }),
                            }),
                            Widget.Button({
                                tooltip_text: left.shortcut2.tooltip.bind("value"),
                                class_name: "dashboard-button",
                                on_primary_click: left.shortcut2.command
                                    .bind("value")
                                    .as((cmd) => () => handleClick(cmd)),
                                child: Widget.Label({
                                    class_name: "button-label",
                                    label: left.shortcut2.icon.bind("value"),
                                }),
                            }),
                        ],
                    }),
                    Widget.Box({
                        vertical: true,
                        hexpand: true,
                        children: [
                            Widget.Button({
                                tooltip_text: left.shortcut3.tooltip.bind("value"),
                                class_name: "dashboard-button top-button",
                                on_primary_click: left.shortcut3.command
                                    .bind("value")
                                    .as((cmd) => () => handleClick(cmd)),
                                child: Widget.Label({
                                    hpack: "center",
                                    class_name: "button-label",
                                    label: left.shortcut3.icon.bind("value"),
                                }),
                            }),
                            Widget.Button({
                                tooltip_text: left.shortcut4.tooltip.bind("value"),
                                class_name: "dashboard-button",
                                on_primary_click: left.shortcut4.command
                                    .bind("value")
                                    .as((cmd) => () => handleClick(cmd)),
                                child: Widget.Label({
                                    class_name: "button-label",
                                    label: left.shortcut4.icon.bind("value"),
                                }),
                            }),
                        ],
                    }),
                ],
            }),
            Widget.Box({
                class_name: "container utilities dashboard-card",
                hexpand: true,
                children: [
                    Widget.Box({
                        class_name: "card-button-left-section",
                        vertical: true,
                        hexpand: true,
                        children: [
                            Widget.Button({
                                tooltip_text: right.shortcut1.tooltip.bind("value"),
                                class_name: "dashboard-button top-button",
                                on_primary_click: right.shortcut1.command
                                    .bind("value")
                                    .as((cmd) => () => handleClick(cmd)),
                                child: Widget.Label({
                                    class_name: "button-label",
                                    label: right.shortcut1.icon.bind("value"),
                                }),
                            }),
                            Widget.Button({
                                tooltip_text: "HyprPanel Configuration",
                                class_name: "dashboard-button",
                                on_primary_click: () => {
                                    App.closeWindow("dashboardmenu");
                                    App.toggleWindow("settings-dialog");
                                },
                                child: Widget.Label({
                                    class_name: "button-label",
                                    label: "󰒓",
                                }),
                            }),
                        ],
                    }),
                    Widget.Box({
                        vertical: true,
                        hexpand: true,
                        children: [
                            Widget.Button({
                                tooltip_text: right.shortcut3.tooltip.bind("value"),
                                class_name: "dashboard-button top-button",
                                on_primary_click: right.shortcut3.command
                                    .bind("value")
                                    .as((cmd) => () => handleClick(cmd)),
                                child: Widget.Label({
                                    class_name: "button-label",
                                    label: right.shortcut3.icon.bind("value"),
                                }),
                            }),
                            Widget.Button({
                                tooltip_text: "Record Screen",
                                class_name: isRecording
                                    .bind("value")
                                    .as((v) => `dashboard-button record ${v ? "active" : ""}`),
                                setup: (self) => {
                                    self.hook(isRecording, () => {
                                        self.toggleClassName("hover", true);
                                        self.on_primary_click = (_, event) => {
                                            if (isRecording.value === true) {
                                                App.closeWindow("dashboardmenu");
                                                return Utils.execAsync(
                                                    `${App.configDir}/services/screen_record.sh stop`,
                                                ).catch((err) => console.error(err));
                                            } else {
                                                recordingDropdown.popup_at_pointer(event);
                                            }
                                        };
                                    });
                                },
                                child: Widget.Label({
                                    class_name: "button-label",
                                    label: "󰑊",
                                }),
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
};

export { Shortcuts };
