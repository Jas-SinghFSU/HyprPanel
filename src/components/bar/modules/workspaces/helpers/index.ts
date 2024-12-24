import { exec, Variable } from 'astal';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { hyprlandService } from 'src/lib/constants/services';
import { MonitorMap, WorkspaceMap, WorkspaceRule } from 'src/lib/types/workspace';
import { range } from 'src/lib/utils';
import options from 'src/options';

const { workspaces, reverse_scroll, ignored } = options.bar.workspaces;

/**
 * Retrieves the workspaces for a specific monitor.
 *
 * This function checks if a given workspace is valid for a specified monitor based on the workspace rules.
 *
 * @param curWs - The current workspace number.
 * @param wsRules - The workspace rules map.
 * @param monitor - The monitor ID.
 * @param workspaceList - The list of workspaces.
 * @param monitorList - The list of monitors.
 *
 * @returns Whether the workspace is valid for the monitor.
 */
export const getWorkspacesForMonitor = (
    curWs: number,
    wsRules: WorkspaceMap,
    monitor: number,
    workspaceList: AstalHyprland.Workspace[],
    monitorList: AstalHyprland.Monitor[],
): boolean => {
    if (!wsRules || !Object.keys(wsRules).length) {
        return true;
    }

    const monitorMap: MonitorMap = {};

    const wsList = workspaceList ?? [];

    const workspaceMonitorList = wsList
        .filter((m) => m !== null)
        .map((m) => {
            return { id: m.monitor?.id, name: m.monitor?.name };
        });

    const monitors = [...new Map([...workspaceMonitorList, ...monitorList].map((item) => [item.id, item])).values()];

    monitors.forEach((mon) => (monitorMap[mon.id] = mon.name));

    const currentMonitorName = monitorMap[monitor];
    const monitorWSRules = wsRules[currentMonitorName];

    if (monitorWSRules === undefined) {
        return true;
    }
    return monitorWSRules.includes(curWs);
};

/**
 * Retrieves the workspace rules.
 *
 * This function fetches and parses the workspace rules from the Hyprland service.
 *
 * @returns The workspace rules map.
 */
export const getWorkspaceRules = (): WorkspaceMap => {
    try {
        const rules = exec('hyprctl workspacerules -j');

        const workspaceRules: WorkspaceMap = {};

        JSON.parse(rules).forEach((rule: WorkspaceRule) => {
            const workspaceNum = parseInt(rule.workspaceString, 10);
            if (isNaN(workspaceNum)) {
                return;
            }
            if (Object.hasOwnProperty.call(workspaceRules, rule.monitor)) {
                workspaceRules[rule.monitor].push(workspaceNum);
            } else {
                workspaceRules[rule.monitor] = [workspaceNum];
            }
        });

        return workspaceRules;
    } catch (err) {
        console.error(err);
        return {};
    }
};

/**
 * Retrieves the current monitor's workspaces.
 *
 * This function returns a list of workspace numbers for the specified monitor.
 *
 * @param monitor - The monitor ID.
 *
 * @returns The list of workspace numbers.
 */
export const getCurrentMonitorWorkspaces = (monitor: number): number[] => {
    if (hyprlandService.get_monitors().length === 1) {
        return Array.from({ length: workspaces.get() }, (_, i) => i + 1);
    }

    const monitorWorkspaces = getWorkspaceRules();
    const monitorMap: MonitorMap = {};
    hyprlandService.get_monitors().forEach((m) => (monitorMap[m.id] = m.name));

    const currentMonitorName = monitorMap[monitor];

    return monitorWorkspaces[currentMonitorName];
};

/**
 * Checks if a workspace is ignored.
 *
 * This function determines if a given workspace number is in the ignored workspaces list.
 *
 * @param ignoredWorkspaces - The ignored workspaces variable.
 * @param workspaceNumber - The workspace number.
 *
 * @returns Whether the workspace is ignored.
 */
