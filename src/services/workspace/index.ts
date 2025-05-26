import { Variable } from 'astal';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { range, unique } from 'src/lib/array/helpers';
import options from 'src/configuration';
import { WorkspaceMonitorMap, MonitorMap, WorkspaceRule } from './types';

const hyprlandService = AstalHyprland.get_default();

/**
 * Manages Hyprland workspace operations and monitor relationships, providing centralized
 * workspace navigation and rule management across the panel system
 */
export class WorkspaceService {
    public static instance: WorkspaceService;
    private _ignored = options.bar.workspaces.ignored;

    public workspaceRules = Variable(this._getWorkspaceMonitorMap());
    public forceUpdater = Variable(true);

    private constructor() {}

    /**
     * Gets the singleton instance of WorkspaceService
     *
     * @returns The WorkspaceService instance
     */
    public static getInstance(): WorkspaceService {
        if (WorkspaceService.instance === undefined) {
            WorkspaceService.instance = new WorkspaceService();
        }

        return WorkspaceService.instance;
    }

    /** Computes which workspace numbers should be rendered for a given monitor.
     *
     * This function consolidates both active and all possible workspaces (based on rules),
     * then filters them by the selected monitor if `isMonitorSpecific` is set to `true`.
     *
     * @param totalWorkspaces - The total number of workspaces (a fallback if workspace rules are not enforced).
     * @param workspaceInstances - A list of Hyprland workspace objects.
     * @param workspaceMonitorRules - The map of monitor names to assigned workspace numbers.
     * @param monitorId - The numeric identifier of the monitor.
     * @param isMonitorSpecific - If `true`, only include the workspaces that match this monitor.
     * @param hyprlandMonitorInstances - A list of Hyprland monitor objects.
     *
     * @returns An array of workspace numbers that should be shown.
     */
    public getWorkspaces(
        totalWorkspaces: number,
        workspaceInstances: AstalHyprland.Workspace[],
        workspaceMonitorRules: WorkspaceMonitorMap,
        monitorId: number,
        isMonitorSpecific: boolean,
        hyprlandMonitorInstances: AstalHyprland.Monitor[],
    ): number[] {
        let allPotentialWorkspaces = range(totalWorkspaces || 8);
        const allWorkspaceInstances = workspaceInstances ?? [];

        const activeWorkspaceIds = allWorkspaceInstances.map((workspaceInstance) => workspaceInstance.id);

        const monitorReferencesForActiveWorkspaces = allWorkspaceInstances.map((workspaceInstance) => {
            return {
                id: workspaceInstance.monitor?.id ?? -1,
                name: workspaceInstance.monitor?.name ?? '',
            };
        });

        const currentMonitorInstance =
            hyprlandMonitorInstances.find((monitorObj) => monitorObj.id === monitorId) ||
            monitorReferencesForActiveWorkspaces.find((monitorObj) => monitorObj.id === monitorId);

        const allWorkspacesWithRules = Object.keys(workspaceMonitorRules).reduce(
            (accumulator: number[], monitorName: string) => {
                return [...accumulator, ...workspaceMonitorRules[monitorName]];
            },
            [],
        );

        const activeWorkspacesForCurrentMonitor = activeWorkspaceIds.filter((workspaceId) => {
            const metadataForWorkspace = allWorkspaceInstances.find(
                (workspaceObj) => workspaceObj.id === workspaceId,
            );

            if (metadataForWorkspace) {
                return metadataForWorkspace?.monitor?.id === monitorId;
            }

            if (
                currentMonitorInstance &&
                Object.hasOwnProperty.call(workspaceMonitorRules, currentMonitorInstance.name) &&
                allWorkspacesWithRules.includes(workspaceId)
            ) {
                return workspaceMonitorRules[currentMonitorInstance.name].includes(workspaceId);
            }

            return false;
        });

        if (isMonitorSpecific) {
            const validWorkspaceNumbers = range(totalWorkspaces).filter((workspaceNumber) => {
                return this._isWorkspaceValidForMonitor(
                    workspaceNumber,
                    workspaceMonitorRules,
                    monitorId,
                    allWorkspaceInstances,
                    hyprlandMonitorInstances,
                );
            });

            allPotentialWorkspaces = unique([...activeWorkspacesForCurrentMonitor, ...validWorkspaceNumbers]);
        } else {
            allPotentialWorkspaces = unique([...allPotentialWorkspaces, ...activeWorkspaceIds]);
        }

        return allPotentialWorkspaces
            .filter((workspace) => !this._isWorkspaceIgnored(workspace))
            .sort((a, b) => a - b);
    }

