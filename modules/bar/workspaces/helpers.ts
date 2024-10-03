const hyprland = await Service.import('hyprland');

import { MonitorMap, WorkspaceMap, WorkspaceRule } from 'lib/types/workspace';
import options from 'options';
import { Variable } from 'types/variable';

const { workspaces, reverse_scroll, ignored } = options.bar.workspaces;

export const getWorkspacesForMonitor = (curWs: number, wsRules: WorkspaceMap, monitor: number): boolean => {
    if (!wsRules || !Object.keys(wsRules).length) {
        return true;
    }

    const monitorMap: MonitorMap = {};
    const workspaceMonitorList = hyprland?.workspaces?.map((m) => ({ id: m.monitorID, name: m.monitor }));
    const monitors = [
        ...new Map([...workspaceMonitorList, ...hyprland.monitors].map((item) => [item.id, item])).values(),
    ];

    monitors.forEach((m) => (monitorMap[m.id] = m.name));

    const currentMonitorName = monitorMap[monitor];
    const monitorWSRules = wsRules[currentMonitorName];

    if (monitorWSRules === undefined) {
        return true;
    }
    return monitorWSRules.includes(curWs);
};

export const getWorkspaceRules = (): WorkspaceMap => {
    try {
        const rules = Utils.exec('hyprctl workspacerules -j');

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
    if (hyprland.monitors.length === 1) {
        return Array.from({ length: workspaces.value }, (_, i) => i + 1);
    }

    const monitorWorkspaces = getWorkspaceRules();
    const monitorMap: MonitorMap = {};
    hyprland.monitors.forEach((m) => (monitorMap[m.id] = m.name));

    const currentMonitorName = monitorMap[monitor];

    return monitorWorkspaces[currentMonitorName];
};

type ThrottledScrollHandlers = {
    throttledScrollUp: () => void;
    throttledScrollDown: () => void;
};

export const isWorkspaceIgnored = (ignoredWorkspaces: Variable<string>, workspaceNumber: number): boolean => {
    if (ignoredWorkspaces.value === '') return false;

    const ignoredWsRegex = new RegExp(ignoredWorkspaces.value);

    return ignoredWsRegex.test(workspaceNumber.toString());
};

const navigateWorkspace = (
    direction: 'next' | 'prev',
    currentMonitorWorkspaces: Variable<number[]>,
    activeWorkspaces: boolean,
    ignoredWorkspaces: Variable<string>,
): void => {
    const workspacesList = activeWorkspaces
        ? hyprland.workspaces.filter((ws) => hyprland.active.monitor.id === ws.monitorID).map((ws) => ws.id)
        : currentMonitorWorkspaces.value || Array.from({ length: workspaces.value }, (_, i) => i + 1);

    if (workspacesList.length === 0) return;

    const currentIndex = workspacesList.indexOf(hyprland.active.workspace.id);
    const step = direction === 'next' ? 1 : -1;
    let newIndex = (currentIndex + step + workspacesList.length) % workspacesList.length;
    let attempts = 0;

    while (attempts < workspacesList.length) {
        const targetWS = workspacesList[newIndex];
        if (!isWorkspaceIgnored(ignoredWorkspaces, targetWS)) {
            hyprland.messageAsync(`dispatch workspace ${targetWS}`);
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
    activeWorkspaces: boolean = false,
): ThrottledScrollHandlers => {
    const throttledScrollUp = throttle(() => {
        if (reverse_scroll.value) {
            goToPrevWS(currentMonitorWorkspaces, activeWorkspaces, ignored);
        } else {
            goToNextWS(currentMonitorWorkspaces, activeWorkspaces, ignored);
        }
    }, 200 / scrollSpeed);

    const throttledScrollDown = throttle(() => {
        if (reverse_scroll.value) {
            goToNextWS(currentMonitorWorkspaces, activeWorkspaces, ignored);
        } else {
            goToPrevWS(currentMonitorWorkspaces, activeWorkspaces, ignored);
        }
    }, 200 / scrollSpeed);

    return { throttledScrollUp, throttledScrollDown };
};