export const isWorkspaceIgnored = (ignoredWorkspaces: Variable<string>, workspaceNumber: number): boolean => {
    if (ignoredWorkspaces.get() === '') return false;

    const ignoredWsRegex = new RegExp(ignoredWorkspaces.get());

    return ignoredWsRegex.test(workspaceNumber.toString());
};

/**
 * Navigates to the next or previous workspace.
 *
 * This function changes the current workspace to the next or previous one, considering active and ignored workspaces.
 *
 * @param direction - The direction to navigate ('next' or 'prev').
 * @param currentMonitorWorkspaces - The current monitor's workspaces variable.
 * @param activeWorkspaces - Whether to consider only active workspaces.
 * @param ignoredWorkspaces - The ignored workspaces variable.
 */
const navigateWorkspace = (
    direction: 'next' | 'prev',
    currentMonitorWorkspaces: Variable<number[]>,
    activeWorkspaces: boolean,
    ignoredWorkspaces: Variable<string>,
): void => {
    const hyprlandWorkspaces = hyprlandService.get_workspaces() || [];
    const occupiedWorkspaces = hyprlandWorkspaces
        .filter((ws) => hyprlandService.focusedMonitor.id === ws.monitor?.id)
        .map((ws) => ws.id);

    const workspacesList = activeWorkspaces
        ? occupiedWorkspaces
        : currentMonitorWorkspaces.get() || Array.from({ length: workspaces.get() }, (_, i) => i + 1);

    if (workspacesList.length === 0) return;

    const currentIndex = workspacesList.indexOf(hyprlandService.focusedWorkspace?.id);
    const step = direction === 'next' ? 1 : -1;
    let newIndex = (currentIndex + step + workspacesList.length) % workspacesList.length;
    let attempts = 0;

    while (attempts < workspacesList.length) {
        const targetWS = workspacesList[newIndex];
        if (!isWorkspaceIgnored(ignoredWorkspaces, targetWS)) {
            hyprlandService.dispatch('workspace', targetWS.toString());
            return;
        }
        newIndex = (newIndex + step + workspacesList.length) % workspacesList.length;
        attempts++;
    }
};

/**
 * Navigates to the next workspace.
 *
 * This function changes the current workspace to the next one.
 *
 * @param currentMonitorWorkspaces - The current monitor's workspaces variable.
 * @param activeWorkspaces - Whether to consider only active workspaces.
 * @param ignoredWorkspaces - The ignored workspaces variable.
 */
export const goToNextWS = (
    currentMonitorWorkspaces: Variable<number[]>,
    activeWorkspaces: boolean,
    ignoredWorkspaces: Variable<string>,
): void => {
    navigateWorkspace('next', currentMonitorWorkspaces, activeWorkspaces, ignoredWorkspaces);
};

/**
 * Navigates to the previous workspace.
 *
 * This function changes the current workspace to the previous one.
 *
 * @param currentMonitorWorkspaces - The current monitor's workspaces variable.
 * @param activeWorkspaces - Whether to consider only active workspaces.
 * @param ignoredWorkspaces - The ignored workspaces variable.
 */
export const goToPrevWS = (
    currentMonitorWorkspaces: Variable<number[]>,
    activeWorkspaces: boolean,
    ignoredWorkspaces: Variable<string>,
): void => {
    navigateWorkspace('prev', currentMonitorWorkspaces, activeWorkspaces, ignoredWorkspaces);
};

/**
 * Throttles a function to limit its execution rate.
 *
 * This function ensures that the provided function is not called more often than the specified limit.
 *
 * @param func - The function to throttle.
 * @param limit - The time limit in milliseconds.
 *
 * @returns The throttled function.
 */
export function throttle<T extends (...args: unknown[]) => void>(func: T, limit: number): T {
    let inThrottle: boolean;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    } as T;
}

