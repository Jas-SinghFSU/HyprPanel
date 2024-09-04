const hyprland = await Service.import("hyprland");

import { WorkspaceMap, WorkspaceRule } from "lib/types/workspace";
import options from "options";
import { Variable } from "types/variable";

const {
    workspaces,
    reverse_scroll,
} = options.bar.workspaces;


export const getWorkspacesForMonitor = (curWs: number, wsRules: WorkspaceMap, monitor: number): boolean => {
    if (!wsRules || !Object.keys(wsRules).length) {
        return true;
    }

    const monitorMap = {};
    const workspaceMonitorList = hyprland?.workspaces?.map(m => ({ id: m.monitorID, name: m.monitor }));
    const monitors = [...new Map([...workspaceMonitorList, ...hyprland.monitors].map(item => [item.id, item])).values()];

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
        const rules = Utils.exec("hyprctl workspacerules -j");

        const workspaceRules = {};

        JSON.parse(rules).forEach((rule: WorkspaceRule, index: number) => {
            if (Object.hasOwnProperty.call(workspaceRules, rule.monitor)) {
                const workspaceNum = parseInt(rule.workspaceString, 10);
                if (!isNaN(workspaceNum)) {
                    workspaceRules[rule.monitor].push(workspaceNum);
                }
            } else {
                workspaceRules[rule.monitor] = [index + 1];
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
    const monitorMap = {};
    hyprland.monitors.forEach((m) => (monitorMap[m.id] = m.name));

    const currentMonitorName = monitorMap[monitor];

    return monitorWorkspaces[currentMonitorName];
}

export const goToNextWS = (currentMonitorWorkspaces: Variable<number[]>, activeWorkspaces: boolean): void => {
    if (activeWorkspaces === true) {
        const activeWses = hyprland.workspaces.filter((ws) => hyprland.active.monitor.id === ws.monitorID);

        let nextIndex = hyprland.active.workspace.id + 1;
        if (nextIndex > activeWses[activeWses.length - 1].id) {

            nextIndex = activeWses[0].id;
        }

        hyprland.messageAsync(`dispatch workspace ${nextIndex}`)
    } else if (currentMonitorWorkspaces.value === undefined) {
        let nextIndex = hyprland.active.workspace.id + 1;
        if (nextIndex > workspaces.value) {
            nextIndex = 0;
        }

        hyprland.messageAsync(`dispatch workspace ${nextIndex}`)
    } else {
        const curWorkspace = hyprland.active.workspace.id;
        const indexOfWs = currentMonitorWorkspaces.value.indexOf(curWorkspace);
        let nextIndex = indexOfWs + 1;
        if (nextIndex >= currentMonitorWorkspaces.value.length) {
            nextIndex = 0;
        }

        hyprland.messageAsync(`dispatch workspace ${currentMonitorWorkspaces.value[nextIndex]}`)
    }
}

export const goToPrevWS = (currentMonitorWorkspaces: Variable<number[]>, activeWorkspaces: boolean): void => {
    if (activeWorkspaces === true) {
        const activeWses = hyprland.workspaces.filter((ws) => hyprland.active.monitor.id === ws.monitorID);

        let prevIndex = hyprland.active.workspace.id - 1;
        if (prevIndex < activeWses[0].id) {

            prevIndex = activeWses[activeWses.length - 1].id;
        }

        hyprland.messageAsync(`dispatch workspace ${prevIndex}`)
    } else if (currentMonitorWorkspaces.value === undefined) {
        let prevIndex = hyprland.active.workspace.id - 1;

        if (prevIndex <= 0) {
            prevIndex = workspaces.value;
        }

        hyprland.messageAsync(`dispatch workspace ${prevIndex}`)
    } else {
        const curWorkspace = hyprland.active.workspace.id;
        const indexOfWs = currentMonitorWorkspaces.value.indexOf(curWorkspace);
        let prevIndex = indexOfWs - 1;
        if (prevIndex < 0) {
            prevIndex = currentMonitorWorkspaces.value.length - 1;
        }

        hyprland.messageAsync(`dispatch workspace ${currentMonitorWorkspaces.value[prevIndex]}`)
    }
}

export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
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

type ThrottledScrollHandlers = {
    throttledScrollUp: () => void;
    throttledScrollDown: () => void;
};

export const createThrottledScrollHandlers = (scrollSpeed: number, currentMonitorWorkspaces: Variable<number[]>, activeWorkspaces: boolean = false): ThrottledScrollHandlers => {
    const throttledScrollUp = throttle(() => {
        if (reverse_scroll.value === true) {
            goToPrevWS(currentMonitorWorkspaces, activeWorkspaces);
        } else {
            goToNextWS(currentMonitorWorkspaces, activeWorkspaces);
        }
    }, 200 / scrollSpeed);

    const throttledScrollDown = throttle(() => {
        if (reverse_scroll.value === true) {
            goToNextWS(currentMonitorWorkspaces, activeWorkspaces);
        } else {
            goToPrevWS(currentMonitorWorkspaces, activeWorkspaces);
        }
    }, 200 / scrollSpeed);

    return { throttledScrollUp, throttledScrollDown };
}
