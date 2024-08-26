const hyprland = await Service.import("hyprland");
import options from "options";
import { createThrottledScrollHandlers, getCurrentMonitorWorkspaces, getWorkspaceRules, getWorkspacesForMonitor } from "./helpers";

const {
    workspaces,
    monitorSpecific,
    workspaceMask,
    scroll_speed,
    spacing
} = options.bar.workspaces;

function range(length: number, start = 1) {
    return Array.from({ length }, (_, i) => i + start);
}

const Workspaces = (monitor = -1) => {
    const currentMonitorWorkspaces = Variable(getCurrentMonitorWorkspaces(monitor));

    workspaces.connect("changed", () => {
        currentMonitorWorkspaces.value = getCurrentMonitorWorkspaces(monitor)
    })

    const renderClassnames = (showIcons: boolean, showNumbered: boolean, numberedActiveIndicator: string, i: number) => {
        if (showIcons) {
            return `workspace-icon txt-icon bar`;
        }
        if (showNumbered) {
            const numActiveInd = hyprland.active.workspace.id === i
                ? numberedActiveIndicator
                : "";

            return `workspace-number can_${numberedActiveIndicator} ${numActiveInd}`;
        }
        return "default";
    }

    const renderLabel = (showIcons: boolean, available: string, active: string, occupied: string, workspaceMask: boolean, i: number, index: number) => {
        if (showIcons) {
            if (hyprland.active.workspace.id === i) {
                return active;
            }
            if ((hyprland.getWorkspace(i)?.windows || 0) > 0) {
                return occupied;
            }
            if (
                monitor !== -1
            ) {
                return available;
            }
        }
        return workspaceMask
            ? `${index + 1}`
            : `${i}`;
    }
    const defaultWses = () => {
        return Widget.Box({
            children: Utils.merge(
                [workspaces.bind(), monitorSpecific.bind()],
                (workspaces, monitorSpecific) => {
                    return range(workspaces || 8)
                        .filter((i) => {
                            if (!monitorSpecific) {
                                return true;
                            }
                            const workspaceRules = getWorkspaceRules();
                            return getWorkspacesForMonitor(i, workspaceRules, monitor);
                        })
                        .map((i, index) => {
                            return Widget.Button({
                                class_name: "workspace-button",
                                on_primary_click: () => {
                                    hyprland.messageAsync(`dispatch workspace ${i}`)

                                },
                                child: Widget.Label({
                                    attribute: i,
                                    vpack: "center",
                                    css: spacing.bind("value").as(sp => `margin: 0rem ${0.375 * sp}rem;`),
                                    class_name: Utils.merge(
                                        [
                                            options.bar.workspaces.show_icons.bind("value"),
                                            options.bar.workspaces.show_numbered.bind("value"),
                                            options.bar.workspaces.numbered_active_indicator.bind("value"),
                                            options.bar.workspaces.icons.available.bind("value"),
                                            options.bar.workspaces.icons.active.bind("value"),
                                            options.bar.workspaces.icons.occupied.bind("value"),
                                            hyprland.active.workspace.bind("id")
                                        ],
                                        (show_icons, show_numbered, numbered_active_indicator) => {
                                            if (show_icons) {
                                                return `workspace-icon txt-icon bar`;
                                            }
                                            if (show_numbered) {
                                                const numActiveInd = hyprland.active.workspace.id === i
                                                    ? numbered_active_indicator
                                                    : "";

                                                return `workspace-number can_${numbered_active_indicator} ${numActiveInd}`;
                                            }
                                            return "default";
                                        },
                                    ),
                                    label: Utils.merge(
                                        [
                                            options.bar.workspaces.show_icons.bind("value"),
                                            options.bar.workspaces.icons.available.bind("value"),
                                            options.bar.workspaces.icons.active.bind("value"),
                                            options.bar.workspaces.icons.occupied.bind("value"),
                                            workspaceMask.bind("value"),
                                            hyprland.active.workspace.bind("id")
                                        ],
                                        (showIcons, available, active, occupied, workspaceMask, _) => {
                                            if (showIcons) {
                                                if (hyprland.active.workspace.id === i) {
                                                    return active;
                                                }
                                                if ((hyprland.getWorkspace(i)?.windows || 0) > 0) {
                                                    return occupied;
                                                }
                                                if (
                                                    monitor !== -1
                                                ) {
                                                    return available;
                                                }
                                            }
                                            return workspaceMask
                                                ? `${index + 1}`
                                                : `${i}`;
                                        },
                                    ),
                                    setup: (self) => {
                                        self.hook(hyprland, () => {
                                            self.toggleClassName(
                                                "active",
                                                hyprland.active.workspace.id === i,
                                            );
                                            self.toggleClassName(
                                                "occupied",
                                                (hyprland.getWorkspace(i)?.windows || 0) > 0,
                                            );
                                        });
                                    },
                                })
                            });
                        });
                },
            )
        })
    }
    const occupiedWses = () => {
        return Widget.Box({
            children: Utils.merge(
                [
                    monitorSpecific.bind("value"),
                    hyprland.bind("workspaces"),
                    workspaceMask.bind("value"),
                    options.bar.workspaces.show_icons.bind("value"),
                    options.bar.workspaces.icons.available.bind("value"),
                    options.bar.workspaces.icons.active.bind("value"),
                    options.bar.workspaces.icons.occupied.bind("value"),
                    options.bar.workspaces.show_numbered.bind("value"),
                    options.bar.workspaces.numbered_active_indicator.bind("value"),
                    spacing.bind("value"),
                    hyprland.active.workspace.bind("id"),
                ],
                (monitorSpecific, wkSpaces, workspaceMask, showIcons, available, active, occupied, showNumbered, numberedActiveIndicator, spacing, activeId) => {
                    const activeWorkspaces = wkSpaces.map(w => w.id);
                    return activeWorkspaces
                        .filter((i) => {
                            if (monitorSpecific === false) {
                                return true;
                            }

                            const isOnMonitor = hyprland.workspaces.find(w => w.id === i)?.monitorID === monitor;
                            return isOnMonitor;
                        })
                        .map((i, index) => {
                            return Widget.Button({
                                class_name: "workspace-button",
                                on_primary_click: () => {
                                    hyprland.messageAsync(`dispatch workspace ${i}`)

                                },
                                child: Widget.Label({
                                    attribute: i,
                                    vpack: "center",
                                    css: `margin: 0rem ${0.375 * spacing}rem;`,
                                    class_name: renderClassnames(showIcons, showNumbered, numberedActiveIndicator, i),
                                    label: renderLabel(showIcons, available, active, occupied, workspaceMask, i, index),
                                    setup: (self) => {
                                        self.toggleClassName(
                                            "active",
                                            activeId === i,
                                        );
                                        self.toggleClassName(
                                            "occupied",
                                            (hyprland.getWorkspace(i)?.windows || 0) > 0,
                                        );
                                    },
                                })
                            });
                        });
                },
            )
        })
    }

    return {
        component: Widget.Box({
            class_name: "workspaces",
            child: options.bar.workspaces.hideUnoccupied.bind("value").as(hideUnoccupied => hideUnoccupied ? occupiedWses() : defaultWses()),
        }),
        isVisible: true,
        boxClass: "workspaces",
        props: {
            setup: (self: any) => {
                Utils.merge([scroll_speed.bind("value"), options.bar.workspaces.hideUnoccupied.bind("value")], (scroll_speed, hideUnoccupied) => {
                    const { throttledScrollUp, throttledScrollDown } = createThrottledScrollHandlers(scroll_speed, currentMonitorWorkspaces, hideUnoccupied)
                    self.on_scroll_up = throttledScrollUp;
                    self.on_scroll_down = throttledScrollDown;
                });
            }
        }
    };
};

export { Workspaces };
