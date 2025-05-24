import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import options from 'src/configuration';
import { WorkspaceService } from 'src/services/workspace';

const workspaceService = WorkspaceService.getInstance();

const hyprlandService = AstalHyprland.get_default();
const { reverse_scroll } = options.bar.workspaces;

/**
 * Limits the execution rate of a given function to prevent it from being called too often.
 *
 * @param func - The function to be throttled.
 * @param limit - The time limit (in milliseconds) during which calls to `func` are disallowed after the first call.
 *
 * @returns The throttled version of the input function.
 */
function throttle<T extends (...args: unknown[]) => void>(func: T, limit: number): T {
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
            workspaceService.goToPreviousWorkspace();
        } else {
            workspaceService.goToNextWorkspace();
        }
    }, 200 / scrollSpeed);

    const throttledScrollDown = throttle(() => {
        if (reverse_scroll.get()) {
            workspaceService.goToNextWorkspace();
        } else {
            workspaceService.goToPreviousWorkspace();
        }
    }, 200 / scrollSpeed);

    return { throttledScrollUp, throttledScrollDown };
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
        workspaceService.refreshWorkspaceRules();
    });

    hyprlandService.connect('client-moved', () => {
        workspaceService.forceAnUpdate();
    });

    hyprlandService.connect('client-added', () => {
        workspaceService.forceAnUpdate();
    });

    hyprlandService.connect('client-removed', () => {
        workspaceService.forceAnUpdate();
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
