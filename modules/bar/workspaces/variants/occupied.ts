const hyprland = await Service.import('hyprland');
import options from 'options';
import { getWorkspaceRules, getWorkspacesForMonitor, isWorkspaceIgnored } from '../helpers';
import { Monitor, Workspace } from 'types/service/hyprland';
import { getWsColor, renderClassnames, renderLabel } from '../utils';
import { range } from 'lib/utils';
import { BoxWidget } from 'lib/types/widget';
import { WorkspaceIconMap } from 'lib/types/workspace';

const { workspaces, monitorSpecific, workspaceMask, spacing, ignored, showAllActive } = options.bar.workspaces;

export const occupiedWses = (monitor: number): BoxWidget => {
    return Widget.Box({
        children: Utils.merge(
            [
                monitorSpecific.bind('value'),
                hyprland.bind('workspaces'),
                workspaceMask.bind('value'),
                workspaces.bind('value'),
                options.bar.workspaces.show_icons.bind('value'),
                options.bar.workspaces.icons.available.bind('value'),
                options.bar.workspaces.icons.active.bind('value'),
                options.bar.workspaces.icons.occupied.bind('value'),
                options.bar.workspaces.show_numbered.bind('value'),
                options.bar.workspaces.numbered_active_indicator.bind('value'),
                spacing.bind('value'),
                options.bar.workspaces.workspaceIconMap.bind('value'),
                options.bar.workspaces.showWsIcons.bind('value'),
                options.theme.matugen.bind('value'),
                options.theme.bar.buttons.workspaces.smartHighlight.bind('value'),
                hyprland.bind('monitors'),
                ignored.bind('value'),
                showAllActive.bind('value'),
            ],
            (
                monitorSpecific: boolean,
                wkSpaces: Workspace[],
                workspaceMask: boolean,
                totalWkspcs: number,
                showIcons: boolean,
                available: string,
                active: string,
                occupied: string,
                showNumbered: boolean,
                numberedActiveIndicator: string,
                spacing: number,
                wsIconMap: WorkspaceIconMap,
                showWsIcons: boolean,
                matugen: boolean,
                smartHighlight: boolean,
                monitors: Monitor[],
            ) => {
                const activeId = hyprland.active.workspace.id;
                let allWkspcs = range(totalWkspcs || 8);

                const activeWorkspaces = wkSpaces.map((w) => w.id);
                const workspaceRules = getWorkspaceRules();

                // Sometimes hyprland doesn't have all the monitors in the list
                // so we complement it with monitors from the workspace list
                const workspaceMonitorList = hyprland?.workspaces?.map((m) => ({
                    id: m.monitorID,
                    name: m.monitor,
                }));
                const curMonitor =
                    hyprland.monitors.find((m) => m.id === monitor) ||
                    workspaceMonitorList.find((m) => m.id === monitor);

                const workspacesWithRules = Object.keys(workspaceRules).reduce((acc: number[], k: string) => {
                    return [...acc, ...workspaceRules[k]];
                }, [] as number[]);

                const activesForMonitor = activeWorkspaces.filter((w) => {
                    if (
                        curMonitor &&
                        Object.hasOwnProperty.call(workspaceRules, curMonitor.name) &&
                        workspacesWithRules.includes(w)
                    ) {
                        return workspaceRules[curMonitor.name].includes(w);
                    }
                    return true;
                });

                if (monitorSpecific) {
                    const wrkspcsInRange = range(totalWkspcs).filter((w) => {
                        return getWorkspacesForMonitor(w, workspaceRules, monitor);
                    });
                    allWkspcs = [...new Set([...activesForMonitor, ...wrkspcsInRange])];
                } else {
                    allWkspcs = [...new Set([...allWkspcs, ...activeWorkspaces])];
                }

                return allWkspcs
                    .sort((a, b) => {
                        return a - b;
                    })
                    .map((i, index) => {
                        if (isWorkspaceIgnored(ignored, i)) {
                            return Widget.Box();
                        }
                        return Widget.Button({
                            class_name: 'workspace-button',
                            on_primary_click: () => {
                                hyprland.messageAsync(`dispatch workspace ${i}`);
                            },
                            child: Widget.Label({
                                attribute: i,
                                vpack: 'center',
                                css:
                                    `margin: 0rem ${0.375 * spacing}rem;` +
                                    `${showWsIcons && !matugen ? getWsColor(wsIconMap, i, smartHighlight, monitor, monitors) : ''}`,
                                class_name: renderClassnames(
                                    showIcons,
                                    showNumbered,
                                    numberedActiveIndicator,
                                    showWsIcons,
                                    smartHighlight,
                                    monitor,
                                    monitors,
                                    i,
                                ),
                                label: renderLabel(
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
                                    monitors,
                                ),
                                setup: (self) => {
                                    self.toggleClassName('active', activeId === i);
                                    self.toggleClassName('occupied', (hyprland.getWorkspace(i)?.windows || 0) > 0);
                                },
                            }),
                        });
                    });
            },
        ),
    });
};
