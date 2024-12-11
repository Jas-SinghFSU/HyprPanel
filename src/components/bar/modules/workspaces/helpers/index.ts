import { exec, Variable } from 'astal';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { hyprlandService } from 'src/lib/constants/services';
import { MonitorMap, WorkspaceMap, WorkspaceRule } from 'src/lib/types/workspace';
import { range } from 'src/lib/utils';
import options from 'src/options';

const { workspaces, reverse_scroll, ignored } = options.bar.workspaces;

export const getWorkspacesForMonitor = (curWs: number, wsRules: WorkspaceMap, monitor: number): boolean => {
    if (!wsRules || !Object.keys(wsRules).length) {
        return true;
    }

    const monitorMap: MonitorMap = {};

    const workspaceList = hyprlandService.get_workspaces() || [];
    const workspaceMonitorList = workspaceList.map((m) => {
        return { id: m.monitor.id, name: m.monitor.name };
    });

    const monitors = [
        ...new Map(
            [...workspaceMonitorList, ...hyprlandService.get_monitors()].map((item) => [item.id, item]),
        ).values(),
    ];

    monitors.forEach((mon) => (monitorMap[mon.id] = mon.name));

    const currentMonitorName = monitorMap[monitor];
    const monitorWSRules = wsRules[currentMonitorName];

    if (monitorWSRules === undefined) {
        return true;
    }
    return monitorWSRules.includes(curWs);
};

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

type ThrottledScrollHandlers = {
    throttledScrollUp: () => void;
    throttledScrollDown: () => void;
};

export const isWorkspaceIgnored = (ignoredWorkspaces: Variable<string>, workspaceNumber: number): boolean => {
    if (ignoredWorkspaces.get() === '') return false;

    const ignoredWsRegex = new RegExp(ignoredWorkspaces.get());

    return ignoredWsRegex.test(workspaceNumber.toString());
};

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

    const currentIndex = workspacesList.indexOf(hyprlandService.focusedWorkspace.id);
    const step = direction === 'next' ? 1 : -1;
    let newIndex = (currentIndex + step + workspacesList.length) % workspacesList.length;
    let attempts = 0;

    while (attempts < workspacesList.length) {
        const targetWS = workspacesList[newIndex];
        if (!isWorkspaceIgnored(ignoredWorkspaces, targetWS)) {
            hyprlandService.message_async(`dispatch workspace ${targetWS}`);
            return;
        }
        newIndex = (newIndex + step + workspacesList.length) % workspacesList.length;
        attempts++;
    }
};

export const goToNextWS = (
    currentMonitorWorkspaces: Variable<number[]>,
    activeWorkspaces: boolean,
    ignoredWorkspaces: Variable<string>,
): void => {
    navigateWorkspace('next', currentMonitorWorkspaces, activeWorkspaces, ignoredWorkspaces);
};

export const goToPrevWS = (
    currentMonitorWorkspaces: Variable<number[]>,
    activeWorkspaces: boolean,
    ignoredWorkspaces: Variable<string>,
): void => {
    navigateWorkspace('prev', currentMonitorWorkspaces, activeWorkspaces, ignoredWorkspaces);
};

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

export const getWorkspacesToRender = (
    totalWorkspaces: number,
    workspaceList: AstalHyprland.Workspace[],
    workspaceRules: WorkspaceMap,
    monitor: number,
    isMonitorSpecific: boolean,
): number[] => {
    let allWorkspaces = range(totalWorkspaces || 8);
    const activeWorkspaces = workspaceList.map((ws) => ws.id);

    const hyprlandWorkspaces = hyprlandService.get_workspaces() || [];
    const workspaceMonitorList = hyprlandWorkspaces.map((ws) => {
        return {
            id: ws.monitor?.id || -1,
            name: ws.monitor?.name || '',
        };
    });

    const curMonitor =
        hyprlandService.get_monitors().find((mon) => mon.id === monitor) ||
        workspaceMonitorList.find((mon) => mon.id === monitor);

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
            return getWorkspacesForMonitor(ws, workspaceRules, monitor);
        });

        allWorkspaces = [...new Set([...activesForMonitor, ...workspacesInRange])];
    } else {
        allWorkspaces = [...new Set([...allWorkspaces, ...activeWorkspaces])];
    }

    return allWorkspaces.sort((a, b) => a - b);
};

export const workspaceRules = Variable(getWorkspaceRules());
export const forceUpdater = Variable(true);

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
