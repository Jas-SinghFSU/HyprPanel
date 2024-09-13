const hyprland = await Service.import('hyprland');
import options from 'options';
import { getWorkspaceRules, getWorkspacesForMonitor } from '../helpers';
import { range } from 'lib/utils';
import { BoxWidget } from 'lib/types/widget';

const { workspaces, monitorSpecific, workspaceMask, spacing } = options.bar.workspaces;
export const defaultWses = (monitor: number): BoxWidget => {
    return Widget.Box({
        children: Utils.merge(
            [workspaces.bind('value'), monitorSpecific.bind()],
            (workspaces: number, monitorSpecific: boolean) => {
                return range(workspaces || 8)
                    .filter((i) => {
                        if (!monitorSpecific) {
                            return true;
                        }
                        const workspaceRules = getWorkspaceRules();
                        return getWorkspacesForMonitor(i, workspaceRules, monitor);
                    })
                    .sort((a, b) => {
                        return a - b;
                    })
                    .map((i, index) => {
                        return Widget.Button({
                            class_name: 'workspace-button',
                            on_primary_click: () => {
                                hyprland.messageAsync(`dispatch workspace ${i}`);
                            },
                            child: Widget.Label({
                                attribute: i,
                                vpack: 'center',
                                css: spacing.bind('value').as((sp) => `margin: 0rem ${0.375 * sp}rem;`),
                                class_name: Utils.merge(
                                    [
                                        options.bar.workspaces.show_icons.bind('value'),
                                        options.bar.workspaces.show_numbered.bind('value'),
                                        options.bar.workspaces.numbered_active_indicator.bind('value'),
                                        options.bar.workspaces.icons.available.bind('value'),
                                        options.bar.workspaces.icons.active.bind('value'),
                                        options.bar.workspaces.icons.occupied.bind('value'),
                                        hyprland.active.workspace.bind('id'),
                                    ],
                                    (showIcons: boolean, showNumbered: boolean, numberedActiveIndicator: string) => {
                                        if (showIcons) {
                                            return `workspace-icon txt-icon bar`;
                                        }
                                        if (showNumbered) {
                                            const numActiveInd =
                                                hyprland.active.workspace.id === i ? numberedActiveIndicator : '';

                                            return `workspace-number can_${numberedActiveIndicator} ${numActiveInd}`;
                                        }
                                        return 'default';
                                    },
                                ),
                                label: Utils.merge(
                                    [
                                        options.bar.workspaces.show_icons.bind('value'),
                                        options.bar.workspaces.icons.available.bind('value'),
                                        options.bar.workspaces.icons.active.bind('value'),
                                        options.bar.workspaces.icons.occupied.bind('value'),
                                        workspaceMask.bind('value'),
                                        hyprland.active.workspace.bind('id'),
                                    ],
                                    (
                                        showIcons: boolean,
                                        available: string,
                                        active: string,
                                        occupied: string,
                                        workspaceMask: boolean,
                                    ) => {
                                        if (showIcons) {
                                            if (hyprland.active.workspace.id === i) {
                                                return active;
                                            }
                                            if ((hyprland.getWorkspace(i)?.windows || 0) > 0) {
                                                return occupied;
                                            }
                                            if (monitor !== -1) {
                                                return available;
                                            }
                                        }
                                        return workspaceMask ? `${index + 1}` : `${i}`;
                                    },
                                ),
                                setup: (self) => {
                                    self.hook(hyprland, () => {
                                        self.toggleClassName('active', hyprland.active.workspace.id === i);
                                        self.toggleClassName('occupied', (hyprland.getWorkspace(i)?.windows || 0) > 0);
                                    });
                                },
                            }),
                        });
                    });
            },
        ),
    });
};
