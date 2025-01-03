import { Variable } from 'astal';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { hyprlandService } from 'src/lib/constants/services';
import { MonitorMap, WorkspaceMonitorMap, WorkspaceRule } from 'src/lib/types/workspace';
import { range } from 'src/lib/utils';
import options from 'src/options';

const { workspaces, reverse_scroll, ignored } = options.bar.workspaces;

/**
 * A Variable that holds the current map of monitors to the workspace numbers assigned to them.
 */
export const workspaceRules = Variable(getWorkspaceMonitorMap());

/**
 * A Variable used to force UI or other updates when relevant workspace events occur.
 */
export const forceUpdater = Variable(true);

/**
 * Retrieves the workspace numbers associated with a specific monitor.
 *
 * If only one monitor exists, this will simply return a list of all possible workspaces.
 * Otherwise, it will consult the workspace rules to determine which workspace numbers
 * belong to the specified monitor.
 *
 * @param monitorId - The numeric identifier of the monitor.
 *
 * @returns An array of workspace numbers belonging to the specified monitor.
 */
export function getWorkspacesForMonitor(monitorId: number): number[] {
    const allMonitors = hyprlandService.get_monitors();

    if (allMonitors.length === 1) {
        return Array.from({ length: workspaces.get() }, (_, index) => index + 1);
    }

    const workspaceMonitorRules = getWorkspaceMonitorMap();

    const monitorNameMap: MonitorMap = {};
    allMonitors.forEach((monitorInstance) => {
        monitorNameMap[monitorInstance.id] = monitorInstance.name;
    });

    const currentMonitorName = monitorNameMap[monitorId];

    return workspaceMonitorRules[currentMonitorName];
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
function isWorkspaceValidForMonitor(
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
    const filteredWorkspaceRules = currentMonitorWorkspaceRules.filter((ws) => !activeWorkspaceIds.has(ws));

    if (filteredWorkspaceRules === undefined) {
        return false;
    }

    return filteredWorkspaceRules.includes(workspaceId);
}

/**
 * Fetches a map of monitors to the workspace numbers that belong to them.
 *
 * This function communicates with the Hyprland service to retrieve workspace rules in JSON format.
 * Those rules are parsed, and a map of monitor names to lists of assigned workspace numbers is constructed.
 *
 * @returns An object where each key is a monitor name, and each value is an array of workspace numbers.
 */
function getWorkspaceMonitorMap(): WorkspaceMonitorMap {
    try {
        const rulesResponse = hyprlandService.message('j/workspacerules');
        const workspaceMonitorRules: WorkspaceMonitorMap = {};
        const parsedWorkspaceRules = JSON.parse(rulesResponse);

        parsedWorkspaceRules.forEach((rule: WorkspaceRule) => {
            const workspaceNumber = parseInt(rule.workspaceString, 10);

            if (rule.monitor === undefined || isNaN(workspaceNumber)) {
                return;
            }

            const doesMonitorExistInRules = Object.hasOwnProperty.call(workspaceMonitorRules, rule.monitor);

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
 * @param ignoredWorkspacesVariable - A Variable object containing a string pattern of ignored workspaces.
 * @param workspaceNumber - The numeric representation of the workspace to check.
 *
 * @returns `true` if the workspace should be ignored, otherwise `false`.
 */
function isWorkspaceIgnored(ignoredWorkspacesVariable: Variable<string>, workspaceNumber: number): boolean {
    if (ignoredWorkspacesVariable.get() === '') {
        return false;
    }

    const ignoredWorkspacesRegex = new RegExp(ignoredWorkspacesVariable.get());
    return ignoredWorkspacesRegex.test(workspaceNumber.toString());
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
function navigateWorkspace(direction: 'next' | 'prev', ignoredWorkspacesVariable: Variable<string>): void {
    const allHyprlandWorkspaces = hyprlandService.get_workspaces() || [];

    const activeWorkspaceIds = allHyprlandWorkspaces
        .filter((workspaceInstance) => hyprlandService.focusedMonitor.id === workspaceInstance.monitor?.id)
        .map((workspaceInstance) => workspaceInstance.id);

    const assignedOrOccupiedWorkspaces = activeWorkspaceIds.sort((a, b) => a - b);

    if (assignedOrOccupiedWorkspaces.length === 0) {
        return;
    }

    const workspaceIndex = assignedOrOccupiedWorkspaces.indexOf(hyprlandService.focusedWorkspace?.id);
    const step = direction === 'next' ? 1 : -1;

    let newIndex = (workspaceIndex + step + assignedOrOccupiedWorkspaces.length) % assignedOrOccupiedWorkspaces.length;
    let attempts = 0;

    while (attempts < assignedOrOccupiedWorkspaces.length) {
        const targetWorkspaceNumber = assignedOrOccupiedWorkspaces[newIndex];
        if (!isWorkspaceIgnored(ignoredWorkspacesVariable, targetWorkspaceNumber)) {
            hyprlandService.dispatch('workspace', targetWorkspaceNumber.toString());
            return;
        }
        newIndex = (newIndex + step + assignedOrOccupiedWorkspaces.length) % assignedOrOccupiedWorkspaces.length;
        attempts++;
    }
}

/**
 * Navigates to the next workspace in the current monitor.
 *
 * @param currentMonitorWorkspacesVariable - A Variable containing workspace numbers for the current monitor.
 * @param onlyActiveWorkspaces - Whether to only navigate among active (occupied) workspaces.
 * @param ignoredWorkspacesVariable - A Variable that contains the ignored workspaces pattern.
 */
export function goToNextWorkspace(ignoredWorkspacesVariable: Variable<string>): void {
    navigateWorkspace('next', ignoredWorkspacesVariable);
}

/**
 * Navigates to the previous workspace in the current monitor.
 *
 * @param currentMonitorWorkspacesVariable - A Variable containing workspace numbers for the current monitor.
 * @param onlyActiveWorkspaces - Whether to only navigate among active (occupied) workspaces.
 * @param ignoredWorkspacesVariable - A Variable that contains the ignored workspaces pattern.
 */
export function goToPreviousWorkspace(ignoredWorkspacesVariable: Variable<string>): void {
    navigateWorkspace('prev', ignoredWorkspacesVariable);
}

/**
 * Limits the execution rate of a given function to prevent it from being called too often.
 *
 * @param func - The function to be throttled.
 * @param limit - The time limit (in milliseconds) during which calls to `func` are disallowed after the first call.
 *
 * @returns The throttled version of the input function.
 */
export function throttle<T extends (...args: unknown[]) => void>(func: T, limit: number): T {
    let isThrottleActive: boolean;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (!isThrottleActive) {
            func.apply(this, args);
            isThrottleActive = true;

            setTimeout(() => {
                isThrottleActive = false;
            }, limit);
        }
    } as T;
}

/**
 * Creates throttled scroll handlers that navigate workspaces upon scrolling, respecting the configured scroll speed.
 *
 * @param scrollSpeed - The factor by which the scroll navigation is throttled.
 * @param onlyActiveWorkspaces - Whether to only navigate among active (occupied) workspaces.
 *
 * @returns An object containing two functions (`throttledScrollUp` and `throttledScrollDown`), both throttled.
 */
export function initThrottledScrollHandlers(scrollSpeed: number): ThrottledScrollHandlers {
    const throttledScrollUp = throttle(() => {
        if (reverse_scroll.get()) {
            goToPreviousWorkspace(ignored);
        } else {
            goToNextWorkspace(ignored);
        }
    }, 200 / scrollSpeed);

    const throttledScrollDown = throttle(() => {
        if (reverse_scroll.get()) {
            goToNextWorkspace(ignored);
        } else {
            goToPreviousWorkspace(ignored);
        }
    }, 200 / scrollSpeed);

    return { throttledScrollUp, throttledScrollDown };
}

/**
 * Computes which workspace numbers should be rendered for a given monitor.
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
export function getWorkspacesToRender(
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
        const metadataForWorkspace = allWorkspaceInstances.find((workspaceObj) => workspaceObj.id === workspaceId);

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
    });

    if (isMonitorSpecific) {
        const validWorkspaceNumbers = range(totalWorkspaces).filter((workspaceNumber) => {
            return isWorkspaceValidForMonitor(
                workspaceNumber,
                workspaceMonitorRules,
                monitorId,
                allWorkspaceInstances,
                hyprlandMonitorInstances,
            );
        });

        allPotentialWorkspaces = [...new Set([...activeWorkspacesForCurrentMonitor, ...validWorkspaceNumbers])];
    } else {
        allPotentialWorkspaces = [...new Set([...allPotentialWorkspaces, ...activeWorkspaceIds])];
    }

    return allPotentialWorkspaces.filter((workspace) => !isWorkspaceIgnored(ignored, workspace)).sort((a, b) => a - b);
}

/**
 * Subscribes to Hyprland service events related to workspaces to keep the local state updated.
 *
 * When certain events occur (like a configuration reload or a client being moved/added/removed),
 * this function updates the workspace rules or toggles the `forceUpdater` variable to ensure
 * that any dependent UI or logic is re-rendered or re-run.
 */
export function initWorkspaceEvents(): void {
    hyprlandService.connect('config-reloaded', () => {
        workspaceRules.set(getWorkspaceMonitorMap());
    });

    hyprlandService.connect('client-moved', () => {
        forceUpdater.set(!forceUpdater.get());
    });

    hyprlandService.connect('client-added', () => {
        forceUpdater.set(!forceUpdater.get());
    });

    hyprlandService.connect('client-removed', () => {
        forceUpdater.set(!forceUpdater.get());
    });
}

/**
 * Throttled scroll handler functions for navigating workspaces.
 */
type ThrottledScrollHandlers = {
    /**
     * Scroll up throttled handler.
     */
    throttledScrollUp: () => void;

    /**
     * Scroll down throttled handler.
     */
    throttledScrollDown: () => void;
};