/**
 * Creates throttled scroll handlers for navigating workspaces.
 *
 * This function returns handlers for scrolling up and down through workspaces, throttled by the specified scroll speed.
 *
 * @param scrollSpeed - The scroll speed.
 * @param currentMonitorWorkspaces - The current monitor's workspaces variable.
 * @param activeWorkspaces - Whether to consider only active workspaces.
 *
 * @returns The throttled scroll handlers.
 */
export const createThrottledScrollHandlers = (
    scrollSpeed: number,
    currentMonitorWorkspaces: Variable<number[]>,
    activeWorkspaces: boolean = true,
): ThrottledScrollHandlers => {
    const throttledScrollUp = throttle(() => {
        if (reverse_scroll.get()) {
            goToPrevWS(currentMonitorWorkspaces, activeWorkspaces, ignored);
        } else {
            goToNextWS(currentMonitorWorkspaces, activeWorkspaces, ignored);
        }
    }, 200 / scrollSpeed);

    const throttledScrollDown = throttle(() => {
        if (reverse_scroll.get()) {
            goToNextWS(currentMonitorWorkspaces, activeWorkspaces, ignored);
        } else {
            goToPrevWS(currentMonitorWorkspaces, activeWorkspaces, ignored);
        }
    }, 200 / scrollSpeed);

    return { throttledScrollUp, throttledScrollDown };
};

/**
 * Retrieves the workspaces to render.
 *
 * This function returns a list of workspace numbers to render based on the total workspaces, workspace list, rules, and monitor.
 *
 * @param totalWorkspaces - The total number of workspaces.
 * @param workspaceList - The list of workspaces.
 * @param workspaceRules - The workspace rules map.
 * @param monitor - The monitor ID.
 * @param isMonitorSpecific - Whether the workspaces are monitor-specific.
 * @param monitorList - The list of monitors.
 *
 * @returns The list of workspace numbers to render.
 */
export const getWorkspacesToRender = (
    totalWorkspaces: number,
    workspaceList: AstalHyprland.Workspace[],
    workspaceRules: WorkspaceMap,
    monitor: number,
    isMonitorSpecific: boolean,
    monitorList: AstalHyprland.Monitor[],
): number[] => {
    let allWorkspaces = range(totalWorkspaces || 8);
    const activeWorkspaces = workspaceList.map((ws) => ws.id);

    const wsList = workspaceList ?? [];
    const workspaceMonitorList = wsList.map((ws) => {
        return {
            id: ws.monitor?.id || -1,
            name: ws.monitor?.name || '',
        };
    });

    const curMonitor =
        monitorList.find((mon) => mon.id === monitor) || workspaceMonitorList.find((mon) => mon.id === monitor);

    const workspacesWithRules = Object.keys(workspaceRules).reduce((acc: number[], k: string) => {
        return [...acc, ...workspaceRules[k]];
    }, []);

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

    if (isMonitorSpecific) {
        const workspacesInRange = range(totalWorkspaces).filter((ws) => {
            return getWorkspacesForMonitor(ws, workspaceRules, monitor, wsList, monitorList);
        });

        allWorkspaces = [...new Set([...activesForMonitor, ...workspacesInRange])];
    } else {
        allWorkspaces = [...new Set([...allWorkspaces, ...activeWorkspaces])];
    }

    return allWorkspaces.sort((a, b) => a - b);
};

/**
 * The workspace rules variable.
 * This variable holds the current workspace rules.
 */
export const workspaceRules = Variable(getWorkspaceRules());

/**
 * The force updater variable.
 * This variable is used to force updates when workspace events occur.
 */
export const forceUpdater = Variable(true);

/**
 * Sets up connections for workspace events.
 * This function sets up event listeners for various workspace-related events to update the workspace rules and force updates.
 */
export const setupConnections = (): void => {
    hyprlandService.connect('config-reloaded', () => {
        workspaceRules.set(getWorkspaceRules());
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
};

type ThrottledScrollHandlers = {
    throttledScrollUp: () => void;
    throttledScrollDown: () => void;
};
