const hyprland = await Service.import('hyprland');
import options from 'options';
import { getWorkspaceRules, getWorkspacesForMonitor } from '../helpers';
import { Workspace } from 'types/service/hyprland';
import { renderClassnames, renderLabel } from '../utils';
import { range } from 'lib/utils';

const { workspaces, monitorSpecific, workspaceMask, spacing } = options.bar.workspaces;

export const occupiedWses = (monitor: number) => {
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
                hyprland.active.workspace.bind('id'),
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
                activeId: number,
            ) => {
                let allWkspcs = range(totalWkspcs || 8);

                const activeWorkspaces = wkSpaces.map((w) => w.id);
                const workspaceRules = getWorkspaceRules();

                // Sometimes hyprland doesn't have all the monitors in the list
                // so we complement it with monitors from the workspace list
                const workspaceMonitorList = hyprland?.workspaces?.map((m) => ({ id: m.monitorID, name: m.monitor }));
                const curMonitor =
                    hyprland.monitors.find((m) => m.id === monitor) ||
                    workspaceMonitorList.find((m) => m.id === monitor);

                // go through each key in workspaceRules and flatten the array
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
                        return Widget.Button({
                            class_name: 'workspace-button',
                            on_primary_click: () => {
                                hyprland.messageAsync(`dispatch workspace ${i}`);
                            },
                            child: Widget.Label({
                                attribute: i,
                                vpack: 'center',
                                css: `margin: 0rem ${0.375 * spacing}rem;`,
                                class_name: renderClassnames(showIcons, showNumbered, numberedActiveIndicator, i),
                                label: renderLabel(
                                    showIcons,
                                    available,
                                    active,
                                    occupied,
                                    workspaceMask,
                                    i,
                                    index,
                                    monitor,
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
