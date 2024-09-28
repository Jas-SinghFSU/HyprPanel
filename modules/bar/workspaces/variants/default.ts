const hyprland = await Service.import('hyprland');
import options from 'options';
import { getWorkspaceRules, getWorkspacesForMonitor, isWorkspaceIgnored } from '../helpers';
import { range } from 'lib/utils';
import { BoxWidget } from 'lib/types/widget';
import { getWsColor, renderClassnames, renderLabel } from '../utils';
import { WorkspaceIconMap } from 'lib/types/workspace';

const { workspaces, monitorSpecific, workspaceMask, spacing, ignored } = options.bar.workspaces;
export const defaultWses = (monitor: number): BoxWidget => {
    return Widget.Box({
        children: Utils.merge(
            [workspaces.bind('value'), monitorSpecific.bind('value'), ignored.bind('value')],
            (workspaces: number, monitorSpecific: boolean) => {
                return range(workspaces || 8)
                    .filter((workspaceNumber) => {
                        if (!monitorSpecific) {
                            return true;
                        }
                        const workspaceRules = getWorkspaceRules();
                        return (
                            getWorkspacesForMonitor(workspaceNumber, workspaceRules, monitor) &&
                            !isWorkspaceIgnored(ignored, workspaceNumber)
                        );
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
                            onHover: (self) => {
                                self.toggleClassName('hover-ws', true);
                            },
                            onHoverLost: (self) => {
                                self.toggleClassName('hover-ws', false);
                            },
                            child: Widget.Label({
                                attribute: i,
                                vpack: 'center',
                                css: Utils.merge(
                                    [
                                        spacing.bind('value'),
                                        options.bar.workspaces.showWsIcons.bind('value'),
                                        options.bar.workspaces.workspaceIconMap.bind('value'),
                                        options.theme.matugen.bind('value'),
                                        options.theme.bar.buttons.workspaces.smartHighlight.bind('value'),
                                        hyprland.active.workspace.bind('id'),
                                    ],
                                    (
                                        sp: number,
                                        showWsIcons: boolean,
                                        workspaceIconMap: WorkspaceIconMap,
                                        matugen: boolean,
                                        smartHighlight: boolean,
                                    ) => {
                                        return (
                                            `margin: 0rem ${0.375 * sp}rem;` +
                                            `${showWsIcons && !matugen ? getWsColor(workspaceIconMap, i, smartHighlight) : ''}`
                                        );
                                    },
                                ),
                                class_name: Utils.merge(
                                    [
                                        options.bar.workspaces.show_icons.bind('value'),
                                        options.bar.workspaces.show_numbered.bind('value'),
                                        options.bar.workspaces.numbered_active_indicator.bind('value'),
                                        options.bar.workspaces.showWsIcons.bind('value'),
                                        options.theme.bar.buttons.workspaces.smartHighlight.bind('value'),
                                        options.bar.workspaces.icons.available.bind('value'),
                                        options.bar.workspaces.icons.active.bind('value'),
                                        hyprland.active.workspace.bind('id'),
                                    ],
                                    (
                                        showIcons: boolean,
                                        showNumbered: boolean,
                                        numberedActiveIndicator: string,
                                        showWsIcons: boolean,
                                        smartHighlight: boolean,
                                    ) => {
                                        return renderClassnames(
                                            showIcons,
                                            showNumbered,
                                            numberedActiveIndicator,
                                            showWsIcons,
                                            smartHighlight,
                                            i,
                                        );
                                    },
                                ),
                                label: Utils.merge(
                                    [
                                        options.bar.workspaces.show_icons.bind('value'),
                                        options.bar.workspaces.icons.available.bind('value'),
                                        options.bar.workspaces.icons.active.bind('value'),
                                        options.bar.workspaces.icons.occupied.bind('value'),
                                        options.bar.workspaces.workspaceIconMap.bind('value'),
                                        options.bar.workspaces.showWsIcons.bind('value'),
                                        workspaceMask.bind('value'),
                                        hyprland.active.workspace.bind('id'),
                                    ],
                                    (
                                        showIcons: boolean,
                                        available: string,
                                        active: string,
                                        occupied: string,
                                        wsIconMap: WorkspaceIconMap,
                                        showWsIcons: boolean,
                                        workspaceMask: boolean,
                                    ) => {
                                        return renderLabel(
                                            showIcons,
                                            available,
                                            active,
                                            occupied,
                                            workspaceMask,
                                            showWsIcons,
                                            wsIconMap,
                                            i,
                                            index,
                                            monitor,
                                        );
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