    /**
     * Navigates to the next workspace in the current monitor.
     */
    public goToNextWorkspace(): void {
        this._navigateWorkspace('next');
    }

    /**
     * Navigates to the previous workspace in the current monitor.
     */
    public goToPreviousWorkspace(): void {
        this._navigateWorkspace('prev');
    }

    /**
     * Gets a new set of workspace rules. Used to update stale rules.
     */
    public refreshWorkspaceRules(): void {
        this.workspaceRules.set(this._getWorkspaceMonitorMap());
    }

    /**
     * Forces a UI update by toggling the forceUpdater variable
     */
    public forceAnUpdate(): void {
        this.forceUpdater.set(!this.forceUpdater.get());
    }
    /**
     * Checks whether a given workspace is valid (assigned) for the specified monitor.
     *
     * This function inspects the workspace rules object to determine if the current workspace belongs
     * to the target monitor. If no workspace rules exist, the function defaults to returning `true`.
     *
     * @param workspaceId - The number representing the current workspace.
     * @param workspaceMonitorRules - The map of monitor names to assigned workspace numbers.
     * @param monitorId - The numeric identifier for the monitor.
     * @param workspaceList - A list of Hyprland workspace objects.
     * @param monitorList - A list of Hyprland monitor objects.
     *
     * @returns `true` if the workspace is assigned to the monitor or if no rules exist. Otherwise, `false`.
     */
    private _isWorkspaceValidForMonitor(
        workspaceId: number,
        workspaceMonitorRules: WorkspaceMonitorMap,
        monitorId: number,
        workspaceList: AstalHyprland.Workspace[],
        monitorList: AstalHyprland.Monitor[],
    ): boolean {
        const monitorNameMap: MonitorMap = {};
        const allWorkspaceInstances = workspaceList ?? [];

        const workspaceMonitorReferences = allWorkspaceInstances
            .filter((workspaceInstance) => workspaceInstance !== null)
            .map((workspaceInstance) => {
                return {
                    id: workspaceInstance.monitor?.id,
                    name: workspaceInstance.monitor?.name,
                };
            });

        const mergedMonitorInstances = [
            ...new Map(
                [...workspaceMonitorReferences, ...monitorList].map((monitorCandidate) => [
                    monitorCandidate.id,
                    monitorCandidate,
                ]),
            ).values(),
        ];

        mergedMonitorInstances.forEach((monitorInstance) => {
            monitorNameMap[monitorInstance.id] = monitorInstance.name;
        });

        const currentMonitorName = monitorNameMap[monitorId];
        const currentMonitorWorkspaceRules = workspaceMonitorRules[currentMonitorName] ?? [];
        const activeWorkspaceIds = new Set(allWorkspaceInstances.map((ws) => ws.id));
        const filteredWorkspaceRules = currentMonitorWorkspaceRules.filter(
            (ws) => !activeWorkspaceIds.has(ws),
        );

        if (filteredWorkspaceRules === undefined) {
            return false;
        }

        return filteredWorkspaceRules.includes(workspaceId);
    }

    /**
     * Changes the active workspace in the specified direction ('next' or 'prev').
     *
     * This function uses the current monitor's set of active or assigned workspaces and
     * cycles through them in the chosen direction. It also respects the list of ignored
     * workspaces, skipping any that match the ignored pattern.
     *
     * @param direction - The direction to navigate ('next' or 'prev').
     * @param currentMonitorWorkspacesVariable - A Variable containing an array of workspace numbers for the current monitor.
     * @param onlyActiveWorkspaces - Whether to only include active (occupied) workspaces when navigating.
     * @param ignoredWorkspacesVariable - A Variable that contains the ignored workspaces pattern.
     */
    private _navigateWorkspace(direction: 'next' | 'prev'): void {
        const allHyprlandWorkspaces = hyprlandService.get_workspaces() ?? [];

        const activeWorkspaceIds = allHyprlandWorkspaces
            .filter(
                (workspaceInstance) => hyprlandService.focusedMonitor.id === workspaceInstance.monitor?.id,
            )
            .map((workspaceInstance) => workspaceInstance.id);

        const assignedOrOccupiedWorkspaces = activeWorkspaceIds.sort((a, b) => a - b);

        if (assignedOrOccupiedWorkspaces.length === 0) {
            return;
        }

        const workspaceIndex = assignedOrOccupiedWorkspaces.indexOf(hyprlandService.focusedWorkspace?.id);
        const step = direction === 'next' ? 1 : -1;

        let newIndex =
            (workspaceIndex + step + assignedOrOccupiedWorkspaces.length) %
            assignedOrOccupiedWorkspaces.length;
        let attempts = 0;

        while (attempts < assignedOrOccupiedWorkspaces.length) {
            const targetWorkspaceNumber = assignedOrOccupiedWorkspaces[newIndex];
            if (!this._isWorkspaceIgnored(targetWorkspaceNumber)) {
                hyprlandService.dispatch('workspace', targetWorkspaceNumber.toString());
                return;
            }
            newIndex =
                (newIndex + step + assignedOrOccupiedWorkspaces.length) % assignedOrOccupiedWorkspaces.length;
            attempts++;
        }
    }

    /**
     * Fetches a map of monitors to the workspace numbers that belong to them.
     *
     * This function communicates with the Hyprland service to retrieve workspace rules in JSON format.
     * Those rules are parsed, and a map of monitor names to lists of assigned workspace numbers is constructed.
     *
     * @returns An object where each key is a monitor name, and each value is an array of workspace numbers.
     */
    private _getWorkspaceMonitorMap(): WorkspaceMonitorMap {
        try {
            const rulesResponse = hyprlandService.message('j/workspacerules');
            const workspaceMonitorRules: WorkspaceMonitorMap = {};
            const parsedWorkspaceRules = JSON.parse(rulesResponse);

            parsedWorkspaceRules.forEach((rule: WorkspaceRule) => {
                const workspaceNumber = parseInt(rule.workspaceString, 10);

                if (rule.monitor === undefined || isNaN(workspaceNumber)) {
                    return;
                }

                const doesMonitorExistInRules = Object.hasOwnProperty.call(
                    workspaceMonitorRules,
                    rule.monitor,
                );

                if (doesMonitorExistInRules) {
                    workspaceMonitorRules[rule.monitor].push(workspaceNumber);
                } else {
                    workspaceMonitorRules[rule.monitor] = [workspaceNumber];
                }
            });

            return workspaceMonitorRules;
        } catch (error) {
            console.error(error);
            return {};
        }
    }

    /**
     * Checks if a workspace number should be ignored based on a regular expression.
     *
     * @param workspaceNumber - The numeric representation of the workspace to check.
     * @returns `true` if the workspace should be ignored, otherwise `false`.
     */
    private _isWorkspaceIgnored(workspaceNumber: number): boolean {
        if (this._ignored.get() === '') {
            return false;
        }

        const ignoredWorkspacesRegex = new RegExp(this._ignored.get());
        return ignoredWorkspacesRegex.test(workspaceNumber.toString());
    }
}
